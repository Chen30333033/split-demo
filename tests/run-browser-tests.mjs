import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const load = (file) => readFile(new URL(file, import.meta.url), 'utf8');
const [app, css, script, tests, template] = await Promise.all([
  load('../index.html'),
  load('../styles.css'),
  load('../script.js').catch((error) => {
    if (error.code === 'ENOENT') return '';
    throw error;
  }),
  load('equal-split.test.js'),
  load('equal-split.html'),
]);
const appDocument = app
  .replace('<link rel="stylesheet" href="styles.css">', () => '<style>' + css + '</style>')
  .replace('<script src="script.js" defer></script>', '')
  .replace('</body>', () => '<script>' + script + '</script></body>');
const frameContents = JSON.stringify(appDocument).replaceAll('<', '\\u003c');
const testDocument = template.replace('<script src="equal-split.test.js"></script>',
  () => '<script>window.calculatorTestDocument = ' + frameContents + ';\n' + tests + '</script>');

if (process.argv.includes('--prepare')) {
  const output = join(tmpdir(), 'equal-split-browser-results.html');
  await writeFile(output, testDocument, 'utf8');
  console.log(output);
  process.exit(0);
}

const folder = await mkdtemp(join(tmpdir(), 'equal-split-test-'));
try {
  const entry = join(folder, 'tests.html');
  await writeFile(entry, testDocument, 'utf8');
  const browser = process.env.SPLIT_TEST_BROWSER ||
    (process.platform === 'win32' ? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' : 'chromium');
  const child = spawn(browser, ['--headless', '--disable-gpu', '--no-first-run',
    '--user-data-dir=' + join(folder, 'profile'), '--dump-dom', '--timeout=8000', pathToFileURL(entry).href],
    { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8').on('data', (data) => { stdout += data; });
  child.stderr.setEncoding('utf8').on('data', (data) => { stderr += data; });
  const timeout = setTimeout(() => child.kill(), 20000);
  try {
    await new Promise((resolve, reject) => {
      child.on('error', reject);
      child.on('close', resolve);
    });
  } finally {
    clearTimeout(timeout);
  }
  const report = stdout.match(/<pre id="report" data-status="(passed|failed)">([\s\S]*?)<\/pre>/);
  if (!report) throw new Error('Browser tests did not finish. ' + stdout.slice(0, 350) + stderr);
  console.log(report[2]);
  if (report[1] !== 'passed') process.exitCode = 1;
} finally {
  await rm(folder, { recursive: true, force: true, maxRetries: 2, retryDelay: 100 });
}




