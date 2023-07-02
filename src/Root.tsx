import { MantineProvider } from "@mantine/core";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { CustomFonts } from "./CustomFonts";

const glassyStyle = {
  backdropFilter: "blur(16px) saturate(180%)",
  backgroundColor: "rgba(255, 255, 255, 0.5)",
  border: "1px solid rgba(209, 213, 219, 0.3)"
};

function Root() {

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colors: {
          primary:
            ["#57A69E", "#5FB1A8", "#66BBB2", "#6EC6BC", "#76D0C6", "#7EDAD0", "#86E4DA", "#8FEAE0", "#99EEE5", "#A4F3EA"],
          secondary: [
            "#006069", "#005F68", "#005E67", "#005D66", "#005C65", "#005B64", "#005A63", "#005962", "#005861", "#005760"
          ]
        },
        primaryColor: "primary",
        fontFamily: "Inter",
        headings: {
          fontFamily: "Inter",
        },
        components: {
          Button: {
            defaultProps: {
              radius: "md",
              color: "primary.4"
            },
          },
          Paper: {
            defaultProps: {
              radius: "lg",
              p: "lg",
              shadow: "lg",
            },
            styles: {
              root: glassyStyle
            }
          },
          Alert: {
            defaultProps: {
              radius: "lg"
            },
            styles: {
              root: {
                ...glassyStyle,
                backgroundColor: "rgba(250,128,114, 0.3)"
              }
            }
          },
          InputWrapper: {
            styles: theme => ({
              label: {
                marginBottom: "4px"
              },
            }),
          },
          Input: {
            defaultProps: {
              radius: "md",
            },
            styles: theme => ({
              input: {
                transition: "background-color 200ms ease, outline 200ms ease, color 200ms ease, box-shadow 200ms ease",
                outline: "none",
                backgroundColor: "#f3f3f4",
                "&:hover": {
                  backgroundColor: "#fff",
                  boxShadow: `0 0 0 4px ${theme.fn.rgba(theme.colors.primary[7], 0.3)}`
                },
                "&:focus-within": {
                  backgroundColor: "#fff",
                  boxShadow: `0 0 0 4px ${theme.fn.rgba(theme.colors.primary[7], 0.3)}`
                }
              }
            })
          }
        },
        globalStyles: theme => ({
          ":root": {
          }
        })
      }}
    >
      <HashRouter>
        <CustomFonts />
        <App />
      </HashRouter>
    </MantineProvider>
  )
}

export default Root;