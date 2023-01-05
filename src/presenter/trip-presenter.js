import { render, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoEventsView from '../view/no-events-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sortPointDate, sortPointPrice } from '../utils/task.js';

export default class TripPresenter {
  #tripContainer = null;
  #waypointModel = null;

  #tripComponent = new TripListView();
  #tripPoints = [];
  #noPointComponent = new NoEventsView();

  #sortComponent = null;
  #currentSortType = SortType.DATE;

  #pointPresenter = new Map();
  #sourcedPoints = [];


  constructor({ tripContainer, waypointModel }) {
    this.#tripContainer = tripContainer;
    this.#waypointModel = waypointModel;
  }

  init() {
    this.#tripPoints = [...this.#waypointModel.waypoints].sort(sortPointDate);

    this.#sourcedPoints = [...this.#waypointModel.waypoints].sort(sortPointDate);

    this.#renderPointsList();
  }

  #renderNoPoint() {
    render(this.#noPointComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      tripPointContainer: this.#tripComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handlePointChange
    });

    pointPresenter.init(point, point.offers, point.destination);
    this.#pointPresenter.set(point.uniqueId, pointPresenter);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointsList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderPointsList() {
    if (!this.#tripPoints.length) {
      this.#renderNoPoint();
    } else {
      this.#renderSort();
      render(this.#tripComponent, this.#tripContainer);

      for (let i = 0; i < this.#tripPoints.length; i++) {
        this.#renderPoint(this.#tripPoints[i]);
      }
    }
  }

  #handlePointChange = (updatedPoint, offers, destination) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.uniqueId).init(updatedPoint, offers, destination);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this.#tripPoints.sort(sortPointDate);
        break;
      case SortType.PRICE:
        this.#tripPoints.sort(sortPointPrice);
        break;
      default:
        this.#tripPoints = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }
}
