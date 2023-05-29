import { ThemeIcon, Alert, Button, Paper, PasswordInput, Stack, TextInput, Title, useMantineTheme } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useRef, useState } from "react";
import { HiEye, HiEyeOff, HiLockClosed, HiMail } from "react-icons/hi";
import { MdError } from "react-icons/md";
import { UserContext } from "src/App";
import { SignInPayload, useService } from "src/service";

function SignIn() {
  const { signIn } = useService();
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const { user, setUser } = useContext(UserContext);

  const ref = useRef<any>();

  const form = useForm<SignInPayload>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: value => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ? null : "Invalid email",
      password: value => /([^\s])/.test(value) ? null : "Password is empty"
    }
  });

  function handleSubmit() {
    setErrorMessage(undefined);
    form.resetTouched();
    if (form.isValid()) {
      signIn(
        {
          loading: value => setLoading(value),
          success: res => {
            setUser({ ...user, token: res.token });
          },
          error: err => setErrorMessage(err?.message)
        },
        {
          email: form.values.email,
          password: form.values.password
        });
    }
  }

  return (
    <Stack ref={ref}>
      <Paper>
        <form onSubmit={form.onSubmit(values => handleSubmit())}>
          <Stack>
            <Title order={2}>Sign in</Title>
            <TextInput
              withAsterisk
              label="Email"
              icon={<HiMail />}
              aria-label="Email"
              aria-required="true"
              autoComplete="on"
              placeholder="Enter your email"
              {...form.getInputProps("email")}
            />

            <PasswordInput
              withAsterisk
              label="Password"
              icon={<HiLockClosed />}
              aria-label={"Password"}
              aria-required="true"
              placeholder="Enter password"
              autoComplete="on"
              visibilityToggleIcon={({ reveal, size }) =>
                reveal
                  ? <HiEyeOff size={size} color={theme.colors.gray[5]} />
                  : <HiEye size={size} color={theme.colors.gray[5]} />
              }
              {...form.getInputProps("password")}
            />
            <Button loading={loading} ml="auto" type="submit" disabled={!form.isValid()}>Sign in</Button>
          </Stack>
        </form>
      </Paper>
      {errorMessage && !form.isTouched() && <Alert color="red" icon={<ThemeIcon color="red" variant="subtle" radius="md" size="lg" p={3}><MdError size="2rem" /></ThemeIcon>}>
        {errorMessage}
      </Alert>}
    </Stack >
  )
}

export default SignIn;

