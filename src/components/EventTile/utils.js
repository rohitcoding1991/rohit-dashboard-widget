import { DateTime } from "luxon";

export const extractDateAndTimes = (scheduledStartAt, scheduledFinishAt) => {
  // Parse the input dates
  const startDateTime = DateTime.fromISO(scheduledStartAt);
  const finishDateTime = DateTime.fromISO(scheduledFinishAt);

  // Extract the date from the start time (assuming both are on the same day)
  const day = startDateTime.toFormat("dd"); // Day (e.g., "31")
  const month = startDateTime.toFormat("MMMM"); // Full month name (e.g., "October")
  const year = startDateTime.toFormat("yyyy"); // Year (e.g., "2021")
  const scheduleStartTime = startDateTime.toFormat("HH:mm"); // Start time (e.g., "11:35")
  const scheduleEndTime = finishDateTime.toFormat("HH:mm"); // End time (e.g., "11:55")

  return {
    day,
    month,
    year,
    scheduleStartTime,
    scheduleEndTime
  };
};
