import React from "react";
import { Grid, Box, Card, CardHeader, Divider } from "@material-ui/core";
import { Alert, AlertTitle, Skeleton } from "@material-ui/lab";
import { hooks } from "@telesero/frontend-common";
import { useIsMobile } from "../../../hooks";
import ContactCard from "./ContactCard";
import Header from "../Header";
import { getApi, ModuleNames } from "../../../utils/modules";
import { useAdvertisedPages } from "../../../store/advertised-pages";
import { addAlert } from "../../../store/notifications";
import { retryWithDelay } from "../../../utils/retry";
import { useDashboardCardLayoutStyles } from "../styles";

const { useAsyncCallback } = hooks;

const PinnedContacts = ({ uiConfiguration }) => {
  const layoutClasses = useDashboardCardLayoutStyles();
  const advertisedPages = useAdvertisedPages();
  const isMobile = useIsMobile();

  const [refresh, setRefresh] = React.useState(1);
  const [contacts, setContacts] = React.useState([]);

  const [loadingId, setLoadingId] = React.useState(null);

  const api = getApi(advertisedPages, ModuleNames.Crm);

  const [loading, error] = useAsyncCallback(
    async () => {
      return retryWithDelay(
        async () => {
          return api.get("/pinned_contacts").then((res) => res.data);
        },
        5, // Max retries
        500 // Initial delay in ms
      );
    },
    [refresh],
    {
      resultHandler: (data) => {
        if (data) {
          setContacts(data.objects || []);
        }
      }
    }
  );

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleUnpin = (contactId) => {
    setLoadingId(contactId);
    return api
      .delete("/pinned_contacts", {
        data: [contactId]
      })
      .then((res) => {
        setContacts((prev) =>
          prev.filter((contact) => contact.id !== contactId)
        );
        addAlert("Contact has been removed from pinned contacts", {
          variant: "success"
        });
        return Promise.resolve();
      })
      .catch((error) => {
        addAlert(error?.response?.data?.message || error?.message, {
          variant: "error"
        });
      })
      .finally(() => setLoadingId(null));
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
        sx={{ padding: "8px 16px" }}
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
                key={`pinned_contacts_${index}`}
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

        {!loading && !error && (
          <>
            {contacts && (
              <Grid container spacing={2}>
                {contacts.map((contact, idx) => {
                  return (
                    <Grid
                      item
                      xl={2}
                      lg={3}
                      md={4}
                      sm={6}
                      xs={12}
                      key={`pinned_contacts_${idx}`}
                    >
                      <ContactCard
                        contact={contact}
                        handleUnpin={handleUnpin}
                        unpinLoading={contact.id === loadingId}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </>
        )}

        {!loading && !error && contacts?.length === 0 && (
          <Box sx={{ marginTop: 16 }}>
            <Alert severity="warning">
              <AlertTitle>No pinned contacts!</AlertTitle>
            </Alert>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default PinnedContacts;
