import AbstractView from '../framework/view/abstract-view.js';

const getFilterItemTemplate = (title, id) =>`
  <div class="trip-filters__filter">
    <input id="filter-${id}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
    <label class="trip-filters__filter-label" for="filter-${id}">${title}</label>
  </div>`;

function createFilterTemplate() {
  return (`
  <form class="trip-filters" action="#" method="get">
    ${getFilterItemTemplate('Everything', 'everything')}
    ${getFilterItemTemplate('Future', 'future')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  );
}

export default class FilterView extends AbstractView {
  get template() {
    return createFilterTemplate();
  }
}
