import React from "react";
import { utils } from "@telesero/frontend-common";
import { Alert, AlertTitle } from "@material-ui/lab";
import { hooks } from "@telesero/frontend-common";
import { getUIConfigurations } from "../services/configurations";
import { setUIConfigurations } from "../store/dashboardConfig";
import UIConfiguration from "../containers/UIConfiguration/UIConfiguration";
import "../settings/metrics";

const { promise } = utils;
const createCancelToken = promise.createCancelToken;

const { useAsyncCallback } = hooks;

// import metrics for common dashboard
// require("../settings/metrics");

const DashboardProvider = ({ children }) => {
  const cancelToken = React.useRef(createCancelToken());
  const [loading, error] = useAsyncCallback(
    async () => {
      return getUIConfigurations();
    },
    [],
    {
      cancelSource: cancelToken.current,
      resultHandler: (data) => {
        if (data && "configuration_data" in data) {
          const uiConfigurations = [];
          if (
            data["configuration_data"] &&
            Array.isArray(data["configuration_data"])
          ) {
            data["configuration_data"].forEach((conf_data) => {
              uiConfigurations.push(new UIConfiguration(conf_data));
            });
          }
          setUIConfigurations(uiConfigurations);
        }
      },
    }
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error?.message || "Failed to load dashboard configuration!"}
      </Alert>
    );
  }

  return children;
};

export default DashboardProvider;
