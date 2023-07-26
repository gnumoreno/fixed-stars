export const padWithLeadingZeros = (num: number | string, totalLength: number) => {
    return String(num).padStart(totalLength, '0');
}

export const isNumeric = (num: number | string) => {
    const number = Number(num)
    return !isNaN(number)
}

