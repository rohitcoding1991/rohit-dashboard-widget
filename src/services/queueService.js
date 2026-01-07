export const fetchQueues = (phoneId, api) => {
  return api.get(`/queue-participation/${phoneId}`).then((res) => res.data);
};

export const joinQueue = (queueId, phone, api) => {
  return api.post(`/queue-participation/${queueId}/join/${phone}`);
};

export const leaveQueue = (queueId, phone, api) => {
  return api.post(`/queue-participation/${queueId}/leave/${phone}`);
};

export const getQueueCallStatus = async (phoneId, api) => {
  try {
    const response = await api.get(`/queue-participation/status/${phoneId}`);
    return { isQueueCall: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { isQueueCall: false, data: null };
    }
    throw error;
  }
};

export const executeQueueAction = (phone, actionId, api) => {
  return api.post(`/queue-participation/action/${phone}/${actionId}`);
};

export const setQueueResult = (queue, phone, callerUuid, resultId, api) => {
  return api.post(
    `/queue-participation/result/${queue}/${phone}/${callerUuid}/${resultId}`
  );
};

export const fetchUserPhones = (api) => {
  return api.get("/queue-participation/list-phones").then((res) => res.data);
};
