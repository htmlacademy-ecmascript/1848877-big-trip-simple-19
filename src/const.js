export const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

export const FilterType = {
  ALL: 'everything',
  FUTURE: 'future'
};

export const SortType = {
  DATE: 'date',
  PRICE: 'price',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT_POINT: 'INIT_POINT',
  INIT_POINT_COMMON: 'INIT_POINT_COMMON',
  ERROR_LOADING: 'ERROR_LOADING'
};
