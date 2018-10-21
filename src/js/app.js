import { watch } from 'melanke-watchjs';
import { getForm, getInput } from './renderUtils';
import {
  renderNotValidInput,
  renderDuplicateError,
  renderWaiting,
  renderIsValid,
  renderClean,
  renderNewFeed,
  renderNewArticle,
  renderErrorFeedback,
} from './renderers';
import { formStates, getNewState } from './stateUtils';
import getParsedRss from './dataLoader';

const timerDelay = 5000;

export default () => {
  const state = {
    formState: formStates.clean,
    newFeedsUrl: '',
    feedsList: [],
    articlesList: [],
    error: null,
  };

  const setupWatchers = () => {
    watch(state, 'formState', (_prop, _action, newState) => {
      switch (newState) {
        case formStates.linkNotValid:
          renderNotValidInput();
          break;
        case formStates.duplicate:
          renderDuplicateError();
          break;
        case formStates.waiting:
          renderWaiting();
          break;
        case formStates.linkIsValid:
          renderIsValid();
          break;
        case formStates.clean:
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
    watch(state, 'error', () => {
      renderErrorFeedback();
    });
  };

  const addArticles = (articles) => {
    const links = state.articlesList.map(({ link }) => link);
    const unicLinks = articles.filter(({ link }) => !links.includes(link));
    if (unicLinks.length !== 0) {
      state.articlesList.push(...unicLinks.reverse());
    }
  };

  const setupHandlers = () => {
    getInput().addEventListener('input', ({ target }) => Object.assign(state, getNewState(target.value, state)));
    getForm().addEventListener('submit', (event) => {
      event.preventDefault();
      if (state.formState !== formStates.linkIsValid) {
        return;
      }
      state.formState = formStates.waiting;
      getParsedRss(state.newFeedUrl).then(data => ({ ...data, link: state.newFeedUrl }))
        .then((data) => {
          state.formState = formStates.clean;
          state.newFeedUrl = '';
          state.feedsList.push(data);
          addArticles(data.articles);
        }).catch((error) => {
          state.error = error;
        });
    });
  };

  const updateFeeds = () => {
    const feedsLink = state.feedsList.map(({ link }) => link);
    if (feedsLink.length === 0) {
      setTimeout(updateFeeds, timerDelay);
      return;
    }

    Promise.all(feedsLink.map(getParsedRss))
      .then(feeds => feeds.forEach(feed => addArticles(feed.articles)))
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setTimeout(updateFeeds, timerDelay));
  };
  setupWatchers();
  setupHandlers();
  updateFeeds();
};
