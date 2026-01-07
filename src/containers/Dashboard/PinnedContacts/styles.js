import { makeStyles } from "@material-ui/styles";

export const useContactCardStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
  },
  contactDetails: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(2),
  },
  name: {
    fontWeight: 600,
    fontSize: 16,
  },
  links: {
    fontSize: 13,
    fontWeight: 300,
    color: theme.palette.text.secondary,
    textDecoration: "none",
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  nameContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing(1),
  },
  pinIcon: {
    cursor: "pointer",
  },
  contactName: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));
