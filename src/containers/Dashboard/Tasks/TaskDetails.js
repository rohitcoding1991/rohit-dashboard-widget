import React from "react";
import { Grid, Box, CircularProgress, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { hooks, utils } from "@telesero/frontend-common";
import { getSubtasksByTaskId } from "../../../services/tasks";
import NestedBox from "../../../components/NestedBox/NestedBox";
import { useAdvertisedPages } from "../../../store/advertised-pages";
import { getApi, ModuleNames } from "../../../utils/modules";
import SubtaskList from "./SubtaskList";
import { TaskDetailStyle } from "./style";

const { useAsyncCallback } = hooks;
const { promise } = utils;
const createCancelToken = promise.createCancelToken;

const EmptyPackageSvg = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M2 10.96a.985.985 0 0 1-.37-1.37L3.13 7c.11-.2.28-.34.47-.42l7.83-4.4c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.19.1.35.26.44.46l1.45 2.52c.28.48.11 1.09-.36 1.36l-1 .58v4.96c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-5.54c-.3.17-.68.18-1 0m10-6.81v6.7l5.96-3.35L12 4.15M5 15.91l6 3.38v-6.71L5 9.21v6.7m14 0v-3.22l-5 2.9c-.33.18-.7.17-1 .01v3.69l6-3.38m-5.15-2.55 6.28-3.63-.58-1.01-6.28 3.63.58 1.01Z" />
  </svg>
);

const TaskDetails = ({
  task,
  subtasks: providedSubtasks,
  useWrapper = true,
  isProgressMode = false,
  emptyText = "THERE IS NO SUBTASK",
  onUploadSuccess = () => {},
}) => {
  const classes = TaskDetailStyle();
  const advertisedPages = useAdvertisedPages();
  const cancel = React.useRef(createCancelToken());
  const [subtasks, setSubtasks] = React.useState(providedSubtasks || []);
  const [fetch, setFetch] = React.useState(0);

  const api = getApi(advertisedPages, ModuleNames.EmployeePortal);

  const [loading, error] = useAsyncCallback(
    async () => {
      if (!task || providedSubtasks) {
        return Promise.resolve();
      }

      if (isProgressMode) {
        setSubtasks(task?.employee_task_funnel_subscriptions || []);
        return Promise.resolve();
      }

      return getSubtasksByTaskId(task.funnel.type, task?.id, api);
    },
    [task, fetch, isProgressMode, providedSubtasks],
    {
      cancelSource: cancel.current,
      resultHandler: (data) => {
        if (data?.employee_task_funnel_subscriptions) {
          setSubtasks(data.employee_task_funnel_subscriptions);
        }
      },
    }
  );

  React.useEffect(() => {
    if (providedSubtasks) {
      setSubtasks(providedSubtasks);
    }
  }, [providedSubtasks]);

  const handleUploadSuccess = () => {
    setFetch(fetch + 1);
    onUploadSuccess();
  };

  const subtaskList = React.useMemo(
    () => (
      <SubtaskList
        task={task}
        subtasks={subtasks}
        isProgressMode={isProgressMode}
        onUploadSuccess={handleUploadSuccess}
      />
    ),
    [task, subtasks, isProgressMode]
  );

  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      {useWrapper && (
        <Grid item xs={12} className={classes.titleGrid}>
          <Typography variant="button">
            Subtasks of {task ? task.funnel.name : "the task"}
          </Typography>
        </Grid>
      )}
      <NestedBox
        disabled={!useWrapper}
        disablePadding
        disableLeftBorder
        style={{ width: "100%" }}
      >
        <Grid item xs={12}>
          {loading && (
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              className={classes.detailLoadingGrid}
            >
              <CircularProgress size={32} />
              <Typography
                variant="button"
                color="primary"
                className={classes.detailLoadingTypography}
              >
                LOADING
              </Typography>
            </Grid>
          )}
          {error && (
            <Box p={2}>
              <Alert severity={"error"}>{error.message}</Alert>
            </Box>
          )}
          {!loading && !error && subtasks && subtasks.length === 0 && (
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              className={classes.detailLoadingGrid}
            >
              <EmptyPackageSvg className={classes.emptyIcon} />
              <Typography variant="button" color="textSecondary">
                {emptyText}
              </Typography>
            </Grid>
          )}
          {!loading && !error && subtasks && subtaskList}
        </Grid>
      </NestedBox>
    </Grid>
  );
};

export default TaskDetails;
