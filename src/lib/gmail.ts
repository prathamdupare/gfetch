export const createConfig = (url, accessToken) => {
  return {
    method: "get",
    url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  };
};
