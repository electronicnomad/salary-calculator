// 부동소수점 오차(예: 107849.99999)로 절사 단위만큼 깎이지 않도록 보정한다.
const FLOATING_POINT_TOLERANCE = 1e-6;

export function floorToUnit(amount, unit) {
  return Math.floor((amount + FLOATING_POINT_TOLERANCE) / unit) * unit;
}

export function floorToWon(amount) {
  return floorToUnit(amount, 1);
}

export function floorToTen(amount) {
  return floorToUnit(amount, 10);
}
