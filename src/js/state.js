import isURL from 'validator/lib/isURL';

export const states = Object.freeze({
  clean: 'clean',
  linkIsValid: 'isValid',
  linkNotValid: 'notValid',
  duplicate: 'duplicate',
  waiting: 'waiting',
});

const isLinkExist = (url, state) => {
  const links = new Set(state.feedsList.map(({ link }) => link));
  return links.has(url);
};

export const updateState = (inputData, state) => {
  const newState = { newFeedUrl: inputData };
  if (!inputData) {
    newState.formState = states.clean;
    return newState;
  }
  if (isURL(inputData)) {
    newState.formState = isLinkExist(inputData, state) ? states.duplicate : states.linkIsValid;
  } else {
    newState.formState = states.linkNotValid;
  }
  return newState;
};
