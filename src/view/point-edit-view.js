import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { TYPES } from '../const.js';
import he from 'he';
import { capitalizeFirstLetter } from '../utils/task.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

export const BLANK_POINT = {
  basePrice: 1,
  destination: -1,
  offers: [],
  type: TYPES[0]
};

function getPicturesListTemplate(pointDestination) {
  let template = '';
  if (pointDestination) {
    template = pointDestination.pictures.map(
      (elem) => `<img class="event__photo" src=${he.encode(elem.src)} alt="${he.encode(elem.description)}">`
    ).join('');
  }
  return template;
}

function createEventTypeItemEditTemplate(offers, id, type) {
  const elementEditTypes = offers.map((elem) => {
    const checked = elem.type === type ? 'checked' : '';
    const eventType = capitalizeFirstLetter(elem.type);
    return `
    <div class="event__type-item">
      <input
        id="event-type-${he.encode(elem.type)}-${id}"
        class="event__type-input
        visually-hidden"
        type="radio"
        name="event-type"
        value="${he.encode(elem.type)}"
        ${checked}
      >
        <label
          class="event__type-label event__type-label--${he.encode(elem.type)}"
          for="event-type-${he.encode(elem.type)}-${id}"
        >
          ${he.encode(eventType)}
        </label>
    </div>`;
  }).join('');

  return elementEditTypes;
}

function createSectionOffersEditTemplate(offerTypes, offer, type) {
  let template = '';
  if (offerTypes) {
    template = offerTypes.offers.map((elem) => (
      `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox
          visually-hidden"
          id="event-offer-${he.encode(type)}-${elem.id}"
          type="checkbox"
          name=${he.encode(elem.title)}
          data-offer-id="${elem.id}" ${offer.includes(elem.id) ? 'checked' : ''}
        >
          <label class="event__offer-label" for="event-offer-${he.encode(type)}-${elem.id}">
            <span class="event__offer-title">${he.encode(elem.title)}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${he.encode(String(elem.price))}</span>
          </label>
      </div>`
    )).join('');
  }
  return template;
}


function createPointEditTemplate(tripPoint, pointCommon) {
  const isNewPoint = !('id' in tripPoint);
  const { offers, type, dateFrom, dateTo, destination, basePrice, id, isDisabled, isSaving, isDeleting } = tripPoint;

  const chooseDestination = pointCommon.allDestinations.map((element) => `<option value="${he.encode(element.name)}">`).join('');
  const parceDateStart = dayjs(he.encode(String(dateFrom)));
  const parceDateEnd = dayjs(he.encode(String(dateTo)));
  const pointDestination = pointCommon.allDestinations.find((item) => destination === item.id);
  const pointTypeOffer = pointCommon.allOffers.find((offer) => offer.type === type);

  return (`
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${he.encode(String(id))}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${he.encode(String(id))}" type="checkbox" ${isDisabled ? 'disabled' : ''}>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeItemEditTemplate(pointCommon.allOffers, id, type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${he.encode(String(id))}">
        ${he.encode(type)}
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-${he.encode(String(id))}"
          type="text"
          name="event-destination"
          required
           value="${he.encode(pointDestination ? pointDestination.name : '')}"
          list="destination-list-${he.encode(String(id))}"
          ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-${he.encode(String(id))}">
          ${chooseDestination}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${he.encode(String(id))}">From</label>
        <input class="event__input  event__input--time event-start-time" data-start-time id="event-start-time-${he.encode(String(id))}" type="text" name="event-start-time" value='${parceDateStart.format(DATE_FORMAT)}' ${isDisabled ? 'disabled' : ''}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-${he.encode(String(id))}">To</label>
        <input class="event__input  event__input--time event-end-time" data-end-time id="event-end-time-${he.encode(String(id))}" type="text" name="event-end-time" value='${parceDateEnd.format(DATE_FORMAT)}' ${isDisabled ? 'disabled' : ''}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${he.encode(String(id))}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${he.encode(String(id))}" type="text" name="event-price" value="${he.encode(String(basePrice)) !== null ? he.encode(String(basePrice)) : ''}" ${isDisabled ? 'disabled' : ''}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      ${isNewPoint ? `
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>
      ` : `
      <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
        ${isDeleting ? 'Deleting...' : 'Delete'}
      </button>
      <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
        <span class="visually-hidden">Open event</span>
      </button>
      `}
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
       ${!pointTypeOffer || !pointTypeOffer.offers || pointTypeOffer.offers.length === 0
      ? ''
      : '<h3 class="event__section-title  event__section-title--offers">Offers</h3>'}
        <div class="event__available-offers">
        ${createSectionOffersEditTemplate(pointTypeOffer, offers, type)}
        </div>
      </section>

      <section class="event__section  event__section--destination">
       ${pointDestination ? '<h3 class="event__section-title  event__section-title--destination">Destination</h3>'
      : '' }
        <p class="event__destination-description">${he.encode(pointDestination ? pointDestination.description : '')}</p>
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
  #handleFormSubmit = null;
  #handleFormClose = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #handleDeleteClick = null;
  #pointCommon = null;

  constructor({ point = {
    ...BLANK_POINT,
    dateFrom: new Date(),
    dateTo: new Date(),
  }, onFormSubmit, onFormClose, onDeleteClick, pointCommon}) {
    super();
    this._setState(PointEditView.parsePointToState(point));
    this.#pointCommon = pointCommon;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#pointCommon);
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    const rollupButtonElement = this.element.querySelector('.event__rollup-btn');
    if (rollupButtonElement) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#formCloseHandler);
    }
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);
    if (this.#pointCommon.allOffers.find((offerTypes) => offerTypes.type === this._state.type).offers)
    {
      this.element.querySelector('.event__available-offers')
        .addEventListener('change', this.#offerChangeHandler);
    }
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
    if (evt.target.value === '') { inputPrice = 1; }
    inputPrice = isNaN(inputPrice) ? this._state.basePrice : inputPrice;
    this._state.basePrice = inputPrice;
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
    const pointDestination = this.#pointCommon.allDestinations.find((item) => evt.target.value === item.name);
    const destId = pointDestination === undefined ? -1 : pointDestination.id;
    this.updateElement({
      destination: destId,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
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
        // eslint-disable-next-line camelcase
        time_24hr: true
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
        // eslint-disable-next-line camelcase
        time_24hr: true
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
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
