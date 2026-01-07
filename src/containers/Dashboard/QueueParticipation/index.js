import React from "react";
import { Box, Divider, Card, CardHeader } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Paper from "../../../components/Mui/surfaces/Paper/Paper";
import { hooks, utils } from "@telesero/frontend-common";
import { useAdvertisedPages } from "../../../store/advertised-pages";
import { getApi, ModuleNames } from "../../../utils/modules";
import {
  fetchQueues,
  fetchUserPhones,
  joinQueue,
  leaveQueue,
} from "../../../services/queueService";
import { getWidget, getWidgetStore } from "../../../settings/widgetApi";
import Queues from "./Queues";
import Header from "../Header";
import CustomEvents from "../../../settings/custom-events";
import { useDashboardCardLayoutStyles } from "../styles";

const { customEvents } = utils;
const { useAsyncCallback } = hooks;

const subscribeEvent = customEvents.subscribeEvent;
const unsubscribeEvent = customEvents.unsubscribeEvent;
const publishEvent = customEvents.publishEvent;

const QueueParticipation = ({ uiConfiguration }) => {
  const advertisedPages = useAdvertisedPages();
  const layoutClasses = useDashboardCardLayoutStyles();

  const api = getApi(advertisedPages, ModuleNames.Pbx);

  const [widgetLoading, widgetError, webPhoneUtils] = useAsyncCallback(
    async () =>
      Promise.all([getWidget("webphone"), getWidgetStore("webphone")]),
    []
  );
  const [queueData, setQueueData] = React.useState(null);
  const [refresh, setRefresh] = React.useState(0);
  // Phone Selection
  const [userPhones, setUserPhones] = React.useState([]);
  const [selectedPhoneId, setSelectedPhoneId] = React.useState(null);

  const [fetchLoading, setFetchLoading] = React.useState(true);
  const [joinQueueLoadingId, setJoinQueueLoadingId] = React.useState("");
  const [leaveQueueLoadingId, setLeaveQueueLoadingId] = React.useState("");
  const [callQueueLoadingId, setCallQueueLoadingId] = React.useState("");
  const [error, setError] = React.useState(null);

  const firstPageLoad = React.useRef(true);

  // First useEffect: Fetch user phones (only once when component mounts)
  React.useEffect(() => {
    const fetchUserPhonesData = async () => {
      try {
        const phones = await fetchUserPhones(api);
        setUserPhones(phones);

        const webphone = phones.find((p) => p.webphone);

        // Set default selected phone to current webphone if available
        if (webphone && !selectedPhoneId) {
          setSelectedPhoneId(webphone.id);
        }
      } catch (err) {
        console.error("Failed to fetch user phones", err);
        setFetchLoading(false);
        setError("Failed to load queue participation data. Please try again.");
      }
    };

    fetchUserPhonesData();
  }, []); // Only depend on phone credentials

  // Second useEffect: Fetch queue data (when refresh or selectedPhoneId changes)
  React.useEffect(() => {
    const fetchQueueData = async () => {
      try {
        setError(null);
        if (firstPageLoad.current) {
          setFetchLoading(true);
        }

        if (selectedPhoneId) {
          const data = await fetchQueues(selectedPhoneId, api);
          firstPageLoad.current = false;
          setQueueData(data);
        }
      } catch (err) {
        console.error("Failed to fetch queue data", err);
        setError("Failed to load queue data. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };

    // Only fetch if we have a phone ID to use
    if (selectedPhoneId) {
      fetchQueueData();
    }
  }, [refresh, selectedPhoneId]); // Depend on refresh, selectedPhoneId, and phone credentials

  const handleJoinQueue = async (queue) => {
    setJoinQueueLoadingId(queue.id);
    try {
      await joinQueue(queue.id, selectedPhoneId, api);
      // refresh the queue listing
      setRefresh((p) => p + 1);
      setError(null);

      // Add success alert
      console.log(`Successfully joined queue: ${queue.label}`);
    } catch (error) {
      const errorMessage =
        error?.response?.data?._root[0] ||
        error?.response?.data?.message ||
        error.message;
      setError(errorMessage);
      // Add error alert
      console.error(`Failed to join queue: ${queue.label}`);
    } finally {
      setJoinQueueLoadingId("");
    }
  };

  const handleLeaveQueue = async (queue) => {
    setLeaveQueueLoadingId(queue.id);
    try {
      await leaveQueue(queue.id, selectedPhoneId, api);
      console.log(`Left queue: ${queue.label}`);
      setRefresh((p) => p + 1); // Refresh data after leaving
      setError(null);
    } catch (error) {
      console.error(`Failed to leave queue: ${queue.label}`, error);
      setError(`Failed to leave queue: ${queue.label}`);

      // Add error alert
      console.error(`Failed to leave queue: ${queue.label}`);
    } finally {
      setLeaveQueueLoadingId("");
    }
  };

  const handleCallQueue = async (queue) => {
    setCallQueueLoadingId(queue.id);
    try {
      // use *queue_number => eg. for queue24 => *24 and use queue.code for displaying purpose
      const [phoneWidget, store] = webPhoneUtils;
      phoneWidget.api.invite(`*${queue.id}`, queue.code);
      // open the webphone widget
      store.setOpen(true);
      // invite(`*${queue.id}`, queue.code);
      setTimeout(() => {
        // refresh after two seconds delay
        setRefresh((p) => p + 1);
      }, 1000);
      // await joinQueue(queue.id, phone.credentials.phone_id);
    } catch (error) {
      console.error(`Failed to call queue: ${queue.label}`, error);

      const errorMessage =
        error?.response?.data?._root[0] ||
        error?.response?.data?.message ||
        error.message;
      // if (
      //   errorMessage ===
      //   "Phone is on-hook or not connected and cannot join an off-hook only queue. You can call the queue to join it."
      // ) {
      //   invite(queue.code, queue.code);
      //   setRefresh((p) => p + 1);
      // }
      setError(errorMessage);
      // Add error alert
      console.error(`Failed to call queue: ${queue.label}`);
    } finally {
      setCallQueueLoadingId("");
    }
  };

  // Filter queues that are available for webphone
  const availableQueues = queueData?.queues || [];

  // Count joined queues
  const joinedQueuesCount = availableQueues.filter(
    (q) => !!q.joined_phone
  ).length;
  const isPhoneOffHook = queueData?.on_hook === false;

  const isBackOfficeApp = process.env.REACT_APP_NAME === "backoffice";

  const handleRefreshQueues = React.useCallback(() => {
    setFetchLoading(true);
    setRefresh((p) => p + 1);
  }, []);

  // Subscribe event from Phone module to refresh queues
  React.useEffect(() => {
    subscribeEvent(CustomEvents.IncomingRefreshQueues, handleRefreshQueues);

    return () => {
      // Unsubscribe on cleanup
      unsubscribeEvent(CustomEvents.IncomingRefreshQueues, handleRefreshQueues);
    };
  }, [handleRefreshQueues]);

  // Raise event to notify Other modules
  React.useEffect(() => {
    publishEvent(CustomEvents.RefreshQueues);
  }, [refresh]);

  // Check if user has permission to manage queues
  return (
    <Card component={Paper} className={layoutClasses.cardContainer}>
      <CardHeader
        title={
          <Header
            title={uiConfiguration?.getUserConfig("title")}
            onRefresh={() => {
              setFetchLoading(true);
              setRefresh((p) => p + 1);
            }}
          />
        }
        className={layoutClasses.fixedHeader}
      />
      <Divider />
      <Box className={layoutClasses.scrollableContent}>
        {isBackOfficeApp ? (
          <Alert severity="info" style={{ margin: 16 }}>
            Queue participation is not available in backoffice module
          </Alert>
        ) : (
          <Queues
            fetchLoading={fetchLoading}
            joinQueueLoadingId={joinQueueLoadingId}
            leaveQueueLoadingId={leaveQueueLoadingId}
            callQueueLoadingId={callQueueLoadingId}
            queueCount={joinedQueuesCount}
            availableQueues={availableQueues}
            onJoinQueue={handleJoinQueue}
            onLeaveQueue={handleLeaveQueue}
            onCallQueue={handleCallQueue}
            error={error}
            isPhoneOffHook={isPhoneOffHook}
            userPhones={userPhones}
            selectedPhoneId={selectedPhoneId}
            onPhoneSelect={setSelectedPhoneId}
          />
        )}
      </Box>
    </Card>
  );
};

export default QueueParticipation;
