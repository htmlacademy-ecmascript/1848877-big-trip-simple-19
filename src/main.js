import TripPresenter from '../src/presenter/trip-presenter.js';
import WaypointsModel from '../src/model/waypoints-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';

const waypointModel = new WaypointsModel();
const filterModel = new FilterModel();
const tripEventsElement = document.querySelector('.trip-events');
const headerFiltersElement = document.querySelector('.trip-controls__filters');

const tripPresenter = new TripPresenter({
  tripContainer: tripEventsElement,
  waypointModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose});

const filterPresenter = new FilterPresenter({
  filterContainer: headerFiltersElement,
  filterModel,
  pointsModel: waypointModel
});

const newTaskButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newTaskButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newTaskButtonComponent.element.disabled = true;
}

filterPresenter.init();
tripPresenter.init();
