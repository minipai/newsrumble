export const cacheControl = (response: ResponseInit = {}) => {
  return {
    ...response,
    headers: {
      ...response.headers,
      "Cache-Control":
        "max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  };
};
