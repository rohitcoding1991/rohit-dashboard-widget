import { makeStyles } from "@material-ui/styles";

export const useBookMarkedLinkStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));

export const useBookmarkModalStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    rowGap: theme.spacing(2),
  },

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
  caption: {
    fontSize: 14,
    color: theme.palette.text.secondary,
    wordBreak: "break-word",
  },
}));
