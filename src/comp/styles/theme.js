import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      html: {
        scrollBehavior: "smooth",
      },
      body: {
        margin: "3vh 5vw",
        minHeight: "90vh",
      },
    },
  },
  fonts: {
    heading: `"Hauora", system-ui, sans-serif`,
    body: `"Hauora", system-ui, sans-serif`,
  },
  fontSizes: {
    "3xl": "1.75rem",
    "3.5xl": "1.875rem",
    "4xl": "2rem",
    "4.25xl": "2.25rem",
    "4.5xl": "2.5rem",
  },
});

export default theme;
