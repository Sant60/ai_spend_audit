export function calculateSavings(
  currentSpend: number,
  recommendedSpend: number,
) {
  return Math.max(0, currentSpend - recommendedSpend);
}
