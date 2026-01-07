/** This method retries a function with a delay between each retry, up to a maximum number of retries.
 * Example:
 * const [dialerCampaignLoading, dialerCampaignError, dialerCampaignSchema] =
    useAsyncCallback(async () => {
      return retryWithDelay(
        async () => {
          const schema = await new FormSchema(
            `/dialer/organization_campaigns/form_schema`,
            pbxApi
          ).fetch();
          return schema.schema; // Extract the schema from the response
        },
        10, // Max retries
        500 // Initial delay in ms
      );
    }, [retry]);
 * 
 */
export const retryWithDelay = async (fn, maxRetries, delayMs) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (retries >= maxRetries - 1) {
        throw error; // Fail after max retries
      }
      retries++;
      const waitTime = delayMs * 2 ** retries; // Exponential backoff
      console.warn(
        `Retrying (${retries}/${maxRetries}) after ${waitTime}ms...`,
        error
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime)); // Wait before retrying
    }
  }
};
