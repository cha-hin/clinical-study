import axios, { AxiosRequestConfig } from "axios";
import { useNavigate } from "react-router-dom";
import { HttpMutators } from "./http-mutators";
import { removeToken } from "./store";

export type RequestParams = { payload?: any } & Omit<
  AxiosRequestConfig,
  "data"
>;

const axiosRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const useHttp = (baseSlug = "") => {
  const navigate = useNavigate();

  const request = async (
    params = {} as RequestParams,
    { loading, error, success }: HttpMutators,
  ) => {
    loading?.(true);
    params.url = `${baseSlug}${params.url || ""}`;

    // normally pass token here for api authorization

    return axiosRequest({ ...params, data: params?.payload })
      .then((res) => {
        success?.(res.data);
        loading?.(false);
        return res.data;
      })
      .catch((err) => {
        loading?.(false);
        if (params.url !== "/login" && err?.response?.status === 401) {
          removeToken();
          navigate("/login", { replace: true });
        } else {
          error?.({
            status: err?.response?.status || 500,
            ...err.response?.data,
          });
        }
      });
  };

  return {
    get: (mutators: HttpMutators, params?: RequestParams | null) =>
      request({ ...params, method: "GET" }, mutators),
    post: (mutators: HttpMutators, params?: RequestParams | null) =>
      request({ ...params, method: "POST" }, mutators),
  };
};
