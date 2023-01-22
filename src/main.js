import TripPresenter from '../src/presenter/trip-presenter.js';
import ApiModel from '../src/model/api-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic err883jdzbdw';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple/';

const apiModel = new ApiModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();
const tripEventsContentElement = document.querySelector('.trip-events__content');
const tripEventsSortElement = document.querySelector('.trip-events__sort');
const headerFiltersElement = document.querySelector('.trip-controls__filters');
const siteHeaderElement = document.querySelector('.main__control');

const tripPresenter = new TripPresenter({
  tripContainer: tripEventsContentElement,
  sortContainer: tripEventsSortElement,
  apiModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: headerFiltersElement,
  filterModel,
  apiModel
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

render(newTaskButtonComponent, siteHeaderElement);

filterPresenter.init();
tripPresenter.init();
apiModel.init()
  .finally(() => {
    render(newTaskButtonComponent, siteHeaderElement);
  });
