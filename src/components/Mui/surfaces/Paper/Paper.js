import React from "react";
import { Paper as MuiPaper } from "@material-ui/core";
import { usePaperStyle } from "./style";
import clsx from "clsx";

/**
 * This is our Paper component, we override the design here
 *
 * @param children
 * @param className
 * @param props
 * @param ref
 * @return {JSX.Element}
 */
const Paper = ({ children, className, ...props }, ref) => {
  const classes = usePaperStyle();

  return (
    <MuiPaper {...props} ref={ref} className={clsx(className, classes.root)}>
      {children}
    </MuiPaper>
  );
};

export default React.forwardRef(Paper);
