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
  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #pointCommon = null;
  #handleDataChange = null;

  constructor({tripPointContainer, pointCommon, onModeChange, onDataChange}) {
    this.#tripPointContainer = tripPointContainer;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
    this.#pointCommon = pointCommon;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new TripEventListView({
      point: this.#point,
      onEditClick: this.#handleEditClick,
      pointCommon: this.#pointCommon,
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      onFormSubmit: this.#formSubmitHandler,
      onFormClose: this.#closeEventEditFormHandler,
      onDeleteClick: this.#deleteClickHandler,
      pointCommon: this.#pointCommon,
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
      this.#mode = Mode.DEFAULT;
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

  #formSubmitHandler = (update) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update,
    );
  };

  #closeEventEditFormHandler = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoit();
  };

  #deleteClickHandler = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  setSaving() {
    if (this.#mode === Mode.EDITING)
    {this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });}
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }
}
