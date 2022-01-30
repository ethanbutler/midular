import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme extends ReturnType<typeof useThemeProvider> {}
}

interface ThemeProps {
  children: React.ReactNode;
}

export const colors = [
  "#5EB3F5",
  "#F27487",
  "#5CF2D9",
  "#F2AD44",
  "#50F271",
  "#7885F5",
  "#7FF760",
  "#F2F55F",
  "#F547D1",
  "#F5D153",
];

/**
 * TODO: Docs
 */
export function useThemeProvider() {
  const [currentTheme] = React.useState({ colors });

  return currentTheme;
}

/**
 * TODO: Docs
 * TODO: Light and dark mode
 */
export function Theme({ children }: ThemeProps) {
  const theme = useThemeProvider();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}

const GlobalStyles = createGlobalStyle`
* {
  box-sizing: border-box;
}

body {
  overflow: hidden;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

button,
input {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  padding: 0;
}
`;
