import { Saying, SayingsData } from './Sayings.types';

export const defaultSayingsData: SayingsData = {
  sayings: [],
};

export const defaultSaying: Saying = {
  id: '',
  saying: '',
  meaning: '',
  author: null,
  moreInfo: null,
  dateHeard: null,
  tags: [],
  isFavorite: false,
  dateAdded: 0,
};
