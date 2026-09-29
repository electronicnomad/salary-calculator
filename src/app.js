import { calculatePayrollFromGross, calculatePayrollFromNet } from './payroll.js';
import { MONTHS_PER_YEAR } from './rates2026.js';
import { validationError } from './validation.js';

const DEDUCTION_LABELS = {
  nationalPension: '국민연금',
  healthInsurance: '건강보험',
  longTermCare: '장기요양보험',
  employmentInsurance: '고용보험',
  incomeTax: '소득세',
  localIncomeTax: '지방소득세',
};

const AMOUNT_LABELS = {
  'gross-annual': '세전 연봉',
  'gross-monthly': '세전 월급',
  'net-annual': '세후 연 실수령액',
  'net-monthly': '세후 월 실수령액',
};

const form = document.getElementById('salary-form');
const moneyInputs = [document.getElementById('amount'), document.getElementById('non-taxable')];

const wonFormatter = new Intl.NumberFormat('ko-KR');

function formatWon(amount) {
  return `${wonFormatter.format(amount)}원`;
}

function parseWon(text) {
  return Number(text.replace(/[^\d]/g, ''));
}

function readForm() {
  const data = new FormData(form);
  return {
    period: data.get('period'),
    basis: data.get('basis'),
    amount: parseWon(data.get('amount')),
    household: {
      monthlyNonTaxable: parseWon(data.get('nonTaxable')),
      dependents: Number(data.get('dependents')),
      children: Number(data.get('children')),
    },
  };
}

function toMonthly(amount, period) {
  return period === 'annual' ? Math.round(amount / MONTHS_PER_YEAR) : amount;
}

function calculate({ period, basis, amount, household }) {
  const monthlyAmount = toMonthly(amount, period);
  const payroll = basis === 'gross'
    ? calculatePayrollFromGross(monthlyAmount, household)
    : calculatePayrollFromNet(monthlyAmount, household);
  const isGrossAnnualInput = basis === 'gross' && period === 'annual';
  const annualGross = isGrossAnnualInput ? amount : payroll.monthlyGross * MONTHS_PER_YEAR;
  return { payroll, annualGross };
}

function row(label, monthly, annual, className = '') {
  return `<tr class="${className}"><td>${label}</td><td>${formatWon(monthly)}</td><td>${formatWon(annual)}</td></tr>`;
}

function renderBreakdown({ payroll, annualGross }) {
  const { deductions, totalDeduction, monthlyGross, monthlyNet } = payroll;
  const annualDeduction = totalDeduction * MONTHS_PER_YEAR;
  const deductionRows = Object.entries(deductions)
    .map(([key, monthly]) => row(DEDUCTION_LABELS[key], monthly, monthly * MONTHS_PER_YEAR, 'deduction'));
  document.getElementById('breakdown-body').innerHTML = [
    row('세전 급여', monthlyGross, annualGross, 'subtotal'),
    ...deductionRows,
    row('공제 합계', totalDeduction, annualDeduction, 'subtotal deduction'),
    row('실수령액', monthlyNet, annualGross - annualDeduction, 'total'),
  ].join('');
}

function renderSummary({ payroll, annualGross }) {
  const annualNet = annualGross - payroll.totalDeduction * MONTHS_PER_YEAR;
  const netRatio = annualGross > 0 ? (annualNet / annualGross) * 100 : 0;
  document.getElementById('contract-annual').textContent = formatWon(annualGross);
  document.getElementById('net-monthly').textContent = formatWon(payroll.monthlyNet);
  document.getElementById('net-annual').textContent = formatWon(annualNet);
  document.getElementById('net-ratio').textContent = `${netRatio.toFixed(1)}%`;
  document.getElementById('ratio-bar-net').style.width = `${netRatio}%`;
}

function update() {
  const input = readForm();
  document.getElementById('amount-label').textContent = AMOUNT_LABELS[`${input.basis}-${input.period}`];
  const error = validationError(input);
  document.getElementById('form-error').textContent = error;
  if (error) {
    return;
  }
  const result = calculate(input);
  renderSummary(result);
  renderBreakdown(result);
}

function formatMoneyInput(event) {
  const amount = parseWon(event.target.value);
  event.target.value = amount > 0 ? wonFormatter.format(amount) : '';
}

moneyInputs.forEach((input) => input.addEventListener('input', formatMoneyInput));
form.addEventListener('input', update);
form.addEventListener('submit', (event) => event.preventDefault());
update();
