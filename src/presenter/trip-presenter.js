import { render, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoEventsView from '../view/no-events-view.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/common.js';

export default class TripPresenter {
  #tripContainer = null;
  #waypointModel = null;
  #tripComponent = new TripListView();
  #tripPoints = [];
  #sortComponent = new SortView();
  #noPointComponent = new NoEventsView();
  #pointPresenter = new Map();
  #sourcedBoardPoints = [];

  constructor({ tripContainer, waypointModel}) {
    this.#tripContainer = tripContainer;
    this.#waypointModel = waypointModel;
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
    const pointPresenter = new PointPresenter({
      tripPointContainer: this.#tripComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handlePointChange});

    pointPresenter.init(point, point.offers, point.destination);
    this.#pointPresenter.set(point.uniqueId, pointPresenter);
  }

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
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

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint, offers, destination) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.uniqueId).init(updatedPoint, offers, destination);
  };
}
