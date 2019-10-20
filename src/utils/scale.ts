export const scaleFunc = (a1: number, a2: number, b1: number, b2: number) => (value: number) => {
  return ((b2 - b1) * (value - a1)) / (a2 - a1) + b1;
};

export const scale = (value: number, a1: number, a2: number, b1: number, b2: number): number => {
  return ((b2 - b1) * (value - a1)) / (a2 - a1) + b1;
}
