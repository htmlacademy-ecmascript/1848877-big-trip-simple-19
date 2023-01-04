import { render, replace, remove } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import TripEventListView from '../view/trip-event-list-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #tripPointContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;
  #handleModeChange = null;
  #point = null;
  #mode = Mode.DEFAULT;
  #offers = null;
  #destination = null;
  #handleDataChange = null;

  constructor({tripPointContainer, onModeChange, onDataChange}) {
    this.#tripPointContainer = tripPointContainer;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
  }

  init(point, offers, destination) {
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new TripEventListView({
      point: this.#point,
      offers: this.#offers,
      destination: this.#destination,
      onEditClick: this.#handleEditClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      offers: this.#offers,
      destination: this.#destination,
      onFormSubmit: this.#handleFormSubmit,
      onFormClose: this.#handleFormSubmit,
    });


    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#tripPointContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) { {
      replace(this.#pointComponent, prevPointComponent);
    } }

    if (this.#mode === Mode.EDITING) { {
      replace(this.#pointEditComponent, prevPointEditComponent);
    } }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoit();
    }
  }

  #replacePointToForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoit() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoit();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = (point, offers, destination) => {
    this.#handleDataChange(point, offers, destination);
    this.#replaceFormToPoit();
  };

}
