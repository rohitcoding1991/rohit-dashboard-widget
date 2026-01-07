export default class MetricChartComponent {
  /**
   * @param {string} metricChartComponentKey
   * @param {string} metricChartComponentLabel
   * @param {React.Component} component
   * @param {MetricChart} parent
   */
  constructor(
    metricChartComponentKey,
    metricChartComponentLabel,
    component,
    parent
  ) {
    this._metricChartComponentKey = metricChartComponentKey;
    this._metricChartComponentLabel = metricChartComponentLabel;
    this._component = component;
    this._previewImage = null;
    this._parent = parent;

    this._componentSettings = new MetricChartComponentSettings(this);
    this._componentUserSettings = new MetricChartComponentUserSettings(this);
  }

  /**
   * @return {string}
   */
  key() {
    return this._metricChartComponentKey;
  }

  /**
   * @return {string}
   */
  label() {
    return this._metricChartComponentLabel;
  }

  /**
   * @return {React.Component}
   */
  component() {
    return this._component;
  }

  /**
   * @return {*}
   */
  previewImage() {
    return this._previewImage;
  }

  /**
   * @param previewImage
   * @return {MetricChartComponent}
   */
  setPreviewImage(previewImage) {
    this._previewImage = previewImage;
    return this;
  }

  /**
   * @return {MetricChartComponentSettings}
   */
  componentSettings() {
    return this._componentSettings;
  }

  /**
   * @param {MetricChartComponentSettings} componentSettingsClass
   */
  setComponentSettings(componentSettingsClass) {
    this._componentSettings = componentSettingsClass;
  }

  /**
   * @return {MetricChartComponentUserSettings}
   */
  componentUserSettings() {
    return this._componentUserSettings;
  }

  /**
   * @param chartComponentUserSettingsClass
   */
  setComponentUserSettings(chartComponentUserSettingsClass) {
    this._componentUserSettings = chartComponentUserSettingsClass;
  }

  /**
   * @return {MetricChart}
   */
  addChartComponentEnd() {
    this._parent.pushChartComponent(this);
    return this._parent;
  }
}

export class MetricChartComponentSettings {
  /**
   * @param {MetricChartComponent} parent
   */
  constructor(parent) {
    this._parent = parent;
    this._useItemWrapper = false;
    this._dataGridSize = { minW: 1, maxW: 12, minH: 1, maxH: 4 };
    this._dataGridConfigs = { isResizable: true };
  }

  /**
   * @param {boolean} state
   * @return {MetricChartComponentSettings}
   */
  useItemWrapper(state) {
    this._useItemWrapper = state;
    return this;
  }

  getUseItemWrapper() {
    return this._useItemWrapper;
  }

  /**
   * @param {object} gridSize
   * @return {MetricChartComponentSettings}
   */
  dataGridSize(gridSize) {
    this._dataGridSize = gridSize;
    return this;
  }

  getDataGridSize() {
    return this._dataGridSize;
  }

  /**
   * @param gridConfigs
   * @return {MetricChartComponentSettings}
   */
  dataGridConfigs(gridConfigs) {
    this._dataGridConfigs = gridConfigs;
    return this;
  }

  /**
   * @return {*|{isResizable: boolean}}
   */
  getDataGridConfigs() {
    return this._dataGridConfigs;
  }

  /**
   * @return {MetricChartComponent}
   */
  componentSettingsEnd() {
    this._parent.setComponentSettings(this);
    return this._parent;
  }
}

export class MetricChartComponentUserSettings {
  /**
   * @param {MetricChartComponent} parent
   */
  constructor(parent) {
    this._parent = parent;
    this._userSettings = [];
    this._defaultValues = {};
  }

  /**
   * @param userSettingsFormField
   * @return {MetricChartComponentUserSettings}
   */
  addUserSettings(userSettingsFormField) {
    this._userSettings.push(userSettingsFormField);
    this._defaultValues[userSettingsFormField.name] =
      userSettingsFormField.default;

    return this;
  }

  /**
   * @return {[]}
   */
  userSettings() {
    return this._userSettings;
  }

  /**
   * @return {object}
   */
  defaultValues() {
    return this._defaultValues;
  }

  /**
   * @param {string} name
   * @return {mix}
   */
  defaultValueByFieldName(name) {
    return this._defaultValues[name];
  }

  /**
   * @return {MetricChartComponent}
   */
  componentUserSettingsEnd() {
    this._parent.setComponentUserSettings(this);
    return this._parent;
  }
}
