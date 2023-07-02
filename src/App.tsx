import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home, SignIn } from "./components";
import { BaseLayout } from "./layouts";
import { getToken, removeToken, saveToken } from "./service/store";
import { createContext, useEffect, useMemo, useState } from "react";

export type User = {
  token?: string;
  email?: string;
  data?: number[];
}

export const UserContext = createContext<{ user?: User, setUser?: any }>({});

function App() {
  const [user, setUser] = useState<User>();

  const value = useMemo(() => ({ user, setUser }), [user]);

  useEffect(() => {
    const token = getToken();
    setUser(token ? { ...user, token } : {});
  }, []);

  useEffect(() => {
    user?.token ? saveToken(user?.token) : removeToken();
  }, [user?.token]);


  return (
    <UserContext.Provider value={value}>
      <Routes>
        <Route element={<BaseLayout />}>
          {user?.token
            ? <>
              <Route index element={<Home />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
            : <>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="*" element={<Navigate to="/sign-in" replace />} />
            </>}
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
