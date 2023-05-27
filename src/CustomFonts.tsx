// @ts-nocheck
import { Global } from "@mantine/core";
import inter from "./assets/fonts/inter.woff2";

export function CustomFonts() {
  return (
    <Global
      styles={[
        {
          "@font-face": {
            fontFamily: "Inter",
            src: `local("Inter"), url("${inter}") format("woff2-variations")`,
            fontWeight: "400 800",
            fontStyle: "normal",
            fontDisplay: "block"
          },
        }
      ]}
    />
  );
}