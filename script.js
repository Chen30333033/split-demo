'use strict';

const form = document.getElementById('split-form');
const total = document.getElementById('total');
const people = document.getElementById('people');
const result = document.getElementById('result');
const error = document.getElementById('error');
const formatDollars = new Intl.NumberFormat('zh-TW');

function clearFeedback() {
  result.textContent = '';
  error.textContent = '';
  for (const field of [total, people]) {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-errormessage');
  }
}

function showError(field, message) {
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-errormessage', 'error');
  error.textContent = message;
  field.focus();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearFeedback();

  const amount = total.value.trim();
  if (!/^(?:[0-9]+(?:\.[0-9]{1,2})?|\.[0-9]{1,2})$/.test(amount)) {
    showError(total, '請輸入大於 0 的總金額，最多兩位小數');
    return;
  }
  const [dollars, cents = ''] = amount.split('.');
  const totalCents = BigInt(dollars || '0') * 100n + BigInt(cents.padEnd(2, '0'));
  if (totalCents === 0n) {
    showError(total, '請輸入大於 0 的總金額，最多兩位小數');
    return;
  }

  const headcount = people.value.trim();
  if (!/^[0-9]+$/.test(headcount) || BigInt(headcount) === 0n) {
    showError(people, '人數必須是大於 0 的整數');
    return;
  }
  const count = BigInt(headcount);
  const remainder = totalCents % count;
  const approx = remainder !== 0n;
  let share = totalCents / count;
  if (remainder * 2n >= count) share += 1n;

  const wholeShare = formatDollars.format(share / 100n);
  const twoDigits = String(share % 100n).padStart(2, '0');
  const fraction = approx ? twoDigits : twoDigits.replace(/0+$/, '');
  const shareText = fraction ? wholeShare + '.' + fraction : wholeShare;

  result.textContent = (approx ? '每人約 ' : '每人應付 ') + shareText + ' 元';
});

form.addEventListener('reset', () => {
  clearFeedback();
  total.focus();
});

