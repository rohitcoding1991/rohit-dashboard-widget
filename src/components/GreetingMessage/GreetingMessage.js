import React from "react";
import { DateTime } from "luxon";
import { Grid, Typography } from "@material-ui/core";

export const getGreetingMessage = () => {
  const now = DateTime.local().toLocaleString({
    hour: "2-digit",
    hour12: false,
  });

  switch (true) {
    case now <= 12:
      return "Good Morning";
    case now > 12 && now < 16:
      return "Good Afternoon";
    case now >= 16 && now < 20:
      return "Good Evening";
    case now >= 20 && now <= 24:
      return "Good Night";
    default:
      return "Welcome";
  }
};

/**
 * @param {object} gridProps
 * @param {object} typographyProps
 * @param {string} messageSuffix
 * @param {boolean} putCommonBeforeSuffix
 * @returns {JSX.Element}
 * @constructor
 */
const GreetingMessage = ({
  gridProps = {},
  typographyProps = {},
  messageSuffix = "",
  putCommonBeforeSuffix = true,
}) => {
  return (
    <Grid {...gridProps}>
      <Typography variant="h4" gutterBottom {...typographyProps}>
        {getGreetingMessage()}
        {messageSuffix && `${putCommonBeforeSuffix && ", "}${messageSuffix}`}
      </Typography>
    </Grid>
  );
};

export default GreetingMessage;
