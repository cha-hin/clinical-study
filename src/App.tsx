import { Navigate, Route, Routes } from "react-router-dom";
import { SignIn } from "./components";
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
              <Route path="/sign-in" element={<SignIn />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
