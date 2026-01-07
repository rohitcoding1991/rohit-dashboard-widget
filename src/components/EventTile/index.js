import React from "react";
import { Link } from "react-router-dom";
import { Box, Tooltip, Typography } from "@material-ui/core";
import {
  ArrowRightAlt as ArrowRightAltIcon,
  Person as PersonIcon,
} from "@material-ui/icons";
import { extractDateAndTimes } from "./utils";
import { getModuleById, ModuleNames } from "../../utils/modules";
import { useAdvertisedPages } from "../../store/advertised-pages";
import useEventTitleStyles from "./styles";
import { getApiUrl } from "../../constants";

const EventTile = ({ index, event }) => {
  const classes = useEventTitleStyles({ index });
  const advertisedPages = useAdvertisedPages();

  const crmModule = getModuleById(advertisedPages, ModuleNames.Crm);
  const url = `${crmModule.url}${
    crmModule.url.endsWith("/") ? "" : "/"
  }activities/${event.id}`;

  const isInternalUrl = url.startsWith(getApiUrl());

  const { day, month, year, scheduleStartTime, scheduleEndTime } =
    extractDateAndTimes(event.scheduled_start_at, event.scheduled_finish_at);

  return (
    <Box className={classes.container}>
      <Box className={classes.dateTimeContainer}>
        <Box className={classes.dateContainer}>
          <Typography className={classes.month}>{month}</Typography>
          <Typography className={classes.date}>{day}</Typography>
        </Box>
        <Typography className={classes.time}>
          {scheduleStartTime} → {scheduleEndTime}
        </Typography>
      </Box>
      <Box className={classes.eventDescription}>
        {event.name || event.label}
      </Box>

      <Box className={classes.footer}>
        <Typography className={classes.contact}>
          <PersonIcon />
          <span className={classes.name}>
            <span>{event.contact.first_name || ""}</span>{" "}
            <span>{event.contact.last_name || ""}</span>
          </span>
        </Typography>
        <Tooltip title="View Detail" arrow>
          {isInternalUrl ? (
            <Link to={`/activities/${event.id}`}>
              <ArrowRightAltIcon />
            </Link>
          ) : (
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ArrowRightAltIcon />
            </a>
          )}
        </Tooltip>
      </Box>
    </Box>
  );
};

export default EventTile;
