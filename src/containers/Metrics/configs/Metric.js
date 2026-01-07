import MetricConfigs from "./MetricConfigs";
import MetricChart from "./MetricChart";

let metrics = {};

class Metric {
  constructor(serviceKey, metricKey, metricLabel) {
    this._metricKey = metricKey;
    this._serviceKey = serviceKey;
    this._metricLabel = metricLabel;

    this._metricConfigs = null;
    this._metricCharts = [];
  }

  /**
   * @return {string}
   */
  key() {
    return this._metricKey;
  }

  /**
   * @return {string}
   */
  label() {
    return this._metricLabel;
  }

  /**
   * @return {string}
   */
  serviceKey() {
    return this._serviceKey;
  }

  /**
   * @return {MetricConfigs}
   */
  metricConfigs() {
    if (!this._metricConfigs) {
      this._metricConfigs = new MetricConfigs(this);
    }

    return this._metricConfigs;
  }

  setMetricConfigs(metricConfigs) {
    this._metricConfigs = metricConfigs;
    return this;
  }

  /**
   * @return {MetricChart[]}
   */
  charts() {
    return this._metricCharts;
  }

  /**
   * @param chartKey
   * @return {MetricChart}
   */
  getChartByChartKey(chartKey) {
    return this.charts().find((metricChart) => metricChart.key() === chartKey);
  }

  /**
   * @param {string} metricChartKey
   * @param {string} metricChartLabel
   * @return {MetricChart}
   */
  addChart(metricChartKey, metricChartLabel) {
    return new MetricChart(metricChartKey, metricChartLabel, this);
  }

  /**
   * @param {MetricChart} metricChartClass
   */
  addChartClass(metricChartClass) {
    if (metricChartClass instanceof MetricChart) {
      this._metricCharts.push(metricChartClass);
    } else {
      throw "pushChart props should be MetricChart";
    }
  }

  static root(serviceKey, metricKey, metricLabel) {
    const newMetric = new Metric(serviceKey, metricKey, metricLabel);
    metrics[metricKey] = newMetric;

    newMetric.setMetricConfigs(new MetricConfigs(newMetric));
    return newMetric;
  }

  static get() {
    return { ...metrics };
  }
}

export const metric = Metric.root;
export const getAllMetrics = Metric.get;
/**
 * @param metricKey
 * @return {Metric}
 */
export const getMetricByMetricKey = (metricKey) => Metric.get()[metricKey];
export const getMetricByMetricChartKey = (metricChartKey) => {
  /** @var {Metric[]} metric */
  const metrics = Object.values(Metric.get());
  return metrics.find((metric) => {
    return metric.charts().find((chart) => {
      return chart.key() === metricChartKey;
    });
  });
};
export const clear = () => (metrics = {});
