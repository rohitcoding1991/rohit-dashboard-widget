import { lighten } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useEventTitleStyles = makeStyles((theme) => ({
  container: (props) => ({
    height: "100%",
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
    color:
      props.index % 2 === 0
        ? theme.palette.common.white
        : theme.palette.primary.light,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0px 1px 13px rgb(0 0 0 / 5%)",
    backgroundImage:
      props.index % 2 === 0
        ? `linear-gradient(to right, ${lighten(
            theme.palette.primary.main,
            0.5
          )} 0%, ${lighten(theme.palette.primary.main, 0.35)} 50%,  ${lighten(
            theme.palette.primary.main,
            0.15
          )} 100%)`
        : `linear-gradient(to right, ${lighten("#fff", 0.5)} 0%, ${lighten(
            "#fff",
            0.35
          )} 50%,  ${lighten("#fff", 0.15)} 100%)`,
    transition: `border ${theme.transitions.duration.standard}ms ease-out`,
    "&:hover": {
      boxShadow: "0px 1px 26px rgb(0 0 0 / 16%)",
      borderColor: theme.palette.primary.main
    },
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(1)
    }
  }),
  dateTimeContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(0.5),

    [theme.breakpoints.down("md")]: {
      display: "block !important",
      textAlign: "left !important"
    }
  },
  dateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center"
  },
  date: {
    fontSize: "32px",
    fontWeight: "bold",
    lineHeight: "32px"
  },
  month: {
    fontSize: 14,
    fontWeight: 500,
    textTransform: "uppercase"
  },
  time: {
    fontSize: 14,
    fontWeight: 500,
    textAlign: "right",

    [theme.breakpoints.down("md")]: {
      textAlign: "left !important"
    }
  },
  eventDescription: {
    // elipsis after 2 lines
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: 14,
    fontWeight: 400,
    margin: theme.spacing(1, 0),
    marginBottom: theme.spacing(2)
  },
  name: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    "& span:first-child": {
      marginRight: theme.spacing(0.5)
    }
  },
  footer: (props) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    "& a": {
      color:
        props.index % 2 === 0
          ? theme.palette.common.white
          : theme.palette.primary.main,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    "& svg": {
      fontSize: "24px"
    }
  }),
  contact: {
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "& svg": {
      marginRight: theme.spacing(0.5),
      fontSize: 14
    }
  },
  seeMoreTile: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: "none !important",
    backgroundColor: `${theme.palette.common.white} !important`,
    color: `${theme.palette.primary.main} !important`,
    cursor: "pointer",
    "& button:hover": {
      backgroundColor: `${theme.palette.common.white} !important`
    }
  }
}));

export default useEventTitleStyles;
