import dayjs from 'dayjs';

const DATE_FORMAT = 'DD/MM/YY HH:mm';

export const humanizePointDueDate = (dueDate) => dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';

export const isPointBeforeOrSame = (dueDate) => dueDate && dayjs().isSameOrBefore(dueDate, 'D');

export const isPointSame = (dueDate) => dueDate && dayjs().isSame(dueDate, 'D');

export const isPointAfter = (dueDate) => dueDate && dayjs().isAfter(dueDate, 'D');

export const isPointBefore = (dueDate) => dueDate && dayjs().isBefore(dueDate, 'D');

