export const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const get = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export default {
  save,
  get,
};
