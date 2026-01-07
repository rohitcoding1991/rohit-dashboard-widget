/**
 * From Api
 * {
 *   "key": "agent_status",
 *   "type": "non-numeric",
 *   "description": "reports data about the status of an agent",
 *   "coordinate_labels": {
 *     "workspace_id": "workspace id",
 *     "user_id": "agent user id"
 *   },
 *   "coordinate_values": {
 *     "workspace_id": {
 *       "\"1\"": "workspace 1",
 *      "\"2\"": "workspace 2",
 *       "\"3\"": "workspace 3"
 *     },
 *     "user_id": {
 *       "\"1\"": "user1"
 *     }
 *   }
 * }
 */
export default class Metric {
  constructor(metricData, serviceKey = "") {
    this._key = metricData.key;
    this._type = metricData.type;
    this._description = metricData.description;
    this._coordinateValues = metricData.coordinate_values;
    this._coordinateLabels = metricData.coordinate_labels;
    this._serviceKey = serviceKey;
  }

  key() {
    return this._key;
  }

  type() {
    return this._type;
  }

  description() {
    return this._description;
  }

  coordinateValues() {
    return this._coordinateValues;
  }

  getCoordinateValuesByCoordinate(coordinate) {
    if (coordinate in this._coordinateValues) {
      return this._coordinateValues[coordinate];
    }

    throw `There is no ${coordinate} in coordinate values`;
  }

  coordinateLabels() {
    return this._coordinateLabels;
  }

  getCoordinateLabelByCoordinate(coordinate) {
    if (coordinate in this._coordinateLabels) {
      return this._coordinateLabels[coordinate];
    }

    throw `There is no ${coordinate} in coordinate labels`;
  }

  serviceKey() {
    return this._serviceKey;
  }
}
