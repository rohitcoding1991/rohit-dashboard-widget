import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from "@material-ui/core";
import clsx from "clsx";
import {
  MoreHoriz as MoreHorizIcon,
  MoreVert as MoreVertIcon,
} from "@material-ui/icons";
import ResponsiveGridLayout from "../../components/ResponsiveGridLayout";
import {
  getUIConfigurationByUuid,
  removeUIConfigurationByUuid,
  useUIConfigurations,
  getUIConfigurations,
} from "../../store/dashboardConfig";
import UIConfiguration from "../UIConfiguration/UIConfiguration";
import UndefinedComponent from "./UndefinedComponent";
import GridLayoutItemEditModeBackdrop from "./GridLayoutItemEditModeBackdrop";
// import { useAdvertisedPages } from "../../store/advertisedPages";
import { useAdvertisedPages } from "../../store/advertised-pages";
import { isModuleAvailable } from "../../utils/modules";
import {
  METRIC_PINNED_CONTACTS,
  METRIC_SCHEDULED_ACTIVITIES,
  METRIC_ANNOUNCEMENTS,
  METRIC_LINKS,
  METRIC_TASKS,
  ALL_METRICS,
  METRIC_QUEUE_PARTICIPATION,
} from "../../settings/metrics";
import { useGridLayoutStyles } from "./styles";

/**
 * This layout for MonitoringDashboard
 * We uses the react-grid-layout for grid system
 *
 * @param Component
 * @param config
 * @param editMode
 * @param onClickRemove
 * @param onClickConfigure
 * @return {JSX.Element}
 * @constructor
 */
export const GridLayoutItem = ({
  component: Component,
  config,
  editMode = false,
  onClickRemove,
  onClickConfigure,
}) => {
  const classes = useGridLayoutStyles();
  const ConfActIcon = config.actions.actionIcon;
  const [extraMenuOpen, setExtraMenuOpen] = React.useState(false);

  return (
    <Card className={classes.gridLayoutItem}>
      <CardHeader
        title={config.typography.title}
        className={classes.gridLayoutItemHeader}
        action={
          config.actions.haveExtraMenu && (
            <IconButton
              onClick={() => setExtraMenuOpen(!extraMenuOpen)}
              disabled={editMode}
            >
              {!ConfActIcon &&
                (extraMenuOpen ? <MoreHorizIcon /> : <MoreVertIcon />)}
              {ConfActIcon && <ConfActIcon />}
            </IconButton>
          )
        }
      />
      <CardContent className={classes.gridLayoutItemContent}>
        <Component
          extraMenuStatus={extraMenuOpen}
          onClickConfigure={onClickConfigure}
          onClickRemove={onClickRemove}
          editMode={editMode}
        />
      </CardContent>
    </Card>
  );
};

const GridLayout = ({
  editMode,
  onChangeLayouts,
  onClickConfigure = (uiConfiguration) => {},
}) => {
  const advertisedPages = useAdvertisedPages();
  const isCrmAvailable = React.useMemo(() => {
    return isModuleAvailable(advertisedPages, "crm");
  }, [advertisedPages]);
  const isEmployeePortalAvailable = React.useMemo(() => {
    return isModuleAvailable(advertisedPages, "Employee Portal");
  }, [advertisedPages]);
  const isPbxAvailable = React.useMemo(() => {
    return isModuleAvailable(advertisedPages, "pbx");
  }, [advertisedPages]);

  const [layout, setLayout] = React.useState([]);
  const [uiConfigurations, _setUIConfigurations] = React.useState(
    getUIConfigurations()
  );

  let filteredUIConfiguration = [];

  if (uiConfigurations?.length > 0) {
    filteredUIConfiguration = uiConfigurations.filter((config) => {
      const metricKey = config.metricKey();

      // if the metric is not available, exclude it
      if (!ALL_METRICS.includes(metricKey)) {
        return false;
      }

      // Exclude metrics based on permissions
      if (
        !isCrmAvailable &&
        [METRIC_PINNED_CONTACTS, METRIC_SCHEDULED_ACTIVITIES].includes(
          metricKey
        )
      ) {
        return false;
      }

      if (
        !isEmployeePortalAvailable &&
        [METRIC_ANNOUNCEMENTS, METRIC_LINKS, METRIC_TASKS].includes(metricKey)
      ) {
        return false;
      }

      if (!isPbxAvailable && [METRIC_QUEUE_PARTICIPATION].includes(metricKey)) {
        return false;
      }

      // Keep the element if it doesn't match any exclusion conditions
      return true;
    });
  }

  const classes = useGridLayoutStyles({
    uiConfigurations: filteredUIConfiguration,
  });
  const uiConfigurationsFromStore = useUIConfigurations();
  console.log(
    uiConfigurationsFromStore,
    "uiConfigurationsFromStore uiConfigurationsFromStore"
  );
  const prepareLayoutsForHandler = (layouts) => {
    const layoutsForHandler = [];
    if (Array.isArray(layouts) && layouts.length > 0) {
      layouts.forEach((layout) => {
        const [uuid] = layout.i.split("--");
        /** @var {UIConfiguration} **/
        const uiConfiguration = getUIConfigurationByUuid(uuid);
        if (uiConfiguration instanceof UIConfiguration) {
          uiConfiguration.updateCoordinates({
            w: layout.w,
            h: layout.h,
            x: layout.x,
            y: layout.y,
          });

          layoutsForHandler.push(uiConfiguration);
        }
      });
    }

    return layoutsForHandler;
  };

  const onLayoutChange = (layout) => {
    setLayout(layout);
    if (editMode && typeof onChangeLayouts === "function") {
      onChangeLayouts(prepareLayoutsForHandler(layout));
    }
  };

  React.useEffect(() => {
    _setUIConfigurations(uiConfigurationsFromStore);
  }, [uiConfigurationsFromStore, editMode]);

  React.useEffect(() => {
    if (typeof onChangeLayouts === "function") {
      onChangeLayouts(uiConfigurations);
    }
  }, [uiConfigurations]);

  return (
    <Box
      className={clsx(classes.root, {
        [classes.rootEditMode]: editMode,
      })}
    >
      <ResponsiveGridLayout
        layout={layout}
        onLayoutChange={onLayoutChange}
        onResize={onLayoutChange}
        isDraggable={editMode}
        isResizable={editMode}
        rowHeight={120}
      >
        {filteredUIConfiguration.length > 0 ? (
          filteredUIConfiguration.map((uiConfiguration, index) => {
            const metricChartComponentConfigs =
              uiConfiguration.metricChartComponent();
            const metricChartComponentSettings = uiConfiguration
              .metricChartComponent()
              .componentSettings();

            let GridLayoutItemComponent = UndefinedComponent;
            if (metricChartComponentConfigs) {
              GridLayoutItemComponent = metricChartComponentConfigs.component();
            }

            if (editMode) {
              GridLayoutItemComponent = GridLayoutItemEditModeBackdrop;
            }

            let useItemWrapper = true;
            let isResizable = true;
            let dataGridSizes = {};
            let dataGridConfigs = {};
            if (metricChartComponentSettings) {
              useItemWrapper = metricChartComponentSettings.getUseItemWrapper();
              dataGridSizes = metricChartComponentSettings.getDataGridSize();
              dataGridConfigs =
                metricChartComponentSettings.getDataGridConfigs();

              if (dataGridConfigs) {
                isResizable = dataGridConfigs.isResizable;
              }
            }

            const onClickConfigureHandler = () => {
              onClickConfigure(uiConfiguration);
            };
            const onClickRemove = () =>
              removeUIConfigurationByUuid(uiConfiguration.uuid());

            return (
              <Box
                className={clsx(classes.gridLayoutBox, {
                  [classes.gridLayoutBoxResizable]: editMode,
                  [classes.gridLayoutBoxDisableResizable]: !isResizable,
                })}
                key={`${uiConfiguration.uuid()}--${index}`}
                data-grid={{
                  ...uiConfiguration.coordinates(),
                  ...dataGridSizes,
                  ...dataGridConfigs,
                }}
                sx={{ overflowY: "auto !important" }}
              >
                {useItemWrapper ? (
                  <GridLayoutItem
                    component={GridLayoutItemComponent}
                    uiConfiguration={uiConfiguration}
                    editMode={editMode}
                    onClickRemove={onClickRemove}
                    onClickConfigure={onClickConfigureHandler}
                  />
                ) : (
                  <GridLayoutItemComponent
                    uiConfiguration={uiConfiguration}
                    editMode={editMode}
                    onClickRemove={onClickRemove}
                    onClickConfigure={onClickConfigureHandler}
                  />
                )}
              </Box>
            );
          })
        ) : (
          <div
            key={"undefined"}
            style={{ display: "none", cursor: "default" }}
          />
        )}
      </ResponsiveGridLayout>
    </Box>
  );
};

export default GridLayout;
