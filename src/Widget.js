import React from "react";
import { theme as muiTheme } from "@telesero/frontend-common";
import {
  StylesProvider,
  createGenerateClassName,
  responsiveFontSizes,
  createTheme,
  ThemeProvider,
} from "@material-ui/core";
import DashboardProvider from "./providers/DashboardProvider";
import Dashboard from "./containers/Dashboard";
import { useThemeType } from "./store/app";
import muiOverrides from "./settings/muiOverrides";

// Create a unique class name generator for the widget
const generateClassName = createGenerateClassName({
  productionPrefix: "widget-dashboard",
  seed: "widget-dashboard",
});

// Self-contained Widget that doesn't need external scripts
const Widget = () => {
  const themeType = useThemeType() || "default";
  const theme = React.useMemo(() => {
    const _fcTheme = muiTheme[themeType];
    _fcTheme.palette.background.default = "#F3F7FD";
    const _theme = responsiveFontSizes(createTheme(muiTheme[themeType]));
    return {
      ..._theme,
      overrides: muiOverrides(_theme),
    };
  }, [themeType]);

  return (
    <ThemeProvider theme={theme || muiTheme.default}>
      <StylesProvider generateClassName={generateClassName}>
        <DashboardProvider>
          <Dashboard />
        </DashboardProvider>
      </StylesProvider>
    </ThemeProvider>
  );
};

export default Widget;
