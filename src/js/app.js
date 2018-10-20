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
} from './renderers';
import { formStates, getNewState } from './stateUtils';
import getParsedRss from './dataLoader';

export default () => {
  const state = {
    formState: formStates.clean,
    newFeedsUrl: '',
    feedsList: [],
    articlesList: [],
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
          const links = state.articlesList.map(({ link }) => link);
          const unicLinks = data.articles.filter(({ link }) => !links.includes(link));
          if (unicLinks.length !== 0) {
            state.articlesList.push(...unicLinks);
          }
        }).catch((error) => { console.log(error); });
    });
  };
  setupWatchers();
  setupHandlers();
};
