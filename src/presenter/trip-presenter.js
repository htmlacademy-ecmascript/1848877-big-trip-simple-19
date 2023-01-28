import { render, RenderPosition, remove } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import NoEventsView from '../view/no-events-view.js';
import PointPresenter from './point-presenter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortPointDate, sortPointPrice} from '../utils/task.js';
import { filter } from '../utils/filters.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ErrorLoadingView from '../view/error-loading-view.js';

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
  #onNewPointDestroy = null;
  #isErrorLoading = false;
  #pointPresenter = new Map();
  #ErrorLoadingView = new ErrorLoadingView();
  #isPointLoading = true;
  #isPointCommonLoading = true;
  #pointCommonModel = null;
  #pointCommon = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ tripContainer, sortContainer, apiModel, pointCommonModel, filterModel, onNewPointDestroy }) {
    this.#apiModel = apiModel;
    this.#tripContainer = tripContainer;
    this.#sortContainer = sortContainer;
    this.#filterModel = filterModel;
    this.#onNewPointDestroy = onNewPointDestroy;
    this.#pointCommonModel = pointCommonModel;
    this.#pointCommon = this.#pointCommonModel.pointCommon;

    this.#apiModel.addObserver(this.#handleModelEvent);
    this.#pointCommonModel.addObserver(this.#handleModelEvent);
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
        filteredTasks.sort(sortPointPrice);
        break;
    }

    return filteredTasks;
  }

  init() {
    this.#clearBoard();
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DATE;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this.#newPointPresenter.init();
  }

  #createNewPointPresenter () {
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#tripComponent.element,
      pointCommon: this.#pointCommon,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onNewPointDestroy,
    });
  }

  #renderNoPoint() {
    this.#noPointComponent = new NoEventsView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent,
      this.#tripComponent.element,
      RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

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
      case UpdateType.INIT_POINT:
        this.#isPointLoading = false;
        break;
      case UpdateType.INIT_POINT_COMMON:
        this.#pointCommon = this.#pointCommonModel.pointCommon;
        this.#isPointCommonLoading = false;
        break;
      case UpdateType.ERROR_LOADING:
        this.#isErrorLoading = true;
        remove(this.#loadingComponent);
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
    if ((updateType === UpdateType.INIT_POINT ||
      updateType === UpdateType.INIT_POINT_COMMON) &&
      (!this.#isPointLoading && !this.#isPointCommonLoading)) {
      this.#createNewPointPresenter();
      remove(this.#loadingComponent);
      this.#clearBoard();
      this.#renderBoard();
    }
  };

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

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#tripContainer);
  }

  #renderErrorLoading() {
    render(this.#ErrorLoadingView, this.#tripContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      tripPointContainer: this.#tripComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction,
      pointCommon: this.#pointCommon,
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #clearBoard({ resetSortType = false } = {}) {
    if(this.#newPointPresenter){
      this.#newPointPresenter.destroy();
    }
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
    if (this.#isErrorLoading) {
      this.#renderErrorLoading();
    }
    if ((this.#isPointLoading || this.#isPointCommonLoading) && !this.#isErrorLoading) {
      this.#renderLoading();
    }
    const points = this.points;
    const pointsCount = this.points.length;
    if (pointsCount === 0 && !this.#isPointLoading) {
      this.#renderNoPoint();
    }
    this.#renderSort();
    render(this.#tripComponent, this.#tripContainer);
    this.#renderPoints(points);
  }
}
