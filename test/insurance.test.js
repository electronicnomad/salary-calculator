import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateInsurance } from '../src/insurance.js';

test('국민연금은 과세급여의 4.75%', () => {
  assert.equal(calculateInsurance(3_000_000).nationalPension, 142_500);
});

test('국민연금은 기준소득월액 상한 659만원까지만 부과', () => {
  assert.equal(calculateInsurance(10_000_000).nationalPension, 313_025);
});

test('국민연금은 기준소득월액 하한 41만원으로 부과', () => {
  assert.equal(calculateInsurance(300_000).nationalPension, 19_475);
});

test('국민연금 기준소득월액은 천원 미만 절사', () => {
  assert.equal(calculateInsurance(3_000_999).nationalPension, 142_500);
});

test('과세급여가 없으면 국민연금도 없음', () => {
  assert.equal(calculateInsurance(0).nationalPension, 0);
});

test('건강보험은 과세급여의 3.595%, 10원 미만 절사', () => {
  assert.equal(calculateInsurance(3_000_000).healthInsurance, 107_850);
});

test('장기요양보험은 건강보험료의 13.14%, 10원 미만 절사', () => {
  assert.equal(calculateInsurance(3_000_000).longTermCare, 14_170);
});

test('고용보험은 과세급여의 0.9%', () => {
  assert.equal(calculateInsurance(3_000_000).employmentInsurance, 27_000);
});
