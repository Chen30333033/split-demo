const frame = document.querySelector('#page');
const report = document.querySelector('#report');

frame.addEventListener('load', () => {
  const app = frame.contentDocument;
  const form = app?.querySelector('#split-form');
  if (!form) return;
  const total = app.querySelector('#total');
  const people = app.querySelector('#people');
  const result = app.querySelector('#result');
  const error = app.querySelector('#error');
  const reset = form.querySelector('button[type="reset"]');
  const results = [];
  form.addEventListener('submit', (event) => event.preventDefault());

  function equal(actual, expected) {
    if (actual !== expected) throw new Error('Expected ' + expected + ', got ' + actual);
  }

  function submit(amount, count) {
    total.value = amount;
    people.value = count;
    form.requestSubmit();
  }

  function test(name, assertion) {
    try {
      assertion();
      results.push('PASS ' + name);
    } catch (failure) {
      results.push('FAIL ' + name + ' - ' + failure.message);
    }
  }

  function expectCleared() {
    equal(total.value, '');
    equal(people.value, '');
    equal(result.textContent, '');
    equal(error.textContent, '');
    equal(app.activeElement.id, 'total');
  }

  // spectra-scenario: equal-split-calculator / Calculate an exact share
  test('exact share replaces error', () => {
    submit('900', '0');
    submit('900', '3');
    equal(result.textContent, '每人應付 300 元');
    equal(error.textContent, '');
  });

  // spectra-scenario: equal-split-calculator / Calculate a rounded share
  test('rounded share', () => {
    submit('100', '3');
    equal(result.textContent, '每人約 33.33 元');
    submit('0.01', '2');
    equal(result.textContent, '每人約 0.01 元');
  });

  // spectra-scenario: equal-split-calculator / Reject a zero headcount
  test('zero headcount replaces old result', () => {
    submit('900', '3');
    submit('900', '0');
    equal(people.getAttribute('aria-invalid'), 'true');
    equal(result.textContent, '');
    equal(error.textContent, '人數必須是大於 0 的整數');
  });

  // spectra-scenario: equal-split-calculator / Reject an empty total
  test('empty total', () => {
    submit('', '3');
    equal(total.getAttribute('aria-invalid'), 'true');
    equal(result.textContent, '');
    if (!error.textContent.includes('金額')) throw new Error('Missing total-specific error');
  });

  // spectra-scenario: equal-split-calculator / Clear a displayed result
  test('clear calculated result', () => {
    submit('900', '3');
    equal(result.textContent, '每人應付 300 元');
    reset.click();
    expectCleared();
  });

  // spectra-scenario: equal-split-calculator / Clear a validation error
  test('clear validation error', () => {
    submit('900', '0');
    equal(people.getAttribute('aria-invalid'), 'true');
    reset.click();
    expectCleared();
    equal(people.hasAttribute('aria-invalid'), false);
  });

  report.textContent = results.join('\n');
  report.dataset.status = results.every((line) => line.startsWith('PASS')) ? 'passed' : 'failed';
});

if (window.calculatorTestDocument) {
  frame.srcdoc = window.calculatorTestDocument;
} else {
  frame.src = '../index.html';
}




