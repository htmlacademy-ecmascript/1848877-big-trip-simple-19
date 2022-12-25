import {render, replace} from '../framework/render.js';
import SortView from '../view/list-sort-view.js';
import PointEdit from '../view/point-edit-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import TripListView from '../view/trip-list-view.js';
import NoEventsView from '../view/no-events-view.js';

export default class TripPresenter {
  #tripContainer = null;
  #waypointModel = null;
  #tripComponent = new TripListView();
  #tripPoints = [];
  #filterContainer = null;

  constructor({ tripContainer, waypointModel, filterContainer}) {
    this.#tripContainer = tripContainer;
    this.#waypointModel = waypointModel;
    this.#filterContainer = filterContainer;
  }

  init() {
    this.#tripPoints = [...this.#waypointModel.waypoints];

    this.#renderPointsList();
  }

  #renderPointsList() {
    if (!this.#tripPoints.length) {
      render(new NoEventsView(), this.#tripContainer);
    } else {
      render(new SortView(), this.#tripContainer);
      render(this.#tripComponent, this.#tripContainer);

      for (let i = 0; i < this.#tripPoints.length; i++) {
        this.#renderPoint(this.#tripPoints[i]);
      }
    }
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoit.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new TripEventListView({
      point,
      onEditClick: () => {
        replacePointToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new PointEdit({
      point,
      onFormSubmit: () => {
        replaceFormToPoit.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormClose: () => {
        replaceFormToPoit.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoit() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#tripComponent.element);
  }
}
