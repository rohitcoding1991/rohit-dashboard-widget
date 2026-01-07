import { makeStyles } from "@material-ui/styles";

export const useAnnouncementStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  text: {
    "& p": {
      width: "80%",
      height: 20,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  },
}));
