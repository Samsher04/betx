import { useMemo, useCallback } from "react";

const useHexToRgb = (hex) => {
  // Memoized HEX to RGB conversion function
  const hexToRgb = useCallback((hex) => {
    if (!hex) return null;
    const normalizedHex = hex.replace("#", "");

    if (normalizedHex?.length !== 6) return null; // Ensure valid HEX

    const r = parseInt(normalizedHex.substring(0, 2), 16);
    const g = parseInt(normalizedHex.substring(2, 4), 16);
    const b = parseInt(normalizedHex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
  }, []);

  // Compute the RGB value and memoize it
  const rgb = useMemo(() => hexToRgb(hex), [hex, hexToRgb]);

  return rgb;
};

export default useHexToRgb;
