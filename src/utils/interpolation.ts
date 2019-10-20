export const Interpolation = {
  Linear: function(startValue: number, endValue: number, normalizedValue: number) {
    return startValue + normalizedValue * (endValue - startValue);
  }
};
