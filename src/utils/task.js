import dayjs from 'dayjs';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

export function humanizePointDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

export function isPointBeforeOrSame(dueDate) {
  return dueDate && dayjs().isSameOrBefore(dueDate, 'D');
}

export function isPointSame(dueDate) {
  return dueDate && dayjs().isSame(dueDate, 'D');
}

export function isPointAfter(dueDate) {
  return dueDate && dayjs().isAfter(dueDate, 'D');
}

export function isPointBefore(dueDate) {
  return dueDate && dayjs().isBefore(dueDate, 'D');
}

