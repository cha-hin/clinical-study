export enum ValueFormat {
  RAW = "RAW",
  LOGARITHMIC = "LOGARITHMIC",
}

export type DisplayRange = {
  min: number;
  max: number;
};

export type DisplayOptions = {
  displayRange: DisplayRange;
  valuesFormat: ValueFormat;
  pollInterval: number;
};

export const DEFAULT_POLL_INTERVAL = 5;
