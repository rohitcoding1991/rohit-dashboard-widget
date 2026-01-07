import { makeStyles } from "@material-ui/styles";

export const useHeaderStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  refreshButton: {
    cursor: "pointer",
    fill: theme.palette.primary.main,
  },
}));

export const useDashboardCardLayoutStyles = makeStyles((theme) => ({
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
  },
  fixedHeader: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
  scrollableContent: {
    flex: 1,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },
}));

export const useAddCardModalStyles = makeStyles((theme) => ({
  footerContainer: {
    padding: 0,
    "& .MuiDialogActions-root": {
      padding: 0,
    },
    "@media (max-width: 768px)": {
      textAlign: "left",
      width: "100%",
      display: "flex",
      justifyContent: "flex-end",
    },
  },
  dialogActions: {
    padding: 0,
  },
}));

export const useDashboardStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    marginBottom: "20px",
    padding: "0px !important",
  },
  editModeHeaderBox: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  greetingMessage: {
    flex: 1,
    minWidth: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: theme.palette.primary.main,
    fontSize: "1.25rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.15rem",
    },
  },
  editModeCardButtons: {
    [theme.breakpoints.down("xs")]: {
      marginTop: "8px",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      justifyContent: "flex-start",
      rowGap: "8px",

      "& button": {
        width: "100%",
      },
    },
  },
  gridLayoutBox: {
    marginTop: 0,
  },
}));
