import axios from 'axios';

const getArticles = (channel) => {
  const items = [...channel.querySelectorAll('item')];
  return items.map(item => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
    pubDate: Date.parse(item.querySelector('pubDate').textContent),
    guid: item.querySelector('guid').textContent,
  }));
};

export default (url) => {
  const newUrl = `https://cors-anywhere.herokuapp.com/${url}`;
  return axios.get(newUrl).then(({ data }) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'application/xml');
    const channel = doc.querySelector('channel');
    const title = channel.querySelector('title');
    const description = channel.querySelector('description');
    const articles = getArticles(channel);
    return {
      title: title.textContent,
      description: description.textContent,
      articles,
    };
  });
};
