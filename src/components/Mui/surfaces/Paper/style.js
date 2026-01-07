import { makeStyles } from "@material-ui/styles";

export const usePaperStyle = makeStyles((theme) => ({
  root: {
    borderRadius: 10,
    background: theme.palette.common.white,
    boxShadow: "0px 1px 13px rgb(0 0 0 / 5%)"
  }
}));
