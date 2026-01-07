import React from "react";
import { Grid, Box, Card, CardHeader, Divider } from "@material-ui/core";
import { Alert, AlertTitle, Skeleton } from "@material-ui/lab";
import { hooks } from "@telesero/frontend-common";
import { useUser } from "../../../store/app";
import { useIsMobile } from "../../../hooks";
import EventTile from "../../../components/EventTile";
import Header from "../Header";
import { getApi, ModuleNames } from "../../../utils/modules";
import { useAdvertisedPages } from "../../../store/advertised-pages";
import { retryWithDelay } from "../../../utils/retry";
import { useDashboardCardLayoutStyles } from "../styles";

const { useAsyncCallback } = hooks;

const ScheduledActivities = ({ uiConfiguration }) => {
  const isMobile = useIsMobile();
  const advertisedPages = useAdvertisedPages();
  const layoutClasses = useDashboardCardLayoutStyles();
  const user = useUser();

  const [refresh, setRefresh] = React.useState(1);

  const [upcomingActivities, setUpcomingActivities] = React.useState([]);

  const [loading, error] = useAsyncCallback(
    async () => {
      return retryWithDelay(
        async () => {
          // get current user's scheduled activities
          const params = {
            limit: 10,
            offset: 0,
            filters: JSON.stringify([
              {
                property: "assigned",
                operator: "equals",
                exclude: false,
                value: user?.id,
              },
            ]),
            search: "",
          };

          const api = getApi(advertisedPages, ModuleNames.Crm);
          return api
            .get("/scheduled_activities", {
              params,
            })
            .then((res) => res.data);
        },
        5, // Max retries
        500 // Initial delay in ms
      );
    },
    [refresh, user?.id],
    {
      resultHandler: (data) => {
        if (data) {
          setUpcomingActivities(data?.objects || []);
        }
      },
    }
  );

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <Card className={layoutClasses.cardContainer}>
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
      <Box
        className={layoutClasses.scrollableContent}
        style={{ padding: "8px 16px" }}
      >
        {loading && !error && (
          <Grid container spacing={2}>
            {[...new Array(isMobile ? 1 : 4)].map((_, index) => (
              <Grid
                item
                xl={2}
                lg={3}
                md={4}
                sm={6}
                xs={12}
                key={`upcoming_events_${index}`}
              >
                <Skeleton variant="rect" height={160} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && error && (
          <>
            <Alert severity={"error"}>
              <AlertTitle>
                {error?.response?.data?.message || error?.message}
              </AlertTitle>
            </Alert>
          </>
        )}

        {!loading &&
          !error &&
          upcomingActivities.length === 0 &&
          Number(upcomingActivities?.length || 0) === 0 && (
            <Alert severity="warning">
              <AlertTitle>No activity assigned to you!</AlertTitle>
            </Alert>
          )}

        {!loading && upcomingActivities.length > 0 && (
          <Box>
            <Grid container spacing={2}>
              {upcomingActivities.map((activity, index) => {
                return (
                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    key={`scheduled_activity_${index}`}
                  >
                    <EventTile index={index} event={activity} />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default ScheduledActivities;
