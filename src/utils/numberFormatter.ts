export function formatStringToNumber(value: string): number {
    const hasDecimal = /[.,]\d{0,2}$/.test(value);

    const numericString = hasDecimal ? value.slice(0, -3).replace(/\D/g, '') : value.replace(/\D/g, '');

    return parseFloat(numericString) || 0;
}

export function formatNumberToString(value: string | number): string {
    let numberValue: number;
    if (typeof value === 'string') {
        numberValue = formatStringToNumber(value);
    } else {
        numberValue = value;
    }

    const strValue = String(numberValue);
    const onlyNumber = strValue.replace(/\D/g, '')
    return onlyNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}