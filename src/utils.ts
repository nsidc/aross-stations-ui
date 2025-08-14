/**
 * Converts an HSLA color string (e.g., "hsla(240 100% 50% / 0.5)") to an RGBA array.
 * @param {string} hslaString The HSLA color string to convert.
 * @returns {[number, number, number, number] | null} The RGBA array, or null if the input is invalid.
 */
export const hslaToRgba = function (hslaString: string): [number, number, number, number] | null {
  // Regex to match hsla() string and capture h, s, l, and a values
  // This is in the form of hsl(240 100% 50% / 0.5); the hsl can be hsl or hsla
  const regex = /hsla?\((\d+)\s+(\d+)%\s+(\d+)%\s+\/\s+([\d.]+)\)/;
  const matches = hslaString.match(regex);

  if (!matches) {
    console.error("Invalid HSLA string format.");
    return null;
  }

  // Extract values and normalize them for calculation
  const h = parseInt(matches[1], 10) / 360; // Hue: 0-360 -> 0-1
  const s = parseInt(matches[2], 10) / 100; // Saturation: 0-100% -> 0-1
  const l = parseInt(matches[3], 10) / 100; // Lightness: 0-100% -> 0-1
  const a = parseFloat(matches[4]);       // Alpha: 0-1

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // If there's no saturation, just use the L value for all 3
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Return the final RGBA array, with RGB values rounded to 0-255
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a];
}


/**
 * Helper function to interpolate a value within a given range.
 * @param {number} value The input value to convert to an interpolated output value
 * @param {number} minData The smallest input value to consider for interpolation
 * @param {number} maxData The largest input value to conisder for interpolation
 * @param {number} minOutput The smallest output value to return
 * @param {number} maxOutput the largest output value to return
 * @returns {number} The value between minOutput and maxOutput relative to value's place between minData and maxData
 */
export const interpolate = function(
  value: number,
  minData: number,
  maxData: number,
  minOutput: number,
  maxOutput: number
): number {
  const clampedValue = Math.min(Math.max(value, minData), maxData); // keep the number in bounds
  const percentage = (clampedValue - minData) / (maxData - minData);
  return minOutput + percentage * (maxOutput - minOutput);
}


/**
 * Helper function to interpolate a color between two RGB colors
 * @param {number} value The input value to convert to an interpolated RBG value
 * @param {number} minData The smallest input value to consider for interpolation
 * @param {number} maxData The largest input value to conisder for interpolation
 * @param {number} startColor The "smallest" RGBA color value to use for return
 * @param {number} endColor the "largest" RGBA color value to use for return
 * @returns {number} The RGBA color value that is between startColor and endColor, relative to value's place
 * between minData and maxData.  Each RGBA component will be interpoloated independently
 */
export const interpolateRgba = function(
  value: number,
  minData: number,
  maxData: number,
  startColor: [number, number, number, number],
  endColor: [number, number, number, number]
): [number, number, number, number] {
  const r = interpolate(value, minData, maxData, startColor[0], endColor[0]);
  const g = interpolate(value, minData, maxData, startColor[1], endColor[1]);
  const b = interpolate(value, minData, maxData, startColor[2], endColor[2]);
  const a = interpolate(value, minData, maxData, startColor[3], endColor[3]);
  return [r,g,b,a];
}