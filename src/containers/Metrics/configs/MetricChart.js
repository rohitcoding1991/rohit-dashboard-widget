import MetricChartComponent from "./MetricChartComponent/MetricChartComponent";

export default class MetricChart {
  /**
   * @param {string} metricChartKey
   * @param {string} metricChartLabel
   * @param {Metric} parent
   */
  constructor(metricChartKey, metricChartLabel, parent) {
    this._parent = parent;
    this._metricChartKey = metricChartKey;
    this._metricChartLabel = metricChartLabel;
    this._metricChartComponents = [];
  }

  /**
   * @return {string}
   */
  key() {
    return this._metricChartKey;
  }

  /**
   * @return {string}
   */
  label() {
    return this._metricChartLabel;
  }

  /**
   * @param {string} metricChartComponentKey
   * @param {string} metricChartComponentLabel
   * @param {React.Component} component
   * @return {MetricChartComponent}
   */
  addChartComponent(
    metricChartComponentKey,
    metricChartComponentLabel,
    component
  ) {
    return new MetricChartComponent(
      metricChartComponentKey,
      metricChartComponentLabel,
      component,
      this
    );
  }

  /**
   * @param {MetricChartComponent} metricChartComponentClass
   * @return {MetricChart}
   */
  pushChartComponent(metricChartComponentClass) {
    this._metricChartComponents.push(metricChartComponentClass);
    return this;
  }

  /**
   * @return {MetricChartComponent[]}
   */
  metricChartComponents() {
    return this._metricChartComponents;
  }

  /**
   * @param key
   * @return {MetricChartComponent}
   */
  getMetricChartComponentByKey(key) {
    return this.metricChartComponents().find(
      (component) => component.key() === key
    );
  }

  /**
   * @return {Metric}
   */
  addChartEnd() {
    this._parent.addChartClass(this);
    return this._parent;
  }
}
