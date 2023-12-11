import {
  Alert,
  Button,
  Input,
  InputWrapper,
  Paper,
  createTheme,
} from "@mantine/core";
import classes from "./theme.module.css";

const glassyStyle = {
  backdropFilter: "blur(16px) saturate(180%)",
  backgroundColor: "rgba(255, 255, 255, 0.5)",
  border: "1px solid rgba(209, 213, 219, 0.3)",
};

export default createTheme({
  colors: {
    primary: [
      "#57A69E",
      "#5FB1A8",
      "#66BBB2",
      "#6EC6BC",
      "#76D0C6",
      "#7EDAD0",
      "#86E4DA",
      "#8FEAE0",
      "#99EEE5",
      "#A4F3EA",
    ],
    secondary: [
      "#006069",
      "#005F68",
      "#005E67",
      "#005D66",
      "#005C65",
      "#005B64",
      "#005A63",
      "#005962",
      "#005861",
      "#005760",
    ],
  },
  primaryColor: "primary",
  fontFamily: "Inter",
  headings: {
    fontFamily: "Inter",
  },
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: "md",
        color: "primary.4",
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: "lg",
        p: "lg",
        shadow: "lg",
      },
      styles: {
        root: glassyStyle,
      },
    }),
    Alert: Alert.extend({
      defaultProps: {
        radius: "lg",
      },
      styles: {
        root: {
          ...glassyStyle,
          backgroundColor: "rgba(250,128,114, 0.3)",
        },
        message: {
          margin: 0,
        },
      },
    }),
    Input: Input.extend({
      classNames: {
        input: classes.input,
      },
      styles: {
        input: {
          borderRadius: "var(--mantine-radius-md)",
        },
      },
    }),
    InputWrapper: InputWrapper.extend({
      styles: {
        label: {
          marginBottom: "4px",
        },
      },
    }),
  },
});
