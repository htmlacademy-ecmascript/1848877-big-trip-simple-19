import dayjs from 'dayjs';
import { destinations, offersType } from '../mock/waypoints.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

//import { TYPES } from '../const.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';
/*const BLANK_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: 1,
  id:0,
  offers: [],
  type: TYPES[0]
};*/

function getPicturesListTemplate(picture) {
  let template = '';
  if (picture) {
    template = picture.pictures.map((elem) => `<img class="event__photo" src=${elem.src} alt="${elem.description}">`
    ).join('');
  }
  return template;
}

function createEventTypeItemEditTemplate(offers) {
  const elementEditTypes = offers.map((elem) => `
  <div class="event__type-item">
    <input id="event-type-${elem.type}-${elem.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${elem.type}">
      <label class="event__type-label  event__type-label--${elem.type}" for="event-type-${elem.type}-${elem.id}">${elem.type}</label>
  </div>`).join('');

  return elementEditTypes;
}

function createSectionOffersEditTemplate(offers, offer) {
  let template = '';
  if (offers) {
    template = offers.offers.map((elem) => (
      `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${elem.type}-${elem.id}" type="checkbox" name=${elem.title} data-offer-id="${elem.id}" ${offer.includes(elem.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${elem.type}-${elem.id}">
        <span class="event__offer-title">${elem.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${elem.price}</span>
      </label>
  </div>`)).join('');
  }
  return template;
}

const chooseDestination = destinations.map((element) => `<option value="${element.name}"></option>`).join('');

function createPointEditTemplate(tripPoint) {
  const { offers, type, dateFrom, dateTo, destination, basePrice, id } = tripPoint;

  const parceDateStart = dayjs(dateFrom);
  const parceDateEnd = dayjs(dateTo);
  const pointDestination = destinations.find((item) => destination === item.id);
  const pointTypeOffer = offersType.find((offer) => offer.type === type);

  return (`
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeItemEditTemplate(offersType)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${id}">
        ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value='${pointDestination ? pointDestination.name : ''}' list="destination-list-${id}">
        <datalist id="destination-list-${id}">
          ${chooseDestination}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time event-start-time" data-start-time id="event-start-time-${id}" type="text" name="event-start-time" value='${parceDateStart.format(DATE_FORMAT)}'>
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time event-end-time" data-end-time id="event-end-time-${id}" type="text" name="event-end-time" value='${parceDateEnd.format(DATE_FORMAT)}'>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice !== null ? basePrice : ''}">
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
        ${createSectionOffersEditTemplate(pointTypeOffer, offers)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${pointDestination ? pointDestination.description : ''}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${getPicturesListTemplate(pointDestination)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`
  );
}

export default class PointEditView extends AbstractStatefulView {
  //#tripPoint = null;
  #handleFormSubmit = null;
  #handleFormClose = null;
  #offers = null;
  #destination = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #handleDeleteClick = null;

  constructor(tripPoint) {
    const { point, onFormSubmit, onFormClose, offers, destination, onDeleteClick } = tripPoint;
    super();
    this._setState(PointEditView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;
    this.#offers = offers;
    this.#destination = destinations.find((item) => destination === item.id);
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formCloseHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.#setDatepicker();
  }

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    let offers = this._state.offers;
    const offerId = parseInt(evt.target.dataset.offerId, 10);
    if (evt.target.checked) {
      offers.push(offerId);
      offers.sort();
    } else {
      offers = this._state.offers.filter((elem) => elem !== offerId);
    }
    this.updateElement({
      offers
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    const regex = /[0-9]/;
    let inputPrice;
    if (regex.test(evt.target.value)) {
      inputPrice = evt.target.value;
    }
    if (evt.target.value === '') { evt.target.value = '0'; }
    evt.target.value = isNaN(inputPrice) ? this._state.basePrice : inputPrice;
    this._state.basePrice = evt.target.value;
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const offers = this._state.type === evt.target.value ? this._state.offers : [];
    this.updateElement({
      type: evt.target.value,
      offers,
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const pointDestination = this._state.destination.find((dest) => dest.name === evt.target.value);
    const destId = pointDestination === undefined ? 1 : pointDestination.id;
    this.updateElement({
      destId
    });

  };


  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state), this.#offers, this.#destination);
  };

  #formCloseHandler = () => {
    this.#handleFormClose();
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepicker() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('.event-start-time'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
    this.#datepickerTo = flatpickr(
      this.element.querySelector('.event-end-time'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };


  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point),
    );
  }

  static parsePointToState(point) {
    return {
      ...point
    };
  }

  static parseStateToPoint(state) {
    return {
      ...state
    };
  }
}
