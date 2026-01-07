export const getSubtasksByTaskId = async (funnelType, taskId, api) =>
  api
    .get(`/employee_funnel_subscriptions/${funnelType}/my/${taskId}`)
    .then((res) => res.data);

/**
 * @param {number} employeeTaskFunnelSubscriptionId
 * @param {string} fileName
 * @param {string} fileContent
 * @param {number} taskAttachmentRestrictionId
 * @return {Promise<AxiosResponse<any>>}
 */
export const uploadFile = (
  employeeTaskFunnelSubscriptionId,
  fileName,
  fileContent,
  taskAttachmentRestrictionId,
  api
) =>
  api.post(`/tasking/etfses/${employeeTaskFunnelSubscriptionId}/attachments`, {
    file_name: fileName,
    file_contents: fileContent,
    task_attachment_restriction: taskAttachmentRestrictionId
  });
