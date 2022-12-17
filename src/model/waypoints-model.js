import {getRandomWaypoint} from '../mock/waypoints.js';

const WAYPOINT_COUNT = 10;

export default class WaypointsModel {
  #waypoints = Array.from({length: WAYPOINT_COUNT}, getRandomWaypoint);

  get waypoints() {
    return this.#waypoints;
  }
}
