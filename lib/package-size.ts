export function getBasePackageGrams(productName: string) {
  const match = productName.match(/\((\d+)\s*g\)/i) ?? productName.match(/\b(\d+)\s*g\b/i);
  return match ? Number(match[1]) : 250;
}

export function getAvailablePackageSizes(basePackageGrams: number) {
  return [1, 2, 4].map((multiple) => basePackageGrams * multiple);
}

export function isAvailablePackageSize(productName: string, packageGrams: number) {
  return getAvailablePackageSizes(getBasePackageGrams(productName)).includes(packageGrams);
}

export function formatPackageGrams(grams: number) {
  return grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;
}
