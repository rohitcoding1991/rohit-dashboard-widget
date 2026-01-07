export const getLinks = async (cancelToken = undefined, api) =>
  api.get("/links", { cancelToken }).then((response) => response.data);
