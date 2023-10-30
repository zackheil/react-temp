export const hexChangeShade = (hexColor: string, magnitudeInteger: number) => {
  hexColor = hexColor.replace(`#`, ``);
  const magnitude = Math.round(magnitudeInteger); // in case an integer wasn't passed in

  let [r, g, b] = [hexColor.slice(0, 2), hexColor.slice(2, 4), hexColor.slice(4, 6)].map((hex) => parseInt(hex, 16));

  if (hexColor.length === 6) {
    r = r + magnitude;
    r > 255 && (r = 255);
    r < 0 && (r = 0);
    g = g + magnitude;
    g > 255 && (g = 255);
    g < 0 && (g = 0);
    b = b + magnitude;
    b > 255 && (b = 255);
    b < 0 && (b = 0);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  } else {
    return hexColor;
  }
};

export const changeOpacity = (hexColor: string, opacity: number) => {
  const sanitized = hexColor.replace(`#`, ``).slice(0,6);
  return `#${sanitized}${Math.round((opacity / 100) * 255)
    .toString(16)
    .padStart(2, '0')}`;
};

export const invertColor = (hexColor: string) => {
  const sanitized = hexColor.replace(`#`, ``);
  const [r, g, b] = [sanitized.slice(0, 2), sanitized.slice(2, 4), sanitized.slice(4, 6)].map((hex) =>
    parseInt(hex, 16)
  );
  return `#${(255 - r).toString(16).padStart(2, '0')}${(255 - g).toString(16).padStart(2, '0')}${(255 - b)
    .toString(16)
    .padStart(2, '0')}`;
};
