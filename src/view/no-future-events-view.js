import AbstractView from '../framework/view/abstract-view.js';

function createNoFutureEventsTemplate() {
  return '<p class="trip-events__msg">There are no future events now</p>';
}

export default class NoFutureEventsView extends AbstractView {
  get template() {
    return createNoFutureEventsTemplate();
  }
}
