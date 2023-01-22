import { render, RenderPosition, remove } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoEventsView from '../view/no-events-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortPointDate, sortPointPrice, calculatePrice } from '../utils/task.js';
import { filter } from '../utils/filters.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripPresenter {
  #tripContainer = null;
  #sortContainer = null;
  #apiModel = null;
  #filterModel = null;
  #loadingComponent = new LoadingView();
  #tripComponent = new TripListView();
  #noPointComponent = null;
  #newPointPresenter = null;
  #sortComponent = null;
  #currentSortType = SortType.DATE;
  #filterType = FilterType.ALL;
  #isLoading = true;
  #onNewPointDestroy = null;
  #pointPresenter = new Map();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ tripContainer, sortContainer, apiModel, filterModel, onNewPointDestroy }) {
    this.#apiModel = apiModel;
    this.#tripContainer = tripContainer;
    this.#sortContainer = sortContainer;
    this.#filterModel = filterModel;
    this.#onNewPointDestroy = onNewPointDestroy;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#tripComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onNewPointDestroy,
    });

    this.#apiModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#apiModel.points;
    const filteredTasks = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DATE:
        filteredTasks.sort(sortPointDate);
        break;
      case SortType.PRICE:
        filteredTasks.forEach((point) => {
          point.totalPrice = calculatePrice(point);
        });
        filteredTasks.sort(sortPointPrice);
        filteredTasks.forEach((point) => delete point.totalPrice);
        break;
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
      onDataChange: this.#handleViewAction,
      apiModel: this.#apiModel
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

    render(this.#sortComponent, this.#sortContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#loadingComponent);
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
      if (this.#isLoading) {
        this.#renderLoading();
      }
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#apiModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#apiModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#apiModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#tripComponent.element, RenderPosition.AFTERBEGIN);
  }

}
