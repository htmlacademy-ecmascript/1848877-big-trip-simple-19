import dayjs from 'dayjs';
import {offersType} from '../mock/waypoints.js';

export const humanizeEventDate = (date) => dayjs(date).format('MMM DD');

export const humanizeEventTime = (date) => dayjs(date).format('HH:mm');

export const isFutureTask = (dateFrom, dateTo) => dayjs().isBefore(dayjs(dateFrom)) || dayjs().isSame(dayjs(dateFrom), 'day') || (dayjs().isAfter(dayjs(dateFrom)) && dayjs().isBefore(dayjs(dateTo)));

export const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortPointDate = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

export const sortPointPrice = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  return weight ?? pointB.basePrice - pointA.basePrice;
};

export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

export const calculatePrice = (point) => {
  let price = point.basePrice;
  //находим нужный список offers, соответствуйщий типу
  const pointTypeOffer = offersType.find((offer) => offer.type === point.type).offers;
  //проходимся по списку, ищем подходящий offers, совпадающий по id и забираем нужную цену
  point.offers.map((elem) => {
    const offerPrice = pointTypeOffer.find((offer) => offer.id === elem)//.price; почему-то не читает значение price выдает ошибку
    price += offerPrice;
  });
  return price;
};
