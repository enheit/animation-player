export const Interpolation = {  // tslint:disable-line:variable-name
  Linear(startValue: number, endValue: number, normalizedValue: number) {
    return startValue + normalizedValue * (endValue - startValue);
  },
};
