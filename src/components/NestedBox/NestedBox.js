import React from "react";
import { Box } from "@material-ui/core";
import clsx from "clsx";
import useNestedBoxStyle from "./style";

const NestedBox = (
  {
    id = "nested-box",
    children,
    disabled = false,
    disablePadding = false,
    className = "",
    disableLeftBorder = false,
    ...props
  },
  ref
) => {
  const classes = useNestedBoxStyle();

  return (
    <Box
      id={id}
      className={clsx(classes.root, className, {
        [classes.rootDisabled]: disabled,
        [classes.rootDisablePadding]: disablePadding,
        [classes.rootDisableLeftBorder]: disableLeftBorder,
      })}
      {...props}
      ref={ref}
    >
      {children}
    </Box>
  );
};

export default React.forwardRef(NestedBox);
