import { render } from '../render.js';
import { getRandomArrayElement } from '../utils.js';
import SortView from '../view/list-sort-view.js';
import AddNewPoint from '../view/new-point-create-view.js';
import PointEdit from '../view/point-edit-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import TripListView from '../view/trip-list-view.js';
import NoEventsView from '../view/no-events-view.js';

export default class TripPresenter {
  #tripContainer = null;
  #waypointModel = null;
  #tripComponent = new TripListView();
  #tripPoints = [];

  constructor({ tripContainer, waypointModel }) {
    this.#tripContainer = tripContainer;
    this.#waypointModel = waypointModel;
  }

  init() {
    this.#tripPoints = [...this.#waypointModel.waypoints];
    if (!this.#tripPoints.length) {
      render(new NoEventsView(), this.#tripContainer);
    } else {
      render(new SortView(), this.#tripContainer);
      render(this.#tripComponent, this.#tripContainer);
      const randAddNewPoint = getRandomArrayElement(this.#tripPoints);
      render(new AddNewPoint(randAddNewPoint), this.#tripComponent.element);
      for (let i = 0; i < this.#tripPoints.length; i++) {
        this.#renderPoint(this.#tripPoints[i]);
      }
    }
  }

  #renderPoint(point) {
    const pointComponent = new TripEventListView({point});
    const pointEditComponent = new PointEdit({point});

    const replacePointToForm = () => {
      this.#tripComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replaceFormToPoit = () => {
      this.#tripComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoit();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoit();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToPoit();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render (pointComponent, this.#tripComponent.element);
  }
}
