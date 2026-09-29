import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  calculateAnnualIncomeTax,
  childTaxCredit,
  earnedIncomeDeduction,
  progressiveTax,
} from '../src/incomeTax.js';

test('근로소득공제: 총급여 3,600만원이면 1,065만원', () => {
  assert.equal(earnedIncomeDeduction(36_000_000), 10_650_000);
});

test('근로소득공제는 2,000만원 한도', () => {
  assert.equal(earnedIncomeDeduction(500_000_000), 20_000_000);
});

test('누진세율: 과세표준 1,400만원 이하는 6%', () => {
  assert.equal(progressiveTax(10_000_000), 600_000);
});

test('누진세율: 과세표준 1억원은 35% 구간', () => {
  assert.equal(progressiveTax(100_000_000), 19_560_000);
});

test('자녀세액공제: 1명 25만원', () => {
  assert.equal(childTaxCredit(1), 250_000);
});

test('자녀세액공제: 3명 95만원', () => {
  assert.equal(childTaxCredit(3), 950_000);
});

test('연간 소득세: 총급여 3,600만원, 본인 1인', () => {
  const tax = calculateAnnualIncomeTax({
    annualTaxablePay: 36_000_000,
    annualPensionPremium: 1_710_000,
    annualInsurancePremium: 1_788_240,
    dependents: 1,
    children: 0,
  });
  assert.equal(tax, 1_076_764);
});

test('세액공제가 산출세액보다 크면 소득세는 0', () => {
  const tax = calculateAnnualIncomeTax({
    annualTaxablePay: 12_000_000,
    annualPensionPremium: 0,
    annualInsurancePremium: 0,
    dependents: 1,
    children: 3,
  });
  assert.equal(tax, 0);
});
