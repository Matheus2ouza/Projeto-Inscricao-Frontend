export function calculateGlobalIndex(
  localIndex: number,
  page: number = 1,
  pageSize: number = 9999999,
): number {
  return (page - 1) * pageSize + localIndex + 1;
}
