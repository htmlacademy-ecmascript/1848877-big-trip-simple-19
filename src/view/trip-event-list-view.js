import AbstractView from '../framework/view/abstract-view.js';
import { humanizeEventDate, humanizeEventTime, calculatePrice} from '../utils/task.js';

function createTripEventListTemplate(tripPoint, apiModel) {
  const {offerTypes, destinations} = apiModel;
  const {offers, type, dateFrom, dateTo, destination, basePrice} = tripPoint;

  let totalPrice = 0;
  try {
    totalPrice = calculatePrice({type, offers, basePrice, offerTypes});
  } catch (err) {
    console.error('error', err);
  }
  const pointDestination = destinations.find((item) => destination === item.id);
  const checkedOffers = offers.map((element) => element.id);

  const offersTemplate = () => {
    if (!checkedOffers.length) {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">No additional offers</span>
        </li>`
      );
    } else {
      const template = offers.map((elem) => {
        const targetOfferType = (offerTypes || [])
          .find((offerType) => offerType.type === type);
        const targetOffer = targetOfferType
          ? targetOfferType.offers.find((offer) => offer.id === elem)
          : null;
        return (`
          <li class="event__offer">
            <span class="event__offer-title">${targetOffer ? targetOffer.title : '-'}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${targetOffer ? targetOffer.price : '-'}</span>
          </li>`
        );
      }).join('');

      return template;
    }
  };

  return (`
    <ul class="trip-events__list">
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${dateFrom}">${humanizeEventDate(dateFrom)}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${type} ${pointDestination ? pointDestination.name : ''}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${dateFrom}">${humanizeEventTime(dateFrom)}</time>
              &mdash;
              <time class="event__end-time" datetime="${dateTo}">${humanizeEventTime(dateTo)}</time>
            </p>
          </div>
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${totalPrice}</span>
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
  #offers = null;
  #destination = null;
  #apiModel = null;

  constructor({point, onEditClick, offers, destination, apiModel}) {
    super();
    this.#apiModel = apiModel;
    this.#tripPoint = point;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#destination = (apiModel.destinations || []).find((item) => destination === item.id);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createTripEventListTemplate(this.#tripPoint, this.#apiModel);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick(this.#tripPoint, this.#offers, this.#destination);
  };
}
