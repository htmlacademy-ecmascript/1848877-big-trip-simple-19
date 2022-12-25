import dayjs from 'dayjs';
import { destinations } from '../mock/waypoints.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTripEventListTemplate(tripPoint) {
  const {offers, type, dateFrom, dateTo, destination, basePrice} = tripPoint;

  const DATE_FORMAT_DATE = 'DD MMM';
  const DATE_FORMAT_TIME = 'HH:mm';
  const pointDestination = destinations.find((item) => destination === item.id);
  const checkedOffers = offers.map((element) => element.id);

  const offersTemplate = () => {
    if (!checkedOffers.length) {
      return `<li class="event__offer">
    <span class="event__offer-title">No additional offers</span>
    </li>`;
    } else {
      const template = offers.map((offer) => `
      <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`).join('');

      return template;
    }
  };

  const parceDateStart = dayjs(dateFrom);
  const parceDateEnd = dayjs(dateTo);

  return (`
  <ul class="trip-events__list">
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${parceDateStart.format(DATE_FORMAT_DATE)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${pointDestination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${parceDateStart.format(DATE_FORMAT_TIME)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateFrom}">${parceDateEnd.format(DATE_FORMAT_TIME)}</time>
          </p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate()}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  </ul>`
  );
}

export default class TripEventListView extends AbstractView {
  #tripPoint = null;
  #handleEditClick = null;

  constructor(tripPoint) {
    const {point, onEditClick} = tripPoint;
    super();
    this.#tripPoint = point;
    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createTripEventListTemplate(this.#tripPoint);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
