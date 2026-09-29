import { calculateAnnualIncomeTax } from './incomeTax.js';
import { calculateInsurance } from './insurance.js';
import { LOCAL_INCOME_TAX_RATE, MONTHS_PER_YEAR } from './rates2026.js';
import { floorToTen } from './rounding.js';

// household: { monthlyNonTaxable, dependents, children }
export function calculatePayrollFromGross(monthlyGross, household) {
  const monthlyTaxable = Math.max(0, monthlyGross - household.monthlyNonTaxable);
  const insurance = calculateInsurance(monthlyTaxable);
  const incomeTax = monthlyIncomeTax(monthlyTaxable, insurance, household);
  const deductions = {
    ...insurance,
    incomeTax,
    localIncomeTax: floorToTen(incomeTax * LOCAL_INCOME_TAX_RATE),
  };
  const totalDeduction = Object.values(deductions).reduce((sum, amount) => sum + amount, 0);
  return {
    monthlyGross,
    deductions,
    totalDeduction,
    monthlyNet: monthlyGross - totalDeduction,
  };
}

function monthlyIncomeTax(monthlyTaxable, insurance, household) {
  const { nationalPension, healthInsurance, longTermCare, employmentInsurance } = insurance;
  const annualTax = calculateAnnualIncomeTax({
    annualTaxablePay: monthlyTaxable * MONTHS_PER_YEAR,
    annualPensionPremium: nationalPension * MONTHS_PER_YEAR,
    annualInsurancePremium: (healthInsurance + longTermCare + employmentInsurance) * MONTHS_PER_YEAR,
    dependents: household.dependents,
    children: household.children,
  });
  return floorToTen(annualTax / MONTHS_PER_YEAR);
}

// 목표 실수령액 이상이 되는 최소 세전 월급을 이분 탐색으로 찾는다.
export function calculatePayrollFromNet(targetMonthlyNet, household) {
  const netOf = (monthlyGross) => calculatePayrollFromGross(monthlyGross, household).monthlyNet;
  let low = 0;
  let high = Math.max(1, targetMonthlyNet);
  while (netOf(high) < targetMonthlyNet) {
    high *= 2;
  }
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (netOf(middle) < targetMonthlyNet) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }
  return calculatePayrollFromGross(low, household);
}
