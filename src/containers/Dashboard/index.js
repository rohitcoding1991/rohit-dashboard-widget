import React from "react";
import clsx from "clsx";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Typography,
  Tooltip,
} from "@material-ui/core";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Add as AddIcon,
} from "@material-ui/icons";
import { hooks } from "@telesero/frontend-common";
import GridLayout from "../GridLayout/GridLayout";
import AddCardDialog from "./AddCardDialog";
import { getGreetingMessage } from "../../components/GreetingMessage/GreetingMessage";
import { updateUIConfiguration } from "../../services/configurations";
import { useUIConfigurations } from "../../store/dashboardConfig";
import EmptyState from "./EmptyState";
import { useUser } from "../../store/app";
import PageHeader from "../../components/PageHeader";
import { useDashboardStyles } from "./styles";

const { useAsyncCallback } = hooks;

const Dashboard = () => {
  const classes = useDashboardStyles();
  const uiConfigurations = useUIConfigurations();
  const user = useUser();
  const [editMode, setEditMode] = React.useState(false);
  const [editModeLayouts, setEditModeLayouts] = React.useState([]);
  const [saveButtonClicked, setSaveButtonClicked] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState("add");

  const [loading] = useAsyncCallback(async () => {
    if (editMode && saveButtonClicked) {
      if (editModeLayouts.length >= 0) {
        return updateUIConfiguration()
          .then(() => {
            setEditMode(false);
            setEditModeLayouts([]);
            setSaveButtonClicked(false);
          })
          .catch((err) => {
            setSaveButtonClicked(false);
            return Promise.reject();
          });
      } else {
        setEditMode(false);
        setEditModeLayouts([]);
        setSaveButtonClicked(false);
        return Promise.resolve();
      }
    }
    return Promise.resolve();
  }, [editModeLayouts, editMode, saveButtonClicked]);

  const onChangeLayout = React.useCallback(
    (layouts) => {
      if (editMode) setEditModeLayouts(layouts);
    },
    [editMode]
  );

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth={false} className={classes.root}>
      <PageHeader
        renderActionButtons={() => (
          <>
            {editMode && (
              <React.Fragment>
                <Button
                  startIcon={<AddIcon />}
                  variant={"contained"}
                  disabled={loading || saveButtonClicked}
                  onClick={() => {
                    setDialogMode("add");
                    setDialogOpen(true);
                  }}
                  size={"small"}
                >
                  Add New Card
                </Button>
                <Button
                  variant={"contained"}
                  size={"small"}
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </React.Fragment>
            )}
            <Button
              startIcon={
                editMode ? (
                  loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <SaveIcon />
                  )
                ) : (
                  <EditIcon />
                )
              }
              onClick={() => {
                if (editMode) {
                  setSaveButtonClicked(true);
                } else {
                  setEditMode(true);
                }
              }}
              size={"small"}
              variant={"contained"}
              color={"primary"}
              disabled={editMode && (loading || saveButtonClicked)}
            >
              {editMode ? "Save" : "Edit"}
            </Button>
          </>
        )}
        className={editMode ? classes.editModeHeaderBox : ""}
        actionClassName={editMode ? classes.editModeCardButtons : ""}
        renderTitle={() => (
          <Typography variant="h4" className={classes.greetingMessage}>
            {getGreetingMessage()}
            <Tooltip title={user.name} arrow>
              <span>{user.name ? `, ${user.name}` : ""}</span>
            </Tooltip>
          </Typography>
        )}
      />

      <Box className={clsx(classes.gridLayoutBox)}>
        {uiConfigurations.length === 0 && (
          <Box sx={{ mt: 2, px: 1, mx: 2 }}>
            <EmptyState />
          </Box>
        )}
        <GridLayout
          editMode={editMode}
          disableDrag={saveButtonClicked}
          disableResize={saveButtonClicked}
          onChangeLayouts={onChangeLayout}
          onClickConfigure={() => {
            setDialogMode("edit");
            setDialogOpen(true);
          }}
        />
      </Box>

      {dialogOpen && (
        <AddCardDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          mode={dialogMode}
        />
      )}
    </Container>
  );
};

export default Dashboard;
