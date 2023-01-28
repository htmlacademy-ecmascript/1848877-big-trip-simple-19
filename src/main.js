import TripPresenter from '../src/presenter/trip-presenter.js';
import ApiModel from '../src/model/api-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonView from './view/new-point-button-view.js';
import { render } from './framework/render.js';
import PointsApiService from './points-api-service.js';
import PointCommonModel from './model/point-common-model.js';
import PointCommonApiService from './point-common-api-service.js';

const AUTHORIZATION = 'Basic err883jdzbdmm';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';

const apiModel = new ApiModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const pointCommonModel = new PointCommonModel({
  pointCommonApiService: new PointCommonApiService(END_POINT, AUTHORIZATION)
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
  pointCommonModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: headerFiltersElement,
  filterModel,
  apiModel
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

filterPresenter.init();
tripPresenter.init();
Promise.all([
  apiModel.init(),
  pointCommonModel.init()])
  .then(() => {
    render(newPointButtonComponent, siteHeaderElement);
  });
