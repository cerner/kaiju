import append from './append';
import replace from './replace';
import select from './select';
import update from './update';
import initialState from './initial-state';

const reducer = (state, action) => {
  const { type } = action;

  switch (type) {
    case 'APPEND':
      return append(state, action);
    case 'REPLACE':
      return replace(state, action);
    case 'SELECT':
      return select(state, action);
    case 'UPDATE':
      return update(state, action);
    default:
      // eslint-disable-next-line no-console
      console.log('WARNING: Unsupported reducer action.');
      return state;
  }
};

export default reducer;
export { initialState };
