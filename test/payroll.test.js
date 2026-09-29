import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculatePayrollFromGross, calculatePayrollFromNet } from '../src/payroll.js';

const singleWithMealAllowance = { monthlyNonTaxable: 200_000, dependents: 1, children: 0 };

test('세전 월 320만원(비과세 20만원)의 실수령액', () => {
  const payroll = calculatePayrollFromGross(3_200_000, singleWithMealAllowance);
  assert.equal(payroll.monthlyNet, 2_809_780);
});

test('지방소득세는 소득세의 10%', () => {
  const { deductions } = calculatePayrollFromGross(3_200_000, singleWithMealAllowance);
  assert.equal(deductions.localIncomeTax, 8_970);
});

test('비과세액이 급여보다 크면 공제액은 0', () => {
  const payroll = calculatePayrollFromGross(100_000, singleWithMealAllowance);
  assert.equal(payroll.totalDeduction, 0);
});

test('세후 금액으로 역산한 실수령액은 목표 이상 100원 미만 차이', () => {
  const targetNet = 2_809_780;
  const payroll = calculatePayrollFromNet(targetNet, singleWithMealAllowance);
  const difference = payroll.monthlyNet - targetNet;
  assert.ok(difference >= 0 && difference < 100, `difference: ${difference}`);
});

test('세후 금액 역산은 고소득 구간에서도 동작', () => {
  const targetNet = 15_000_000;
  const payroll = calculatePayrollFromNet(targetNet, singleWithMealAllowance);
  assert.ok(payroll.monthlyNet >= targetNet);
});
