import {render} from './framework/render.js';
import FilterView from '../src/view/list-filter-view.js';
import TripPresenter from '../src/presenter/trip-presenter.js';
import WaypointsModel from '../src/model/waypoints-model.js';
import {generateFilter} from '../src/mock/filter.js';

const waypointModel = new WaypointsModel();

const tripEventsElement = document.querySelector('.trip-events');
const headerFiltersElement = document.querySelector('.trip-controls__filters');
const tripPresenter = new TripPresenter({tripContainer: tripEventsElement, waypointModel});
const filters = generateFilter(waypointModel.waypoints);

render(new FilterView({filters}), headerFiltersElement);

tripPresenter.init();
