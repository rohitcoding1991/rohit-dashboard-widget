export const getAnnouncements = async (cancelToken = undefined, api) => {
  return api.get("/announcements", { cancelToken }).then((response) => {
    return response.data.objects;
  });
};
