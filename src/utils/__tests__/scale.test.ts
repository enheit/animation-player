import { scale, scaleFunc } from '../scale';

describe('scale', () => {
  it('should properly scale the value', () => {
    expect(scale(10, 0, 100, 0, 1)).toBe(0.1);
    expect(scale(50, 0, 100, 0, 1)).toBe(0.5);
    expect(scale(100, 0, 100, 0, 1)).toBe(1);
  });
});

describe('scaleFunc', () => {
  it('should properly scale value', () => {
    const scaler = scaleFunc(0, 100, 0, 1);

    expect(scaler(10)).toBe(0.1);
    expect(scaler(50)).toBe(0.5);
    expect(scaler(100)).toBe(1);
  });
});
