import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../features/rootReducer.ts';

export const store = configureStore({
    reducer: rootReducer
});

// import { configureStore } from '@reduxjs/toolkit';
// import counterReducer from '../features/counter/counterSlice';
// import todoReducer from '../features/todo/todoSlice';

// const rootReducer = {
//   counter: counterReducer,
//   todo: todoReducer,
// };

// export const store = configureStore({
//   reducer: rootReducer,
// });
