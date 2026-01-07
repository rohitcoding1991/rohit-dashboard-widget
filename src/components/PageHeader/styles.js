import { makeStyles } from "@material-ui/styles";

export const usePageHeaderStyles = makeStyles((theme) => ({
  headerBox: (props) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "16px 24px",
    background: "#ffffffc9",
    borderRadius: "0px",
    boxShadow: "0px 1px 13px rgb(0 0 0 / 5%)",
    marginBottom: props.hasMargin ? "16px" : "0px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "8px"
    }
  }),
  greetingMessage: {
    flex: 1,
    minWidth: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: theme.palette.primary.main,
    fontSize: "1.25rem",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.15rem"
    }
  },
  cardButtons: { height: "100%", width: "auto", columnGap: "8px" },
  bookmarkIconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  },
  bookmarkIcon: {
    color: theme.palette.primary.main,
    marginTop: "2px",
    "&:hover": {
      color: theme.palette.primary.dark
    }
  }
}));
