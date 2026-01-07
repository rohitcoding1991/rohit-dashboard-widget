import React from "react";
import clsx from "clsx";
import { Cached as CachedIcon } from "@material-ui/icons";
import { Box, Tooltip, Typography, useTheme } from "@material-ui/core";

import { useHeaderStyles } from "./styles";

const Header = ({ title, onRefresh, className = "" }) => {
  const classes = useHeaderStyles();
  const theme = useTheme();

  return (
    <Box className={clsx(classes.container, className)}>
      <Typography
        variant="h5"
        style={{
          fontSize: 20,
          marginRight: 16,
          color: theme.palette.primary.main,
        }}
      >
        {title}
      </Typography>
      <Tooltip title="Refresh">
        <CachedIcon onClick={onRefresh} className={classes.refreshButton} />
      </Tooltip>
    </Box>
  );
};

export default Header;
