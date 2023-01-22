import { render, RenderPosition, remove } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoEventsView from '../view/no-events-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortPointDate, sortPointPrice } from '../utils/task.js';
import { filter } from '../utils/filters.js';
import NewPointPresenter from './new-point-presenter.js';

export default class TripPresenter {
  #tripContainer = null;
  #waypointModel = null;
  #filterModel = null;

  #tripComponent = new TripListView();
  #noPointComponent = null;
  #newPointPresenter = null;
  #sortComponent = null;
  #currentSortType = SortType.DATE;
  #filterType = FilterType.ALL;
  #onNewPointDestroy = null;

  #pointPresenter = new Map();

  constructor({ tripContainer, waypointModel, filterModel, onNewPointDestroy }) {
    this.#tripContainer = tripContainer;
    this.#waypointModel = waypointModel;
    this.#filterModel = filterModel;
    this.#onNewPointDestroy = onNewPointDestroy;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#tripComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onNewPointDestroy,
    });

    this.#waypointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#waypointModel.waypoints;
    const filteredTasks = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredTasks.sort(sortPointDate);
      case SortType.PRICE:
        return filteredTasks.sort(sortPointPrice);
    }

    return filteredTasks;
  }

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DATE;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this.#newPointPresenter.init();
  }


  #renderNoPoint() {
    this.#noPointComponent = new NoEventsView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent,
      this.#tripComponent.element,
      RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      tripPointContainer: this.#tripComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.uniqueId, pointPresenter);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }
    if (resetSortType) {
      this.#currentSortType = SortType.DATE;
    }
  }

  #renderBoard() {
    const points = this.points;
    if (points.length === 0) {
      this.#renderNoPoint();
    } else {
      this.#renderSort();
      render(this.#tripComponent, this.#tripContainer);
      points.forEach((point) => {
        this.#renderPoint(point);
      });
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#waypointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#waypointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#waypointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetRenderedTaskCount: true, resetSortType: true });
        this.#renderBoard();
        break;
    }
  };

}
