import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../features/counter/counterSlice';

const Counter = () => {
  const count = useSelector((state:any) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button className='text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg' onClick={() => dispatch(decrement())}>-</button>
        <span className='text-white bg-red-500 py-3 px-6 rounded'>{count}</span>
        <button className='text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg' onClick={() => dispatch(increment())}>+</button>
      </div>
      <div className='m-2'>
        <button className='text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg' onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
      </div>
    </div>
  );
};

export default Counter;