export const getCurrentMatchExposure = (currentMatchBets) => {

    if (!Array.isArray(currentMatchBets)) return 0;

    const totalExposure = currentMatchBets.reduce((acc, bet) => {
        const againstMargin = Number(bet.againstMargin || 0);
        return acc + againstMargin;
    }, 0);

    return totalExposure;
};
