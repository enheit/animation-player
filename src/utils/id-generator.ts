function createIdGenerator(): () => number {
  let id = 1;

  return (): number => {
    return id++;
  };
}

export default createIdGenerator;
