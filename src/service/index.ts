import { useContext } from "react";
import { useHttp } from "./http";
import { HttpMutators } from "./http-mutators";
import { UserContext } from "src/App";


export type SignInPayload = {
  email: string;
  password: string;
}

export const useService = () => {
  const http = useHttp();
  const { user } = useContext(UserContext);

  return {
    signIn: (mutators: HttpMutators, payload: SignInPayload) =>
      http.post(mutators, { url: "/login", payload }),
    getData: (mutators: HttpMutators) =>
      http.get(mutators, { url: `/user/${user?.token}/data` }),
  }
}