import React from "react";
import {
  Card,
  CardHeader,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Typography,
  CircularProgress,
  Chip,
  makeStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from "@material-ui/icons";
import { hooks } from "@telesero/frontend-common";
import Paper from "../../../components/Mui/surfaces/Paper/Paper";
import Header from "../Header";
import { getApi, ModuleNames } from "../../../utils/modules";
import { useAdvertisedPages } from "../../../store/advertised-pages";
import { getSubtasksByTaskId } from "../../../services/tasks";
import TaskDetails from "./TaskDetails";
import { useDashboardCardLayoutStyles } from "../styles";

const { useAsyncCallback } = hooks;

const useRowStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  expandedRow: {
    backgroundColor: theme.palette.action.hover,
  },
  statusChip: {
    fontWeight: 600,
    fontSize: "0.75rem",
  },
  noTasksContainer: {
    padding: theme.spacing(4),
    textAlign: "center",
  },
  tableCell: {
    padding: theme.spacing(2),
  },
}));

const Row = ({ task, api, onRefresh }) => {
  const classes = useRowStyles();
  const [open, setOpen] = React.useState(false);
  const [subtasks, setSubtasks] = React.useState([]);

  const [loadingSubtasks, errorSubtasks] = useAsyncCallback(
    async () => {
      if (!open || subtasks.length > 0) {
        return Promise.resolve();
      }

      return getSubtasksByTaskId(task.funnel.type, task.id, api);
    },
    [open, task.id],
    {
      resultHandler: (data) => {
        if (data?.employee_task_funnel_subscriptions) {
          setSubtasks(data.employee_task_funnel_subscriptions);
        }
      },
    }
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "primary";
      case "not_completed":
        return "default";
      case "not_started":
        return "secondary";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ", " + date.toLocaleTimeString();
    } catch (e) {
      return dateString;
    }
  };

  const getStatusLabel = () => {
    if (task.status_data && task.status_data.label) {
      return task.status_data.label;
    }
    return task.status?.replace("_", " ").toUpperCase() || "UNKNOWN";
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root} hover>
        <TableCell className={classes.tableCell}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" className={classes.tableCell}>
          {task.funnel?.name || "N/A"}
        </TableCell>
        <TableCell className={classes.tableCell}>
          {formatDate(task.start_date)}
        </TableCell>
        <TableCell className={classes.tableCell}>
          {formatDate(task.end_date)}
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Chip
            label={getStatusLabel()}
            color={getStatusColor(task.status)}
            size="small"
            className={classes.statusChip}
          />
        </TableCell>
      </TableRow>
      <TableRow className={open ? classes.expandedRow : ""}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom component="div">
                Subtasks of {task.funnel?.name || "the task"}
              </Typography>
              {loadingSubtasks && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p={3}
                >
                  <CircularProgress size={32} />
                </Box>
              )}
              {errorSubtasks && (
                <Alert severity="error">{errorSubtasks.message}</Alert>
              )}
              {!loadingSubtasks && !errorSubtasks && (
                <TaskDetails
                  task={task}
                  subtasks={subtasks}
                  useWrapper={false}
                  isProgressMode={false}
                  onUploadSuccess={onRefresh}
                />
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const TasksContainer = ({ uiConfiguration }) => {
  const layoutClasses = useDashboardCardLayoutStyles();
  const classes = useRowStyles();
  const advertisedPages = useAdvertisedPages();
  const [tasks, setTasks] = React.useState([]);
  const [refresh, setRefresh] = React.useState(0);

  const api = React.useMemo(
    () => getApi(advertisedPages, ModuleNames.EmployeePortal),
    [advertisedPages]
  );

  const [loading, error] = useAsyncCallback(
    async () => {
      return api.get("/employee_funnel_subscriptions/all/my");
    },
    [refresh, api],
    {
      resultHandler: (response) => {
        // Handle the API response structure with objects array
        const data = response?.data;
        if (data && data.objects) {
          setTasks(data.objects);
        } else if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
      },
    }
  );

  const handleRefresh = () => setRefresh((prev) => prev + 1);

  return (
    <Card component={Paper} className={layoutClasses.cardContainer}>
      <CardHeader
        title={
          <Header
            title={uiConfiguration?.getUserConfig("title") || "Tasks"}
            onRefresh={handleRefresh}
          />
        }
        className={layoutClasses.fixedHeader}
      />
      <Divider />
      <Box className={layoutClasses.scrollableContent}>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box p={2}>
            <Alert severity="error">
              {error.message || "Failed to load tasks"}
            </Alert>
          </Box>
        )}

        {!loading && !error && tasks.length === 0 && (
          <Box className={classes.noTasksContainer}>
            <Typography variant="body1" color="textSecondary">
              Good news, there is no task for you.
            </Typography>
          </Box>
        )}

        {!loading && !error && tasks.length > 0 && (
          <TableContainer>
            <Table aria-label="tasks table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell} />
                  <TableCell className={classes.tableCell}>Name</TableCell>
                  <TableCell className={classes.tableCell}>
                    Start Date
                  </TableCell>
                  <TableCell className={classes.tableCell}>End Date</TableCell>
                  <TableCell className={classes.tableCell}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <Row
                    key={task.id}
                    task={task}
                    api={api}
                    onRefresh={handleRefresh}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Card>
  );
};

export default TasksContainer;
