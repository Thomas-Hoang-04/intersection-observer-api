import { Global } from "@emotion/react";

export default Fonts = () => (
  <Global
    styles={`
        @font-face {
        font-family: "Hauora";
        font-weight: 100 900;
        font-display: swap;
        src: url("./assets/fonts/HauoraGX.ttf") format("truetype");
    }
    `}
  />
);
