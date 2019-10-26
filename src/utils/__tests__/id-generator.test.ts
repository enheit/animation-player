import createIdGenerator from '../id-generator';

describe('idGenerator', () => {
  it('should properly generate unique ids', () => {
    const generateId = createIdGenerator();

    expect(generateId()).toBe(1);
    expect(generateId()).toBe(2);
    expect(generateId()).toBe(3);
    expect(generateId()).toBe(4);
  });
});
