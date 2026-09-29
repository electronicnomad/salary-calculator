import {
  EMPLOYMENT_INSURANCE_EMPLOYEE_RATE,
  HEALTH_INSURANCE_EMPLOYEE_RATE,
  LONG_TERM_CARE_RATIO_TO_HEALTH,
  NATIONAL_PENSION,
} from './rates2026.js';
import { floorToTen, floorToUnit, floorToWon } from './rounding.js';

// 절사 단위: 국민연금/고용보험 원 미만, 건강보험/장기요양보험 10원 미만
export function calculateInsurance(monthlyTaxablePay) {
  const healthInsurance = floorToTen(monthlyTaxablePay * HEALTH_INSURANCE_EMPLOYEE_RATE);
  return {
    nationalPension: floorToWon(pensionBase(monthlyTaxablePay) * NATIONAL_PENSION.employeeRate),
    healthInsurance,
    longTermCare: floorToTen(healthInsurance * LONG_TERM_CARE_RATIO_TO_HEALTH),
    employmentInsurance: floorToWon(monthlyTaxablePay * EMPLOYMENT_INSURANCE_EMPLOYEE_RATE),
  };
}

function pensionBase(monthlyTaxablePay) {
  if (monthlyTaxablePay <= 0) {
    return 0;
  }
  const { minMonthlyBase, maxMonthlyBase, baseUnit } = NATIONAL_PENSION;
  const truncatedPay = floorToUnit(monthlyTaxablePay, baseUnit);
  return Math.min(Math.max(truncatedPay, minMonthlyBase), maxMonthlyBase);
}
