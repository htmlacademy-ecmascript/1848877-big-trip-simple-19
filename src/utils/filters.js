import {FilterType} from '../const.js';
import {isPointSame, isPointAfter, isPointBefore} from '../utils/task.js';

export const filter = {
  [FilterType.ALL]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointSame(point.dateFrom) && isPointBefore(point.dateFrom) || (isPointAfter(point.dateFrom) && isPointBefore(point.dateTo)))
};
