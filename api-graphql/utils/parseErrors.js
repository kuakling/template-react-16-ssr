export default function(errors) {
  const result = [];
  for (var key in errors) {
    if (errors.hasOwnProperty(key)) {
      // result[key] = errors[key].message;
      result.push({
        field: key,
        message: errors[key].message
      });
    }
  }

  return result;
}