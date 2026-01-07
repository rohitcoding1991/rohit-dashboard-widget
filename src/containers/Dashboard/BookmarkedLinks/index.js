import React from "react";
import { useHistory } from "react-router-dom";
import { Box, Grid, Card, CardHeader, Divider } from "@material-ui/core";
import { Alert, AlertTitle, Skeleton } from "@material-ui/lab";
import { hooks } from "@telesero/frontend-common";
import { useIsMobile } from "../../../hooks";
import { backoffice } from "../../../settings/api";
import Header from "../Header";
import { addAlert } from "../../../store/notifications";
import { getModuleById } from "../../../utils/modules";
import { useAdvertisedPages } from "../../../store/advertised-pages";
import BookmarkedLink from "../../../components/BookmarkedLink";
import { retryWithDelay } from "../../../utils/retry";
import { useDashboardCardLayoutStyles } from "../styles";
import { getApiUrl } from "../../../constants";

const { useAsyncCallback } = hooks;

const BookmarkedLinks = ({ uiConfiguration }) => {
  const layoutClasses = useDashboardCardLayoutStyles();
  const advertisedPages = useAdvertisedPages();
  const isMobile = useIsMobile();
  const history = useHistory();

  const [refresh, setRefresh] = React.useState(1);
  const [deleteLoadingId, setDeleteLoadingId] = React.useState(null);

  const [quickLinks, setQuickLinks] = React.useState({
    objects: [],
    total_count: 0,
  });

  const [loading, error] = useAsyncCallback(
    async () => {
      return retryWithDelay(
        async () => {
          return backoffice
            .get("/api/user_quick_links")
            .then((res) => res.data);
        },
        5, // Max retries
        500 // Initial delay in ms
      );
    },
    [refresh],
    {
      resultHandler: (data) => {
        if (data) {
          setQuickLinks(data || []);
        }
      },
    }
  );

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleView = (item) => {
    const module = getModuleById(advertisedPages, item.app_name);
    if (module) {
      const baseUrl = module.url.replace(/\/+$/, ""); // Remove trailing slashes
      const itemLink = item.link.replace(/^\/+/, ""); // Remove leading slashes

      const isInternalUrl = baseUrl.startsWith(getApiUrl());
      if (isInternalUrl) {
        history.push(`/${itemLink}`);
        return;
      }

      window.open(`${baseUrl}/${itemLink}`, "_blank");
    }
  };

  const handleDelete = (item) => {
    setDeleteLoadingId(item.id);
    return backoffice
      .delete(`/api/user_quick_links/${item.id}`, {
        data: [item.id],
      })
      .then(() => {
        setQuickLinks((prev) => {
          return {
            ...prev,
            objects: prev.objects.filter((link) => link.id !== item.id),
          };
        });
        addAlert("Quick link has been removed", {
          variant: "success",
        });
        return Promise.resolve();
      })
      .catch((error) => {
        console.error(error);
        addAlert(error?.response?.data?.message || error?.message, {
          variant: "error",
        });
      })
      .finally(() => setDeleteLoadingId(null));
  };

  const handleUpdate = (id, data) => {
    setQuickLinks((prev) => {
      return {
        ...prev,
        objects: prev.objects.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...data,
            };
          }
          return item;
        }),
      };
    });
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
        style={{ padding: "16px" }}
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
                key={`quick_links_${index}`}
              >
                <Skeleton variant="rect" height={160} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && error && (
          <Alert severity={"error"}>
            <AlertTitle>
              {error?.response?.data?.message || error?.message}
            </AlertTitle>
          </Alert>
        )}

        <Grid container spacing={2}>
          {!loading && !error && (
            <>
              {quickLinks.objects.map((link, index) => {
                return (
                  <Grid
                    item
                    xl={2}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    key={`quick_link_${index}`}
                  >
                    <BookmarkedLink
                      link={link}
                      handleView={handleView}
                      deleteLoading={deleteLoadingId === link.id}
                      handleDelete={handleDelete}
                      afterUpdate={(data) => handleUpdate(link.id, data)}
                    />
                  </Grid>
                );
              })}
            </>
          )}
        </Grid>
        {!loading && !error && quickLinks.objects?.length === 0 && (
          <Alert severity="warning">
            <AlertTitle>No quick links added!</AlertTitle>
          </Alert>
        )}
      </Box>
    </Card>
  );
};

export default BookmarkedLinks;
