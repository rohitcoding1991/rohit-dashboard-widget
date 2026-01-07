window.TeleseroWidgetLoader = function (options) {
  // eslint-disable-next-line no-undef
  teleseroAMD.require(["dashboard-widget"], function (loader) {
    loader.WidgetLoader(options);
  });
};
