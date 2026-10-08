import { combineReducers } from 'redux';

import { reducer as counterReducer } from './counter';
import { reducer as todoReducer } from './todo';

// Combine all reducers.

const rootReducer = combineReducers({
  counter: counterReducer,
  todo: todoReducer
});

export default rootReducer;
