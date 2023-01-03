import { render, replace } from '../framework/render.js';
import PointEdit from '../view/point-edit-view.js';
import TripEventListView from '../view/trip-event-list-view.js';

export default class PointPresenter {
  #tripPointContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;

  constructor(tripPointContainer) {
    this.#tripPointContainer = tripPointContainer;
  }

  init(point) {
    this.#point = point;

    this.#pointComponent = new TripEventListView({
      point: this.#point,
      onEditClick: this.#handleEditClick
    });

    this.#pointEditComponent = new PointEdit({
      point: this.#point,
      onFormSubmit: this.#handleFormSubmit,
      onFormClose: this.#handleFormSubmit
    });

    render(this.#pointComponent, this.#tripPointContainer);
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToPoit() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoit.call(this);
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoit();
  };

}
