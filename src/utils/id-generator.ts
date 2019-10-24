function createIdGenerator() {
  let id = 1;

  return () => {
    return id++;
  };
}

export default createIdGenerator;
