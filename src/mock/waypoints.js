
import { getRandomArrayElement, getRndInteger, getRandomNumber } from '../utils/common.js';
import {nanoid} from 'nanoid';

const mockDescriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  ' Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const mockCities = [
  'Accra',
  'Alexandria',
  'Amsterdam',
  'Algiers',
  'Belgrade',
  'Birmingham',
  'Yerevan',
  'Duesseldorf',
  'Geneva'
];

const pictures = [
  'https://loremflickr.com/248/152?random=1',
  'https://loremflickr.com/248/152?random=2',
  'https://loremflickr.com/248/152?random=3',
  'https://loremflickr.com/248/152?random=4',
  'https://loremflickr.com/248/152?random=5',
  'https://loremflickr.com/248/152?random=6',
  'https://loremflickr.com/248/152?random=7',
  'https://loremflickr.com/248/152?random=8',
  'https://loremflickr.com/248/152?random=9'
];

const createDestinations = (count) => {
  const array = [];
  for (let index = 0; index < count; index++) {
    array.push({
      id: index + 1,
      description: getRandomArrayElement(mockDescriptions),
      name: getRandomArrayElement(mockCities),
      pictures: [
        {
          src: getRandomArrayElement(pictures),
          description: getRandomArrayElement(mockDescriptions),
        }
      ]
    });
  }
  return array;
};

export const destinations = createDestinations(10);

export const offersType = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 2,
        title: 'Choose the radio station',
        price: 300
      },
      {
        id: 3,
        title: 'No smoking',
        price: 500
      },
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: 1,
        title: 'book a seat',
        price: 350
      },
      {
        id: 2,
        title: 'take a seat by the window',
        price: 1000
      },
      {
        id: 3,
        title: 'select a channel to watch',
        price: 500
      },
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: 1,
        title: 'Add meals',
        price: 500
      },
      {
        id: 2,
        title: 'Add drinks',
        price: 350
      },
      {
        id: 3,
        title: 'Luggage tray',
        price: 280
      },
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: 1,
        title: 'Show programs',
        price: 380
      },
      {
        id: 2,
        title: 'Food and drinks',
        price: 400
      },
      {
        id: 3,
        title: 'live music',
        price: 500
      },
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 1,
        title: 'Car for rent',
        price: 800
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 1,
        title: 'Food and drinks',
        price: 380
      },
      {
        id: 2,
        title: 'Add luggage',
        price: 200
      },
      {
        id: 3,
        title: 'Switch to comfort class',
        price: 500
      },
      {
        id: 4,
        title: 'Choose seats',
        price: 20,
      }
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 1,
        title: 'Excursions',
        price: 300
      },
      {
        id: 2,
        title: 'Translator',
        price: 200
      }
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: 1,
        title: 'Excursions',
        price: 380
      },
      {
        id: 2,
        title: 'Food and drinks',
        price: 500
      },
      {
        id: 3,
        title: 'Translator',
        price: 200
      },
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: 1,
        title: 'Birthday greetings',
        price: 400
      }
    ]
  },
];

export const types = [
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

const generateWaypoits = (count) => {
  const array = [];
  for (let index = 0; index < count; index++) {
    const randType = getRandomArrayElement(types);
    array.push({
      basePrice: getRndInteger(1000, 10000),
      dateFrom: new Date(2021, getRandomNumber(1, 12), getRandomNumber(1, 30), getRandomNumber(0, 24), 24, 0),
      dateTo: new Date(getRandomNumber(2022, 2023), getRandomNumber(1, 12), getRandomNumber(1, 30), getRandomNumber(0, 24), 24, 0),
      destination: getRndInteger(1, 11),
      id: getRndInteger(0, 11),
      uniqueId: nanoid(),
      offers: offersType.find((elem) => elem.type === randType).offers,
      type: randType
    });
  }
  return array;
};

const waypoints = generateWaypoits(10);

const getRandomWaypoint = () => getRandomArrayElement(waypoints);

const autorizationError = {
  error: 401,
  message: 'Header Authorization is not correct'
};

const notFoundError = {
  error: 404,
  message: 'Not found'
};

export { getRandomWaypoint, autorizationError, notFoundError };


