export const nullToString = (input, output = '') => {
  return input === null ? output : input;
};

export const notStringToString = (input, output = '') => {
  // console.log(typeof(input));
  return (typeof(input) !== 'string') ? output : input;
};