import React from "react";
import {
  Card,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Typography,
  CardHeader,
} from "@material-ui/core";
import { Alert, AlertTitle, Skeleton } from "@material-ui/lab";
import { hooks, utils } from "@telesero/frontend-common";
import application from "../../../settings/api";
import { getLinks } from "../../../services/links";
import { getApi, ModuleNames } from "../../../utils/modules";
import { useAdvertisedPages } from "../../../store/advertised-pages";
import Header from "../Header";
import { retryWithDelay } from "../../../utils/retry";
import LinkStyle from "./style";
import { useDashboardCardLayoutStyles } from "../styles";

const useStoryBook = false;

const { useAsyncCallback } = hooks;
const { promise } = utils;
const createCancelToken = promise.createCancelToken;

const Links = ({ uiConfiguration }) => {
  const layoutClasses = useDashboardCardLayoutStyles();
  const classes = LinkStyle();
  const advertisedPages = useAdvertisedPages();
  const cancel = React.useRef(createCancelToken());
  const [links, setLinks] = React.useState([]);
  const [refresh, setRefresh] = React.useState(1);

  const api = getApi(advertisedPages, ModuleNames.EmployeePortal);

  const [loading, error] = useAsyncCallback(
    async () => {
      return retryWithDelay(
        async () => {
          return getLinks(
            cancel.current.token,
            useStoryBook ? application : api
          );
        },
        5, // Max retries
        500 // Initial delay in ms
      );
    },
    [fetch, refresh],
    {
      resultHandler: (data) => data && setLinks(data.objects),
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
      <Box className={layoutClasses.scrollableContent}>
        <List disablePadding>
          {error && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error.message}
            </Alert>
          )}
          {loading &&
            [1, 2, 3, 4, 5].map((v) => (
              <React.Fragment key={`loading_links_${v}`}>
                <ListItem>
                  <ListItemText
                    primary={<Skeleton variant="text" />}
                    secondary={<Skeleton variant="text" />}
                  />
                </ListItem>
                {v !== 5 && <Divider />}
              </React.Fragment>
            ))}
          {!loading && links && Array.isArray(links) && links.length === 0 && (
            <Box p={2}>
              <Typography
                color={"textSecondary"}
                align={"center"}
                variant={"body2"}
              >
                No Link
              </Typography>
            </Box>
          )}
          {!loading &&
            links.map((link, i) => {
              const { text, url, target } = link;
              return (
                <React.Fragment key={`link_${i}`}>
                  <ListItem button onClick={() => window.open(url, target)}>
                    <ListItemText
                      primary={text}
                      secondary={url}
                      className={classes.text}
                    />
                  </ListItem>
                  {i + 1 !== links.length && <Divider />}
                </React.Fragment>
              );
            })}
        </List>
      </Box>
    </Card>
  );
};

export default Links;
