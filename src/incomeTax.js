import {
  CHILD_TAX_CREDIT,
  EARNED_INCOME_DEDUCTION,
  EARNED_INCOME_TAX_CREDIT,
  EARNED_INCOME_TAX_CREDIT_LIMITS,
  INCOME_TAX_BRACKETS,
  PERSONAL_DEDUCTION_PER_DEPENDENT,
} from './rates2026.js';

// 연말정산 기준 연간 소득세(결정세액)를 추정한다.
// 공제 항목: 근로소득공제, 인적공제, 연금보험료공제, 보험료 특별소득공제,
// 근로소득세액공제, 자녀세액공제
export function calculateAnnualIncomeTax({
  annualTaxablePay,
  annualPensionPremium,
  annualInsurancePremium,
  dependents,
  children,
}) {
  const earnedIncome = annualTaxablePay - earnedIncomeDeduction(annualTaxablePay);
  const incomeDeductions = dependents * PERSONAL_DEDUCTION_PER_DEPENDENT
    + annualPensionPremium
    + annualInsurancePremium;
  const taxBase = Math.max(0, earnedIncome - incomeDeductions);
  const computedTax = progressiveTax(taxBase);
  const taxCredits = earnedIncomeTaxCredit(computedTax, annualTaxablePay) + childTaxCredit(children);
  return Math.floor(Math.max(0, computedTax - taxCredits));
}

function findBracket(brackets, amount) {
  return brackets.find((bracket) => amount <= bracket.upTo);
}

export function earnedIncomeDeduction(annualTaxablePay) {
  const { threshold, baseDeduction, rate } = findBracket(EARNED_INCOME_DEDUCTION.brackets, annualTaxablePay);
  const deduction = baseDeduction + (annualTaxablePay - threshold) * rate;
  return Math.min(deduction, EARNED_INCOME_DEDUCTION.limit);
}

export function progressiveTax(taxBase) {
  const { rate, progressiveDeduction } = findBracket(INCOME_TAX_BRACKETS, taxBase);
  return Math.max(0, taxBase * rate - progressiveDeduction);
}

function earnedIncomeTaxCredit(computedTax, annualTaxablePay) {
  const { lowerTaxLimit, lowerRate, upperBaseCredit, upperRate } = EARNED_INCOME_TAX_CREDIT;
  const credit = computedTax <= lowerTaxLimit
    ? computedTax * lowerRate
    : upperBaseCredit + (computedTax - lowerTaxLimit) * upperRate;
  return Math.min(credit, earnedIncomeTaxCreditLimit(annualTaxablePay));
}

function earnedIncomeTaxCreditLimit(annualTaxablePay) {
  const { threshold, baseLimit, reductionRate, floor } = findBracket(
    EARNED_INCOME_TAX_CREDIT_LIMITS,
    annualTaxablePay,
  );
  return Math.max(baseLimit - (annualTaxablePay - threshold) * reductionRate, floor);
}

export function childTaxCredit(children) {
  const { firstChild, twoChildren, perAdditionalChild } = CHILD_TAX_CREDIT;
  if (children <= 0) {
    return 0;
  }
  if (children === 1) {
    return firstChild;
  }
  return twoChildren + (children - 2) * perAdditionalChild;
}
