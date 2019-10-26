import { Interpolation } from '../interpolation';

describe('Interpolation', () => {
  it('Linear function should properly calculate the point within the range', () => {
    expect(Interpolation.Linear(0, 100, 0.5)).toEqual(50);
  });
});
