import { render, replace, remove } from '../framework/render.js';
import PointEditView from '../view/point-edit-view.js';
import TripEventListView from '../view/trip-event-list-view.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #tripPointContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #offers = null;
  #destination = null;

  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  #handleDataChange = null;

  constructor({tripPointContainer, onModeChange, onDataChange}) {
    this.#tripPointContainer = tripPointContainer;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
  }

  init(point) {
    const {offers, destination} = point;
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
      onFormSubmit: this.#formSubmitHandler,
      onFormClose: this.#closeEventEditFormHandler,
      onDeleteClick: this.#deleteClickHandler,
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
      this.#pointEditComponent.reset(this.#point);
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
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoit();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #formSubmitHandler = (point, offers, destination) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
      offers,
      destination);
    this.#replaceFormToPoit();
  };

  #closeEventEditFormHandler = () => {
    this.#replaceFormToPoit();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #deleteClickHandler = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
