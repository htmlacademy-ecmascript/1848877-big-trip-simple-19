import { render, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoEventsView from '../view/no-events-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #tripContainer = null;
  #waypointModel = null;
  #tripComponent = new TripListView();
  #tripPoints = [];
  #filterContainer = null;
  #sortComponent = new SortView();
  #noPointComponent = new NoEventsView();

  constructor({ tripContainer, waypointModel, filterContainer }) {
    this.#tripContainer = tripContainer;
    this.#waypointModel = waypointModel;
    this.#filterContainer = filterContainer;
  }

  init() {
    this.#tripPoints = [...this.#waypointModel.waypoints];

    this.#renderPointsList();
  }

  #renderNoPoint() {
    render(this.#noPointComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderSort() {
    render(this.#sortComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#tripComponent.element);

    pointPresenter.init(point);
  }

  #renderPointsList() {
    render(this.#tripComponent, this.#tripContainer);

    if (!this.#tripPoints.length) {
      this.#renderNoPoint();
    } else {
      this.#renderSort();

      for (let i = 0; i < this.#tripPoints.length; i++) {
        this.#renderPoint(this.#tripPoints[i]);
      }
    }
  }
}
