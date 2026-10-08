import './App.css'
import Counter from './components/Counter'
import Todos from './components/Todos'

function App() {

  return (
    <>
      <h3 className='text-3xl mb-4'>React with Redux toolkit</h3>
      <pre><code>
        {` 
        Steps to create redux store
        Slice Creation: The createSlice function simplifies the process of creating a slice of state, including actions and reducers.
        Store Configuration: The configureStore function sets up the Redux store with the slice reducer.
        Provider Setup: The Provider component makes the Redux store available to the rest of your app.
        Component Connection: The useSelector hook accesses the state, and the useDispatch hook dispatches actions to update the state.
        `}
      </code></pre><br/>
      <pre><code>
        {` Slice Creation:

        import { createSlice } from '@reduxjs/toolkit';

        const counterSlice = createSlice({
          name: 'counter',
          initialState: {
            value: 0,
          },
          reducers: {
            increment: (state) => {
              state.value += 1;
            },
            decrement: (state) => {
              state.value -= 1;
            },
            incrementByAmount: (state, action) => {
              state.value += action.payload;
            },
        });

        export const { increment, decrement, incrementByAmount } = counterSlice.actions;
        export default counterSlice.reducer;
        `}
      </code></pre><br/>
      <pre><code>
        {` Store Configuration:
        
        import { configureStore } from '@reduxjs/toolkit';
        import counterReducer from '../features/counter/counterSlice';
        import todoReducer from '../features/todo/todoSlice';

        const rootReducer = {
          counter: counterReducer,
          todo: todoReducer,
        };

        export const store = configureStore({
          reducer: rootReducer,
        });
        `}
      </code></pre><br/>
      <pre><code>
        {` Provider Setup in root component:
        
          <Provider store={store}>
            <App />
          </Provider>
        `}
      </code></pre><br/>
      <pre><code>
        {` Component Connection:
        
          import { useSelector, useDispatch } from 'react-redux';
          import { increment, decrement, incrementByAmount } from '../features/counter/counterSlice';

          const Counter = () => {
          const count = useSelector((state:any) => state.counter.value);
          const dispatch = useDispatch();

          return (
            <div>
              <div>
                <button onClick={() => dispatch(decrement())}>-</button>
                <span>{count}</span>
                <button onClick={() => dispatch(increment())}>+</button>
              </div>
              <div>
                <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
              </div>
            </div>
          );
        };
        `}
      </code></pre>
      <div className="card">
      <Counter />
      </div>
      <div className="card">
      <Todos />
      </div>
      
    </>
  )
}

export default App
