import {FilterType} from '../const.js';
import {isFutureTask} from '../utils/task.js';

export const filter = {
  [FilterType.ALL]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureTask(point.dateFrom, point.dateTo))
};

