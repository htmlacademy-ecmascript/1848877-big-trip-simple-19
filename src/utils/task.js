import dayjs from 'dayjs';

export const humanizeEventDate = (date) => dayjs(date).format('MMM DD');

export const humanizeEventTime = (date) => dayjs(date).format('HH:mm');

export const isFutureTask = (dateFrom, dateTo) => dayjs().isBefore(dayjs(dateFrom)) || dayjs().isSame(dayjs(dateFrom), 'day') || (dayjs().isAfter(dayjs(dateFrom)) && dayjs().isBefore(dayjs(dateTo)))


