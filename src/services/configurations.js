import { backoffice } from "../settings/api";
import { getUIConfigurations as getConfigurations } from "../store/dashboardConfig";

export const getUIConfigurations = () => {
  return backoffice
    .get("/api/dashboard_configuration")
    .then((response) => response.data)
    .catch((error) => {
      if (error?.response?.status === 302) {
        return error?.response?.data;
      }
      if (error?.response?.status === 404) {
        return null;
      }
    });
};

export const updateUIConfiguration = () => {
  const uiConfigurations = getConfigurations();
  const configurationData = [];

  if (Array.isArray(uiConfigurations)) {
    uiConfigurations.forEach((uiConfiguration) => {
      configurationData.push(uiConfiguration.toObject());
    });
  }

  return backoffice
    .post("/api/dashboard_configuration", {
      configuration_data: configurationData,
    })
    .then((response) => response.data);
};
