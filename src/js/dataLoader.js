import axios from 'axios';
import getParseData from './rssParser';

const proxy = 'https://cors-anywhere.herokuapp.com/';

export default (url) => {
  const newUrl = `${proxy}${url}`;
  return axios.get(newUrl).then(({ data }) => getParseData(data));
};
