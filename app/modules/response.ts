export const Cache_Control =
  "max-age=3600, s-maxage=86400, stale-while-revalidate=604800";

export const cacheControl = (response: ResponseInit = {}) => {
  return {
    ...response,
    headers: {
      ...response.headers,
      "Cache-Control": Cache_Control,
    },
  };
};
