import React, { useEffect, useMemo } from "react";
import { Button, DialogActions, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { utils } from "@telesero/frontend-common";
import ControlledDialog from "../../components/Control/ControlledDialog";
import { addAlert } from "../../store/notifications";
import { useUser } from "../../store/app";
import {
  setUIConfigurations,
  useUIConfigurations
} from "../../store/dashboardConfig";
import UIConfiguration from "../UIConfiguration/UIConfiguration";
import { useAdvertisedPages } from "../../store/advertised-pages";
import { isModuleAvailable } from "../../utils/modules";
import { hasRole } from "../../utils/access";
import { getBackofficeUser } from "../../store/app";
import { useAddCardModalStyles } from "./styles";

const defaultConfigurations = {
  quick_links: {
    coordinates: {
      x: 0,
      y: 0,
      w: 12,
      h: 2
    },
    metric_key: "quick_links",
    metric_chart: "quick_links",
    metric_chart_type: "quick_links_card",
    chart_configs: {
      title: "Quick Links"
    }
  },
  scheduled_activities: {
    coordinates: {
      x: 0,
      y: 0,
      w: 12,
      h: 2
    },
    metric_key: "scheduled_activities",
    metric_chart: "scheduled_activities",
    metric_chart_type: "scheduled_activities_card",
    chart_configs: {
      title: "Scheduled Activities"
    }
  },
  pinned_contacts: {
    coordinates: {
      x: 0,
      y: 0,
      w: 12,
      h: 2
    },
    metric_key: "pinned_contacts",
    metric_chart: "pinned_contacts",
    metric_chart_type: "pinned_contacts_card",
    chart_configs: {
      title: "Pinned Contacts"
    }
  },
  announcements: {
    coordinates: {
      x: 0,
      y: 0,
      w: 4,
      h: 4
    },
    metric_key: "announcements",
    metric_chart: "announcements",
    metric_chart_type: "announcements_table",
    chart_configs: {
      title: "Announcements"
    }
  },
  links: {
    coordinates: {
      x: 0,
      y: 0,
      w: 2,
      h: 2
    },
    metric_key: "links",
    metric_chart: "links",
    metric_chart_type: "links_table",
    chart_configs: {
      title: "Links"
    }
  },
  tasks: {
    coordinates: {
      x: 0,
      y: 0,
      w: 8,
      h: 4
    },
    metric_key: "tasks",
    metric_chart: "tasks",
    metric_chart_type: "tasks_table",
    chart_configs: {
      title: "Tasks"
    }
  },
  queue_participation: {
    coordinates: {
      x: 0,
      y: 0,
      w: 12,
      h: 5
    },
    metric_key: "queue_participation",
    metric_chart: "queue_participation",
    metric_chart_type: "queue_participation_card",
    chart_configs: {
      title: "Queue Participation"
    }
  }
};

const AddCardDialog = ({ open, setOpen }) => {
  const user = useUser();
  const uiConfiguration = useUIConfigurations();
  const classes = useAddCardModalStyles();

  const [cardTypes, setCardTypes] = React.useState([]);
  const buttonRef = React.useRef(null);

  const advertisedPages = useAdvertisedPages();

  const availableCardOptions = useMemo(() => {
    const isCrmAvailable = isModuleAvailable(advertisedPages, "crm");
    const isEmployeePortalAvailable = isModuleAvailable(
      advertisedPages,
      "Employee Portal"
    );
    const isPbxAvailable = isModuleAvailable(advertisedPages, "pbx");

    const options = [
      { value: "quick_links", title: "Quick Links" },
      {
        value: "scheduled_activities",
        title: "Scheduled Activities"
      },
      {
        value: "pinned_contacts",
        title: "Pinned Contacts"
      },
      {
        value: "announcements",
        title: "Announcements"
      },
      {
        value: "links",
        title: "Links"
      },
      {
        value: "tasks",
        title: "Tasks"
      },
      {
        value: "queue_participation",
        title: "Queue Participation"
      }
    ];

    if (!isCrmAvailable) {
      delete options["scheduled_activities"];
    }

    if (!isEmployeePortalAvailable) {
      delete options["announcements"];
      delete options["links"];
      delete options["tasks"];
    }

    const clientRoles = [
      utils.symfonyRoles.ROLE_CLIENT_USER,
      utils.symfonyRoles.ROLE_CLIENT_ADMIN
    ];
    const isAllowedForBackoffice =
      process.env.REACT_APP_NAME === "backoffice" &&
      user?.roles?.some((role) => clientRoles.includes(role));

    if (!isPbxAvailable || !isAllowedForBackoffice) {
      delete options["queue_participation"];
    }

    const staffUserRoles = [
      utils.symfonyRoles.ROLE_STAFF_ADMIN,
      utils.symfonyRoles.ROLE_STAFF_USER
    ];

    const backofficeUser = getBackofficeUser();
    if (backofficeUser) {
      const hasMatchingRole = staffUserRoles.some((role) =>
        hasRole(backofficeUser, role)
      );
      if (hasMatchingRole) {
        // assign just the quick links card, As the staff user can only see the quick links card only
        return options.filter((option) => option.value === "quick_links");
      }
    }

    return options;
  }, [advertisedPages]);

  useEffect(() => {
    if (open) {
      // Map initial selected values to availableCardOptions to maintain same references
      const initialCardTypes = uiConfiguration
        .map((config) => ({
          title: config.getUserConfig("title"),
          value: config.metricKey()
        }))
        .map((item) =>
          availableCardOptions.find((option) => option.value === item.value)
        )
        .filter(Boolean); // Ensure valid matches
      setCardTypes(initialCardTypes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, uiConfiguration]);

  return (
    <ControlledDialog
      open={open}
      title="Add New Card"
      confirmFn={() => {}}
      hideButtons
      closeFn={() => setOpen(false)}
      content={
        <Autocomplete
          multiple
          options={availableCardOptions}
          getOptionLabel={(option) => option.title}
          id="select-card"
          value={cardTypes}
          onChange={(event, newValue) =>
            setCardTypes(
              newValue.map((item) =>
                availableCardOptions.find(
                  (option) => option.value === item.value
                )
              )
            )
          } // Normalize selected values
          renderInput={(params) => (
            <TextField {...params} label="Select Cards" />
          )}
        />
      }
      dialogActions={
        <DialogActions className={classes.dialogActions}>
          <div className={classes.footerContainer}>
            <Button onClick={() => setOpen(false)} color="default">
              Cancel
            </Button>
            <Button
              ref={buttonRef}
              onClick={async () => {
                if (!cardTypes || cardTypes.length === 0) {
                  addAlert("Select at least one card to continue", {
                    variant: "error"
                  });
                  return;
                }

                const newConfigurations = cardTypes.map((card) => {
                  const existingConfig = uiConfiguration.find(
                    (config) => config.metricKey() === card.value
                  );

                  const coordinates = existingConfig
                    ? existingConfig.coordinates()
                    : defaultConfigurations[card.value].coordinates;

                  return new UIConfiguration({
                    ...defaultConfigurations[card.value],
                    coordinates
                  });
                });

                setUIConfigurations(newConfigurations);
                setOpen(false);
              }}
              color="primary"
              autoFocus
            >
              Confirm
            </Button>
          </div>
        </DialogActions>
      }
    />
  );
};

export default AddCardDialog;
