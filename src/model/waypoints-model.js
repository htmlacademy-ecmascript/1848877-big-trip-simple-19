import {getRandomWaypoint} from '../mock/waypoints.js';
import Observable from '../framework/observable.js';

const WAYPOINT_COUNT = 3;

export default class WaypointsModel extends Observable {
  #waypoints = Array.from({length: WAYPOINT_COUNT}, getRandomWaypoint);

  get waypoints() {
    return this.#waypoints;
  }

  updatePoint(updateType, update) {
    const index = this.#waypoints.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      update,
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#waypoints = [
      update,
      ...this.#waypoints,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#waypoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
