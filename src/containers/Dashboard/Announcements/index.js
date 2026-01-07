import React from "react";
import {
  Card,
  Divider,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Button,
  Box,
  IconButton,
} from "@material-ui/core";

import { hooks, utils } from "@telesero/frontend-common";
import { Skeleton, Alert, AlertTitle } from "@material-ui/lab";
import { Visibility as VisibilityIcon } from "@material-ui/icons";
import { DateTime } from "luxon";
import Paper from "../../../components/Mui/surfaces/Paper/Paper";
import { getAnnouncements } from "../../../services/announcements";
import { useAdvertisedPages } from "../../../store/advertised-pages";
import { getApi, ModuleNames } from "../../../utils/modules";
import Header from "../Header";
import { useAnnouncementStyles } from "./styles";
import { retryWithDelay } from "../../../utils/retry";
import ControlledDialog from "../../../components/Control/ControlledDialog";
import { useDashboardCardLayoutStyles } from "../styles";

const { promise } = utils;
const { useAsyncCallback } = hooks;
const createCancelToken = promise.createCancelToken;

const Announcements = ({ uiConfiguration }) => {
  const advertisedPages = useAdvertisedPages();
  const layoutClasses = useDashboardCardLayoutStyles();
  const classes = useAnnouncementStyles();
  const cancel = React.useRef(createCancelToken());
  const [announcementsData, setAnnouncementsData] = React.useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = React.useState(null);
  const [refresh, setRefresh] = React.useState(1);

  const api = getApi(advertisedPages, ModuleNames.EmployeePortal);

  const [loadingData, errorData] = useAsyncCallback(
    async () => {
      return retryWithDelay(
        async () => {
          return getAnnouncements(cancel.current.token, api);
        },
        5, // Max retries
        500 // Initial delay in ms
      );
    },
    [refresh],
    {
      resultHandler: (data) => setAnnouncementsData(data),
      cancelSource: cancel.current,
    }
  );

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <Card className={layoutClasses.cardContainer} component={Paper}>
      <CardHeader
        title={
          <Header
            title={uiConfiguration?.getUserConfig("title")}
            onRefresh={handleRefresh}
          />
        }
        className={layoutClasses.fixedHeader}
      />
      <Divider />
      <Box className={layoutClasses.scrollableContent}>
        <List disablePadding>
          {errorData && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorData.message}
            </Alert>
          )}
          {loadingData &&
            [1, 2, 3, 4, 5].map((v) => (
              <React.Fragment key={`loading_announcements_${v}`}>
                <ListItem>
                  <ListItemText
                    primary={<Skeleton variant="text" />}
                    secondary={<Skeleton variant="text" />}
                  />
                </ListItem>
                {v !== 5 && <Divider />}
              </React.Fragment>
            ))}
          {announcementsData &&
            Array.isArray(announcementsData) &&
            announcementsData.length === 0 && (
              <Box p={2}>
                <Typography
                  color={"textSecondary"}
                  align={"center"}
                  variant={"body2"}
                >
                  No Announcement
                </Typography>
              </Box>
            )}
          {!loadingData &&
            announcementsData?.length > 0 &&
            announcementsData.map((announcement, i) => (
              <React.Fragment key={`announcement_${i}_${announcement.id}`}>
                <ListItem>
                  <ListItemText
                    className={classes.text}
                    primary={announcement.title}
                    secondary={announcement.text}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => setSelectedAnnouncement(announcement)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {i + 1 !== announcementsData.length && <Divider />}
              </React.Fragment>
            ))}
        </List>
      </Box>
      {selectedAnnouncement && (
        <ControlledDialog
          open={true}
          title={selectedAnnouncement.title}
          subheader={DateTime.fromISO(
            selectedAnnouncement.generated_at
          ).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
          content={
            <React.Fragment>
              {selectedAnnouncement.text.split("\n").map((str, i) => (
                <Typography
                  key={`announcement_${selectedAnnouncement.id}_line_${i}`}
                  variant={"body1"}
                  color={"textSecondary"}
                  gutterBottom
                >
                  {str}
                </Typography>
              ))}
            </React.Fragment>
          }
          closeFn={() => setSelectedAnnouncement(null)}
          dialogActions={
            <Button onClick={() => setSelectedAnnouncement(null)}>Close</Button>
          }
          allowBackdropOnConfirm
          hideButtons
        />
      )}
    </Card>
  );
};

export default Announcements;
