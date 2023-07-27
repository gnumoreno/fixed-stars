export const padWithLeadingZeros = (num: number | string, totalLength: number) => {
    if(String(num).includes("NaN")) {
        return "".padStart(totalLength, '0');
    }
    return String(num).padStart(totalLength, '0');
}

export const isNumeric = (num: number | string) => {
    const number = Number(num)
    return !isNaN(number)
}

