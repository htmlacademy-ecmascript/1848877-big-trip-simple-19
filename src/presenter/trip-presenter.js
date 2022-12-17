import { render } from '../render.js';
import { getRandomArrayElement } from '../utils.js';
import SortView from '../view/list-sort-view.js';
import AddNewPoint from '../view/new-point-create-view.js';
import PointEdit from '../view/point-edit-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import TripListView from '../view/trip-list-view.js';

export default class TripPresenter {

  #tripContainer = null;
  #waypointModel = null;
  #tripComponent = new TripListView();
  #tripPoints = [];

  constructor({ tripContainer, waypointModel }) {
    this.#tripContainer = tripContainer;
    this.#waypointModel = waypointModel;
  }

  init() {
    this.#tripPoints = [...this.#waypointModel.waypoints];
    render(new SortView(), this.#tripComponent.element);
    render(this.#tripComponent, this.#tripContainer);
    const randAddNewPoint = getRandomArrayElement(this.#tripPoints);
    render(new PointEdit(getRandomArrayElement(this.#tripPoints)), this.#tripComponent.element);
    render(new AddNewPoint(randAddNewPoint), this.#tripComponent.element);
    for (let i = 0; i < this.#tripPoints.length; i++) {
      render(new TripEventListView({ point: this.#tripPoints[i] }), this.#tripComponent.element);
    }
  }
}
