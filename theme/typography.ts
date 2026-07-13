import { fontFamilies } from "./fonts";

export const typography = {
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    lineHeight: 34,
  },
  h2: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 21,
    lineHeight: 27,
  },
  h3: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 18,
    lineHeight: 23,
  },
  h4: {
    fontFamily: fontFamilies.medium,
    fontSize: 15,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 10,
    lineHeight: 14,
  },
} as const;

export type Typography = typeof typography;
