// 금액이 너무 크면 세후 금액 역산의 이분 탐색이 안전한 정수 범위를 넘어 끝나지 않는다.
export const MAX_AMOUNT = 1_000_000_000_000;

export function validationError({ amount, household }) {
  const { dependents, children } = household;
  if (amount <= 0) {
    return '금액을 입력하세요.';
  }
  if (amount > MAX_AMOUNT) {
    return '금액은 1조원 이하여야 합니다.';
  }
  if (!Number.isInteger(dependents) || dependents < 1) {
    return '부양가족 수는 본인을 포함해 1명 이상이어야 합니다.';
  }
  if (!Number.isInteger(children) || children < 0 || children >= dependents) {
    return '자녀 수는 0명 이상, 부양가족 수보다 적어야 합니다.';
  }
  return '';
}
