import { ADD_NEW_BLOCK } from './const';

function action(parameter) {
  return { type: ADD_NEW_BLOCK, parameter };
}

module.exports = action;
