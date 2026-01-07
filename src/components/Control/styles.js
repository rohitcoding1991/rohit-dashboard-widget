import { makeStyles } from "@material-ui/styles";

const useControlledDialogStyle = makeStyles((theme) => ({
  dialogTitle: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    minWidth: "100%"
  },
  [theme.breakpoints.down("sm")]: {
    dialogTitle: {
      maxWidth: "calc(100dvw - 265px)"
    }
  },
  dialogTitleWithOnlyCloseButton: {
    [theme.breakpoints.up("sm")]: {
      maxWidth: "calc(525px - 72px)"
    }
  },
  footerContainer: {
    "@media (max-width: 768px)": {
      textAlign: "left",
      width: "100%",
      display: "flex",
      flexDirection: "row-reverse",
      justifyContent: "flex-end"
    }
  }
}));

export { useControlledDialogStyle };
