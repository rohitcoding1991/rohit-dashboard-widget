import React from "react";
import ReactGridLayout from "react-grid-layout";
import { useDrawer, useIsMobile, useWindowSize } from "../../hooks";

export const drawerWidth = 320;
export const drawerDockWidth = 72;

const ResponsiveGridLayout = ({ ...props }) => {
  const { width: windowInnerWidth } = useWindowSize();
  const [drawerStatus] = useDrawer("navigation");
  const isMobile = useIsMobile();
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const containerPadding = 48;
    let calculated = windowInnerWidth - containerPadding;

    if (!isMobile) {
      if (drawerStatus === "closed") {
        calculated = calculated - drawerDockWidth;
      } else {
        calculated = calculated - drawerWidth;
      }
    } else {
      // For mobile devices, set width to window width directly for full-width layout
      calculated = windowInnerWidth;
    }

    setWidth(calculated);
  }, [windowInnerWidth, drawerStatus, isMobile]);

  const classNames = `${props.className || ""}`;

  return <ReactGridLayout {...props} className={classNames} width={width} />;
};

export default ResponsiveGridLayout;
