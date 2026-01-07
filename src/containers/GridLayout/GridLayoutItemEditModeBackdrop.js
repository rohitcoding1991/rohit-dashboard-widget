import React from "react";
import { Box, Grid, Button, Typography } from "@material-ui/core";
import {
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";
import { useIsMobile } from "../../hooks";
import { GridLayoutItemEditModeBackdropStyle } from "./styles";

/**
 * @param {UIConfiguration} uiConfiguration
 * @param {boolean} editMode
 * @param {function} onClickConfigure
 * @param {function} onClickRemove
 * @return {JSX.Element}
 * @constructor
 */
const GridLayoutItemEditModeBackdrop = ({
  uiConfiguration,
  editMode = false,
  onClickConfigure = null,
  onClickRemove = null,
}) => {
  const isMobile = useIsMobile();
  const [removeQuestion, setRemoveQuestion] = React.useState(false);
  const classes = GridLayoutItemEditModeBackdropStyle();
  // const { typography } = uiConfiguration.metricChartConfigs();

  if (!editMode) {
    return <React.Fragment />;
  }

  return (
    <Box className={classes.root}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.grid}
      >
        <Grid item style={{ marginBottom: 10 }}>
          <Typography
            variant="h6"
            color={"textPrimary"}
            align={"center"}
            className={classes.title}
          >
            {removeQuestion && "Do you want to remove "}
            {uiConfiguration?.userConfigs()?.title}
          </Typography>
        </Grid>
        <Grid item>
          {removeQuestion ? (
            <React.Fragment>
              <Button
                variant="contained"
                color={"primary"}
                onClick={() => setRemoveQuestion(false)}
                size={"small"}
              >
                No
              </Button>
              <Button color={"primary"} onClick={onClickRemove} size={"small"}>
                Yes
              </Button>
            </React.Fragment>
          ) : (
            <div className={classes.actionButtonContainer}>
              <Button
                variant="contained"
                color={"primary"}
                startIcon={<SettingsIcon />}
                onClick={onClickConfigure}
                size={"small"}
                className="icon-only"
              >
                {!isMobile && "Configure"}
              </Button>
              <Button
                variant="contained"
                color={"primary"}
                startIcon={<DeleteIcon />}
                onClick={() => setRemoveQuestion(true)}
                size={"small"}
                className="icon-only"
              >
                {!isMobile && "Remove"}
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GridLayoutItemEditModeBackdrop;
