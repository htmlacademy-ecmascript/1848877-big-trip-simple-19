import {render} from '../src/render';
import FilterView from '../src/view/list-filter-view.js';
import TripPresenter from '../src/presenter/trip-presenter.js';

const tripEventsElement = document.querySelector('.trip-events');
const headerFiltersElement = document.querySelector('.trip-controls__filters');
const tripPresenter = new TripPresenter({tripContainer: tripEventsElement});

render(new FilterView(), headerFiltersElement);

tripPresenter.init();
