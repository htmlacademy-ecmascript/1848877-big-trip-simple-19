import AbstractView from '../framework/view/abstract-view.js';
import { humanizeEventDate, humanizeEventTime } from '../utils/task.js';
import he from 'he';

function createTripEventListTemplate(tripPoint, pointCommon) {
  const { offers, type, dateFrom, dateTo, destination, basePrice } = tripPoint;

  const pointDestination = pointCommon.allDestinations.find((item) => destination === item.id);

  const offersTemplate = () => {
    let template = `<li class="event__offer">
    <span class="event__offer-title">
    No additional offers</span>
  </li>`;
    if (offers.length) {
      template = offers.map((elem) => {
        const offerTypes = pointCommon.allOffers.find((offerType) => offerType.type === type);
        const selectedOffer = offerTypes.offers.find((offer) => offer.id === elem);

        return (`
          <li class="event__offer">
            <span class="event__offer-title">${he.encode(selectedOffer.title)}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${he.encode(String(selectedOffer.price))}</span>
          </li>`
        );}).join('');
    }

    return template;

  };

  return (`
    <ul class="trip-events__list">
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${he.encode(String(dateFrom))}">${humanizeEventDate(he.encode(String(dateFrom)))}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${he.encode(type)} ${he.encode(pointDestination ? pointDestination.name : '')}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${he.encode(String(dateFrom))}">${humanizeEventTime(he.encode(String(dateFrom)))}</time>
              &mdash;
              <time class="event__end-time" datetime="${he.encode(String(dateTo))}">${humanizeEventTime(he.encode(String(dateTo)))}</time>
            </p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${he.encode(String(basePrice))}</span>
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
    </ul>
  `
  );
}

export default class TripEventListView extends AbstractView {
  #tripPoint = null;
  #handleEditClick = null;
  #pointCommon = null;

  constructor({ point, onEditClick, pointCommon }) {
    super();
    this.#pointCommon = pointCommon;
    this.#tripPoint = point;
    this.#handleEditClick = onEditClick;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createTripEventListTemplate(this.#tripPoint, this.#pointCommon);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
