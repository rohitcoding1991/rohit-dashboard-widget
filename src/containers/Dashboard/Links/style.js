import { makeStyles } from "@material-ui/styles";

const LinkStyle = makeStyles((theme) => ({
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

export default LinkStyle;
