import { watch } from 'melanke-watchjs';
import { getForm, getInput } from './utils';
import {
  renderNotValidInput,
  renderDuplicateError,
  renderWaiting,
  renderIsValid,
  renderClean,
  renderNewFeed,
  renderNewArticle,
} from './renderers';
import { states, updateState } from './state';
import getParseRSS from './getParseRSS';

export default () => {
  const state = {
    formState: states.clean,
    newFeedsUrl: '',
    feedsList: [],
    articlesList: [],
  };

  const setupWatchers = () => {
    watch(state, 'formState', (_prop, _action, newState) => {
      switch (newState) {
        case states.linkNotValid:
          renderNotValidInput();
          break;
        case states.duplicate:
          renderDuplicateError();
          break;
        case states.waiting:
          renderWaiting();
          break;
        case states.linkIsValid:
          renderIsValid();
          break;
        case states.clean:
          renderClean();
          break;
        default:
          throw new Error('Error state!!!!');
      }
    });
    watch(state, 'feedsList', (_prop, _action, feed) => {
      renderNewFeed(feed);
    });
    watch(state, 'articlesList', (_prop, _action, value) => {
      const start = state.articlesList.indexOf(value);
      const articles = state.articlesList.slice(start);
      articles.forEach(article => renderNewArticle(article));
    });
  };

  const setupHandlers = () => {
    getInput().addEventListener('input', ({ target }) => Object.assign(state, updateState(target.value, state)));
    getForm().addEventListener('submit', (event) => {
      event.preventDefault();
      if (state.formState !== states.linkIsValid) {
        return;
      }
      state.formState = states.waiting;
      getParseRSS(state.newFeedUrl).then(data => ({ ...data, link: state.newFeedUrl }))
        .then((data) => {
          state.formState = states.clean;
          state.newFeedUrl = '';
          state.feedsList.push(data);
          const links = state.articlesList.map(({ link }) => link);
          const unicLinks = data.articles.filter(({ link }) => !links.includes(link));
          if (unicLinks.length !== 0) {
            state.articlesList.push(...unicLinks);
          }
        }).catch((error) => { console.log(error); });
    });
  };
  // const runUpdate = () => {
  //
  // };
  const start = () => {
    setupWatchers();
    setupHandlers();
    // runUpdate();
  };

  start();
};
