export const MAX_TIMEOUT_MS = 10000;

export interface Callback {
  timeout: NodeJS.Timeout;
  res: (value: any) => void;
  rej: (reason: Error) => void;
};