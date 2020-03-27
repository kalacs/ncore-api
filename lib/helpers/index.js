module.exports = {
  combiner: (fields, ...arrays) => {
    const [firstArray] = arrays;

    return firstArray.reduce((acc, _, row) => {
      const object = {};
      fields.forEach((value, index) => {
        object[value] = arrays[index][row];
      });
      acc.push(object);
      return acc;
    }, []);
  },
};
