export type HttpMutators = {
  loading?: (value: boolean) => void;
  success?: (res: any) => void;
  error?: (error: any) => void;
};
