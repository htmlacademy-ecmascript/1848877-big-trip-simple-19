import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoPointsTextType = {
  [FilterType.ALL]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
};

function createNoEventsTemplate(filterType) {
  const noTaskTextValue = NoPointsTextType[filterType];

  return (`<p class="trip-events__msg">
  ${noTaskTextValue}
  </p>`
  );
}

export default class NoEventsView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoEventsTemplate(this.#filterType);
  }
}
