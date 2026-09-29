// 2026년 기준 요율. 매년 개정되므로 이 파일만 갱신하면 된다.

export const MONTHS_PER_YEAR = 12;

// 2026.1~ 보험료율 9.5% (근로자 4.75%), 기준소득월액 상하한은 2026.7~2027.6 적용분
export const NATIONAL_PENSION = {
  employeeRate: 0.0475,
  minMonthlyBase: 410_000,
  maxMonthlyBase: 6_590_000,
  baseUnit: 1_000,
};

export const HEALTH_INSURANCE_EMPLOYEE_RATE = 0.03595;

// 장기요양보험료 = 건강보험료 x (장기요양보험료율 0.9448% / 건강보험료율 7.19%)
export const LONG_TERM_CARE_RATIO_TO_HEALTH = 0.009448 / 0.0719;

export const EMPLOYMENT_INSURANCE_EMPLOYEE_RATE = 0.009;

export const LOCAL_INCOME_TAX_RATE = 0.1;

export const PERSONAL_DEDUCTION_PER_DEPENDENT = 1_500_000;

// 근로소득공제: baseDeduction + (총급여 - threshold) x rate
export const EARNED_INCOME_DEDUCTION = {
  limit: 20_000_000,
  brackets: [
    { upTo: 5_000_000, threshold: 0, baseDeduction: 0, rate: 0.7 },
    { upTo: 15_000_000, threshold: 5_000_000, baseDeduction: 3_500_000, rate: 0.4 },
    { upTo: 45_000_000, threshold: 15_000_000, baseDeduction: 7_500_000, rate: 0.15 },
    { upTo: 100_000_000, threshold: 45_000_000, baseDeduction: 12_000_000, rate: 0.05 },
    { upTo: Infinity, threshold: 100_000_000, baseDeduction: 14_750_000, rate: 0.02 },
  ],
};

// 종합소득세율: 과세표준 x rate - progressiveDeduction
export const INCOME_TAX_BRACKETS = [
  { upTo: 14_000_000, rate: 0.06, progressiveDeduction: 0 },
  { upTo: 50_000_000, rate: 0.15, progressiveDeduction: 1_260_000 },
  { upTo: 88_000_000, rate: 0.24, progressiveDeduction: 5_760_000 },
  { upTo: 150_000_000, rate: 0.35, progressiveDeduction: 15_440_000 },
  { upTo: 300_000_000, rate: 0.38, progressiveDeduction: 19_940_000 },
  { upTo: 500_000_000, rate: 0.4, progressiveDeduction: 25_940_000 },
  { upTo: 1_000_000_000, rate: 0.42, progressiveDeduction: 35_940_000 },
  { upTo: Infinity, rate: 0.45, progressiveDeduction: 65_940_000 },
];

export const EARNED_INCOME_TAX_CREDIT = {
  lowerTaxLimit: 1_300_000,
  lowerRate: 0.55,
  upperBaseCredit: 715_000,
  upperRate: 0.3,
};

// 근로소득세액공제 한도: max(baseLimit - (총급여 - threshold) x reductionRate, floor)
export const EARNED_INCOME_TAX_CREDIT_LIMITS = [
  { upTo: 33_000_000, threshold: 0, baseLimit: 740_000, reductionRate: 0, floor: 740_000 },
  { upTo: 70_000_000, threshold: 33_000_000, baseLimit: 740_000, reductionRate: 0.008, floor: 660_000 },
  { upTo: 120_000_000, threshold: 70_000_000, baseLimit: 660_000, reductionRate: 0.5, floor: 500_000 },
  { upTo: Infinity, threshold: 120_000_000, baseLimit: 500_000, reductionRate: 0.5, floor: 200_000 },
];

// 자녀세액공제 (8세 이상 20세 이하): 1명 25만, 2명 55만, 3명부터 1명당 40만 추가
export const CHILD_TAX_CREDIT = {
  firstChild: 250_000,
  twoChildren: 550_000,
  perAdditionalChild: 400_000,
};
