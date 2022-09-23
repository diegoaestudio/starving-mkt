export const storeUser = (user) =>
  localStorage.setItem("user", JSON.stringify(user));

export const getUser = () => JSON.parse(localStorage.getItem("user"));

export const getAbbrAddrs = (address) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};
