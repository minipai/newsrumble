export const Cache_Control =
  "max-age=600, s-maxage=600000, stale-while-revalidate";

export const cacheControl = (response: ResponseInit = {}) => {
  return {
    ...response,
    headers: {
      ...response.headers,
      "Cache-Control": Cache_Control,
    },
  };
};
