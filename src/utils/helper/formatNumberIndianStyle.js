export const formatIndianNumber = (num) => {
    const parsed = Number(num);
    if (isNaN(parsed)) return num;
    return parsed.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};