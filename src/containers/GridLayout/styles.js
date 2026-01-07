import { makeStyles } from "@material-ui/styles";

export const useGridLayoutStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    margin: "0 24px",
    [theme.breakpoints.down("xs")]: {
      margin: "0 !important",
    },
    "& .react-grid-item": {
      transition: "all 200ms ease",
      transitionProperty: "left, top",
    },
    "& .react-grid-item.resizing": {
      zIndex: 1,
      willChange: "width, height",
    },
    "& .react-grid-item.react-draggable-dragging": {
      transition: "none",
      zIndex: 3,
      willChange: "transform",
    },
    "& .react-grid-item.dropping": {
      visibility: "hidden",
    },
    "& .react-grid-item.react-grid-placeholder": {
      background: theme.palette.primary.main,
      opacity: 0.2,
      transitionDuration: "100ms",
      zIndex: 2,
      userSelect: "none",
      borderRadius: 4,
    },
  },
  rootEditMode: {
    cursor: "move",
    "& .react-resizable-handle": {
      display: "block",
    },
  },
  gridLayoutBox: {
    background: "#ffffffc9",
    overflow: "hidden",
    borderRadius: 4,
    boxShadow:
      "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
  },
  gridLayoutBoxResizable: {
    "& .react-resizable-handle": {
      zIndex: 2000,
      display: "block",
      position: "absolute",
      width: 20,
      height: 20,
      backgroundRepeat: "no-repeat",
      backgroundOrigin: "content-box",
      boxSizing: "border-box",
      backgroundImage:
        "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+')",
      bottom: 0,
      right: 0,
      cursor: "se-resize",
      backgroundPosition: "bottom right",
      padding: "0 3px 3px 0",
      backgroundSize: 10,
    },
  },
  gridLayoutBoxDisableResizable: {
    "& .react-resizable-handle": {
      display: "none !important",
    },
  },
  gridLayoutItem: {
    height: "100%",
  },
  gridLayoutItemHeader: {
    height: 60,
  },
  gridLayoutItemContent: {
    height: "calc(100% - 60px)",
  },
}));

export const GridLayoutItemEditModeBackdropStyle = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: theme.zIndex.drawer,
    background: "rgb(230 230 230 / 82%)",
  },
  grid: {
    height: "100%",
  },
  title: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      lineHeight: "18px",
    },
  },
  actionButtonContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
  },
}));
