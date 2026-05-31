export const getAccessToken = () => {
  const token = sessionStorage.getItem("accessToken");

  if (!token) throw new Error("No access Token");

  return token;
};
