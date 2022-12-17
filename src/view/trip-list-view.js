import {createElement} from '../render.js';

function createTripListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class TripListView {

  get template() {
    return createTripListTemplate();
  }

  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
