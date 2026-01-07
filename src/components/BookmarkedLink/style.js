import { makeStyles } from "@material-ui/styles";

export const useBookmarkedLinkStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    color: theme.palette.primary.light,
    boxShadow: "0px 1px 13px rgb(0 0 0 / 5%)",
    "&:hover": {
      boxShadow: "0px 1px 23px rgb(0 0 0 / 8%)",
    },
  },
  link: {
    textAlign: "center",
    width: "100%",
    padding: "20px 6px",
    background: theme.palette.common.white,
    borderRadius: 10,
    border: `solid 2px ${theme.palette.common.white}`,
    transition: `border ${theme.transitions.duration.standard}ms ease-out`,
    "&:hover": {
      borderColor: theme.palette.primary.main,
      "& .connexio_quick_link_description": {
        color: theme.palette.grey["500"],
      },
    },
  },
  linkIcon: {
    fontSize: 40,
    marginBottom: 10,
    color: theme.palette.primary.main,
    fill: theme.palette.primary.main,
    height: 40,
    width: 40,
  },
  linkIconEmpty: {
    color: `${theme.palette.error.main} !important`,
    fill: `${theme.palette.error.main} !important`,
  },
  linkTitle: {
    fontWeight: 500,
    fontSize: "1.2rem",
    letterSpacing: "0.04333em",
    color: theme.palette.primary.main,
    whiteSpace: "nowrap",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    overflowWrap: "break-word",
    padding: "0 4px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",
      padding: "0 8px",
    },
  },
  linkHelper: {
    color: theme.palette.grey["400"],
    whiteSpace: "nowrap",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    overflowWrap: "break-word",
    transition: `color ${theme.transitions.duration.standard}ms ease-out`,
    padding: "0 4px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12px",
      padding: "0 8px",
    },
  },
  moreIcons: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 6,
  },
  listContainer: {
    padding: 0,
  },
  iconContainer: {
    minWidth: 16,
    marginRight: 12,
  },
  edit: {
    color: theme.palette.primary.main,
    margin: 0,
  },
  delete: {
    color: theme.palette.error.main,
    margin: 0,
  },
}));
