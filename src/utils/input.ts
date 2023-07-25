export const padWithLeadingZeros = (num: number | string, totalLength: number) => {
    return String(num).padStart(totalLength, '0');
}

export const isNumeric = (num: number | string) => {
    const number = Number(num)
    return !isNaN(number)
}

const daysInMonth = (m: number, y: number) => {
    switch (m) {
        case 1:
            return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
        case 8: case 3: case 5: case 10:
            return 30;
        default:
            return 31
    }
};

const isValidDate = (d: number, m: number, y: number) => {
    m = m - 1;
    return m >= 0 && m < 12 && d > 0 && d <= daysInMonth(m, y);
};