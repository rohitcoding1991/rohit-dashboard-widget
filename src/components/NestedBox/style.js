import { makeStyles } from "@material-ui/styles";

const useNestedBoxStyle = makeStyles(({ palette, breakpoints }) => ({
  root: {
    position: "relative",
    padding: 10,
    background: "rgb(0 0 0 / 2%)",
    borderLeft: `solid 4px #E9E9E9`,
    border: `solid 1px #E9E9E9`,
    borderRadius: 4,
    "& + &": {
      marginTop: 16,
    },
    [breakpoints.down("sm")]: {
      padding: 0,
    },
  },
  rootDisabled: {
    background: "transparent !important",
    border: "none !important",
    padding: 0,
  },
  rootDisablePadding: {
    padding: 0,
  },
  rootDisableLeftBorder: {
    borderLeft: `solid 1px #E9E9E9`,
  },
}));

export default useNestedBoxStyle;
