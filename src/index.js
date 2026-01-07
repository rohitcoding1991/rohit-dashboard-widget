import React from "react";
import ReactDOM from "react-dom";
import { setAdvertisedPages } from "./store/advertised-pages";
import WidgetComponent from "./Widget";

// Global config that can be accessed by your widget components
window.__WIDGET_CONFIG__ = window.__WIDGET_CONFIG__ || {};

// This is the main loader function that initializes the dashboard widget
export function WidgetLoader(options = {}) {
  const {
    containerId = "dashboard-widget-container",
    config = {},
    onLoad = () => {},
    onError = (error) => console.error("Dashboard Widget Error:", error)
  } = options;

  try {
    console.log("🚀 Initializing Dashboard Widget...");
    // Find the container element
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with ID "${containerId}" not found`);
    }
    console.log("📦 Container found, rendering dashboard...");

    if (config.advertisedPages) {
      console.log(
        "🔧 Setting advertised pages from config...",
        config.advertisedPages
      );
      // const { setAdvertisedPages } = require("./store/advertised-pages");
      setAdvertisedPages(config.advertisedPages);
    }

    // Render the dashboard widget
    ReactDOM.render(<WidgetComponent config={config} />, container);

    // Call the onLoad callback
    onLoad();

    console.log("✅ Dashboard Widget loaded successfully!");
  } catch (error) {
    console.error("❌ Dashboard Widget Error:", error);
    onError(error);
    throw error;
  }
}

// Export API object similar to widget-base pattern
export const api = {
  DashboardLoader: WidgetLoader
};

// Export for advanced usage
export { default as Widget } from "./Widget";
