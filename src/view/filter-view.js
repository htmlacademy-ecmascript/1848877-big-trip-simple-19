import AbstractView from '../framework/view/abstract-view.js';

const getFilterItemTemplate = (filters) => filters.map((filter, index) =>
  `<div class="trip-filters__filter">
    <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}"
    ${index === 0 ? 'checked' : ''} ${filter.count > 0 ? '' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-${filter.name}">${filter.name}</label>
  </div>`
).join('');

function createFilterTemplate(filter) {
  return `
  <form class="trip-filters" action="#" method="get">
    ${getFilterItemTemplate(filter)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
}

export default class FilterView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
