import { Center, Button } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import classes from "./BaseLayout.module.css";

const BaseLayout = () => {
  const { user, setUser } = useContext(UserContext);

  function signOut() {
    setUser({});
  }

  return (
    <Center className={classes["root-container"]}>
      {user?.token && (
        <Button
          pos="absolute"
          top={10}
          right={10}
          color="red"
          onClick={signOut}
          style={{ zIndex: 11 }}
        >
          Sign out
        </Button>
      )}
      <div className={classes["main-container"]}>
        <Outlet />
        {/* <Image src={crakotte} className={classes.img} /> */}
      </div>
    </Center>
  );
};

export default BaseLayout;
