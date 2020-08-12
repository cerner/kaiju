import { useReducer } from 'react';

const useStackReducer = (reducer, initialState) => {
  const stack = {
    past: [],
    present: initialState,
    future: [],
  };

  const undoReducer = (state, action) => {
    const { type } = action;
    const { past, present, future } = state;

    if (type === 'UNDO') {
      if (past.length > 0) {
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        return { past: newPast, present: previous, future: [present, ...future] };
      }

      return { past, present, future };
    }

    if (type === 'REDO') {
      if (future.length > 0) {
        const next = future[0];
        const newFuture = future.slice(1);

        return { past: [...past, present], present: next, future: newFuture };
      }

      return { past, present, future };
    }

    const newPresent = reducer(present, action);

    if (type !== 'SELECT') {
      return { past: [...past, present], present: newPresent, future: [] };
    }

    return { past, present: newPresent, future: [] };
  };

  const [state, dispatch] = useReducer(undoReducer, stack);

  return [state.present, dispatch];
};

export default useStackReducer;
