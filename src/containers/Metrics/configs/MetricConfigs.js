export default class MetricConfigs {
  /**
   * @param {Metric} parent
   */
  constructor(parent) {
    this._parent = parent;
    this._allowedTimeframes = [];
    this._allowedAggregations = [];
  }

  /**
   * @param {[]} timeframes
   * @return {MetricConfigs}
   */
  setAllowedTimeframes(timeframes) {
    this._allowedTimeframes = timeframes;
    return this;
  }

  /**
   * @return {[]}
   */
  allowedTimeframes() {
    return this._allowedTimeframes;
  }

  /**
   * @param {[]} aggregations
   * @return {MetricConfigs}
   */
  setAllowedAggregations(aggregations) {
    this._allowedAggregations = aggregations;
    return this;
  }

  /**
   * @return {[]}
   */
  allowedAggregations() {
    return this._allowedAggregations;
  }

  /**
   * @return {Metric}
   */
  metricConfigsEnd() {
    this._parent.setMetricConfigs(this);

    return this._parent;
  }
}
