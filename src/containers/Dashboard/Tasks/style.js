import { makeStyles } from "@material-ui/styles";

export const SubtaskListItemStyle = makeStyles((theme) => ({
  previewImage: {
    maxWidth: "100%",
    maxHeight: 500,
  },
  previewBox: {
    position: "relative",
    textAlign: "center",
    marginBottom: 20,
  },
}));

export const TaskDetailStyle = makeStyles((theme) => ({
  titleGrid: {
    marginBottom: 10,
  },
  detailLoadingGrid: {
    padding: 10,
    height: "100%",
  },
  detailLoadingTypography: {
    marginTop: 8,
  },
  emptyIcon: {
    width: 42,
    height: 42,
    fill: theme.palette.text.secondary,
    marginBottom: 10,
  },
}));
