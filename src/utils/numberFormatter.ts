export function formatStringToNumber(value: string): number {
    const hasDecimal = /[.,]\d{0,2}$/.test(value);

    const numericString = hasDecimal ? value.slice(0, -3).replace(/\D/g, '') : value.replace(/\D/g, '');

    return parseFloat(numericString) || 0;
}