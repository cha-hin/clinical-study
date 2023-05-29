import { createStyles, Center, Button } from "@mantine/core";
import { Outlet } from "react-router-dom";
import background from "../assets/background.svg";
import { useContext } from "react";
import { UserContext } from "src/App";

const BaseLayout = () => {
  const { classes } = useStyles();
  const { user, setUser } = useContext(UserContext);

  function signOut() {
    setUser({});
  }

  return (
    <Center className={classes.rootContainer}>
      {user?.token && <Button pos="absolute" top={10} right={10} color="red" onClick={signOut}>Sign out</Button>}
      <div className={classes.mainContainer}>
        <Outlet />
        {/* <Image src={crakotte} className={classes.img} /> */}
      </div>
    </Center>
  );
};

const useStyles = createStyles(theme => ({
  rootContainer: {
    height: "100vh",
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "static"
  },

  mainContainer: {
    height: "100%",
    minWidth: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    zIndex: 10,

    [theme.fn.smallerThan("xl")]: {
      minWidth: "30%",
    },
    [theme.fn.smallerThan("lg")]: {
      minWidth: "40%",
    },
    [theme.fn.smallerThan("md")]: {
      minWidth: "50%",
    },
    [theme.fn.smallerThan("sm")]: {
      minWidth: "65%",
    },
    [theme.fn.smallerThan("xs")]: {
      minWidth: "90%",
    },
  },

  // img: {
  //   alignSelf: "center",
  //   width: "6rem !important",
  //   position: "absolute",
  //   bottom: theme.spacing.md,
  // },
}));

export default BaseLayout;
