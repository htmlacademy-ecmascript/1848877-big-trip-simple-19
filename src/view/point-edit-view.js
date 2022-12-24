import dayjs from 'dayjs';
import {destinations} from '../mock/waypoints.js';
import AbstractView from '../framework/view/abstract-view.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

function createEventTypeItemEditTemplate(offers) {
  const elementEditTypes = offers.map((elem) => `
  <div class="event__type-item">
    <input id="event-type-${elem.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${elem.type}">
      <label class="event__type-label  event__type-label--${elem.type}" for="event-type-${elem.type}-1">${elem.type}</label>
  </div>`).join('');

  return elementEditTypes;
}

function createSectionOffersEditTemplate(type, offers) {
  const elementEditOffers = offers.map((elem) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name=${elem.title} ${offers.includes(elem.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${type}-1">
        <span class="event__offer-title">${elem.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${elem.price}</span>
      </label>
  </div>`).join('');

  return elementEditOffers;
}

const chooseDestination = destinations.map((element) => `<option value="${element.name}"></option>`).join('');

function createPointEditTemplate(tripPoint) {
  const {offers, type, dateFrom, dateTo, destination, basePrice} = tripPoint;

  const parceDateStart = dayjs(dateFrom);
  const parceDateEnd = dayjs(dateTo);
  const pointDestination = destinations.find((item) => destination === item.id);

  return (`
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeItemEditTemplate(offers)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value='${pointDestination.name}' list="destination-list-1">
        <datalist id="destination-list-1">
          ${chooseDestination}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value='${parceDateStart.format(DATE_FORMAT)}'>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value='${parceDateEnd.format(DATE_FORMAT)}'>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${createSectionOffersEditTemplate(type, offers)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${pointDestination.description}</p>
      </section>
    </section>
  </form>
</li>`
  );
}

export default class PointEdit extends AbstractView {
  #tripPoint = null;

  constructor(tripPoint) {
    super();
    this.#tripPoint = tripPoint;
  }

  get template() {
    return createPointEditTemplate(this.#tripPoint);
  }
}
