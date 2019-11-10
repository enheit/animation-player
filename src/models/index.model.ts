export interface Timings {
  startTime: number;
  endTime: number;
  duration: number;
}

export interface ElementConfig {
  mountTime: number;
  unmountTime: number;
  updateStartTime: number;
  updateEndTime: number;
}

export interface ElementUnmountProps {
  isBeforeMount: boolean;
  isAfterUnmount: boolean;
}
