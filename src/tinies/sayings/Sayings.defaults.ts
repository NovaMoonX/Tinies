import { Saying, SayingsData } from './Sayings.types';

export const defaultSayingsData: SayingsData = {
  sayings: [],
  favoriteTags: [],
};

export const defaultSaying: Saying = {
  id: '',
  saying: '',
  meaning: '',
  author: null,
  moreInfo: null,
  dateHeard: null,
  tags: [],
  dateAdded: '',
};
