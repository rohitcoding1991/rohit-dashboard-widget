import { makeStyles } from "@material-ui/styles";

const useScheduledActivities = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: theme.spacing(1),
  },
}));

export default useScheduledActivities;
