import { getMetricByMetricKey } from "../Metrics/configs/Metric";
import { uuidv4 as v4 } from "../../utils/uuid";

export default class UIConfiguration {
  constructor(props = null) {
    this._uuid = v4();
    this._coordinates = {};
    this._metricKey = "";
    this._metricChart = "";
    this._metricChartType = "";
    this._chartConfigs = {};

    if (props) {
      if ("uuid" in props) {
        this._uuid = props.uuid;
      }
      this._coordinates = props.coordinates;
      this._metricKey = props.metric_key;
      this._metricChart = props.metric_chart;
      this._metricChartType = props.metric_chart_type;
      this._chartConfigs = props.chart_configs;
    }
  }

  /**
   * @return {string}
   */
  uuid() {
    return this._uuid;
  }

  /**
   * @return {{w: number, h: number, x: number, y: number}}
   */
  coordinates() {
    return this._coordinates;
  }

  updateCoordinates(newCoordinates) {
    this._coordinates = newCoordinates;
  }

  /**
   * @return {string|*}
   */
  metricKey() {
    return this._metricKey;
  }

  metric() {
    return getMetricByMetricKey(this.metricKey());
  }

  /**
   * @return {string|*}
   */
  metricChartKey() {
    return this._metricChart;
  }

  /**
   * @return {MetricChart}
   */
  metricChart() {
    return this.metric()?.getChartByChartKey(this.metricChartKey());
  }

  /**
   * @return {string}
   */
  metricChartComponentKey() {
    return this._metricChartType;
  }

  /**
   * @return {MetricChartComponent}
   */
  metricChartComponent() {
    return this.metricChart()?.getMetricChartComponentByKey(
      this.metricChartComponentKey()
    );
  }

  /**
   * @return {object}
   */
  userConfigs() {
    return this._chartConfigs;
  }

  getUserConfig(config) {
    if (this._chartConfigs && config in this._chartConfigs) {
      return this._chartConfigs[config];
    }

    return this.metricChartComponent()
      .componentUserSettings()
      .defaultValueByFieldName(config);
  }

  toObject() {
    return {
      uuid: this._uuid,
      coordinates: this._coordinates,
      metric_key: this._metricKey,
      metric_chart: this._metricChart,
      metric_chart_type: this._metricChartType,
      chart_configs: this._chartConfigs
    };
  }
}
