import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculatePayrollFromNet } from '../src/payroll.js';
import { MAX_AMOUNT, validationError } from '../src/validation.js';

const validHousehold = { monthlyNonTaxable: 200_000, dependents: 1, children: 0 };

test('금액이 1조원을 넘으면 오류', () => {
  const error = validationError({ amount: MAX_AMOUNT + 1, household: validHousehold });
  assert.equal(error, '금액은 1조원 이하여야 합니다.');
});

test('금액 1조원까지는 허용', () => {
  const error = validationError({ amount: MAX_AMOUNT, household: validHousehold });
  assert.equal(error, '');
});

test('세후 금액 역산은 입력 상한 금액에서도 동작', () => {
  const payroll = calculatePayrollFromNet(MAX_AMOUNT, validHousehold);
  assert.ok(payroll.monthlyNet >= MAX_AMOUNT);
});
