import {render} from '../render.js';
import SortView from '../view/list-sort-view.js';
import AddNewPoint from '../view/new-point-create-view.js';
import PointEdit from '../view/point-edit-view.js';
import TripEventListView from '../view/trip-event-list-view.js';

const ROUTE_POINTS = 3;

export default class TripPresenter {
  tripComponent = new TripEventListView();

  constructor({tripContainer}) {
    this.tripContainer = tripContainer;
  }

  init() {
    render(this.tripComponent, this.tripContainer);
    render(new SortView(), this.tripComponent.getElement());

    render(new PointEdit(), this.tripComponent.getElement());
    for (let i = 0; i < ROUTE_POINTS; i++) {
      render(new AddNewPoint(), this.tripComponent.getElement());
    }
  }
}
