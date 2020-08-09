import replace from './replace';
import initialState from './initial-state';

const reducer = (state, action) => {
  const { type } = action;

  switch (type) {
    case 'REPLACE':
      return replace(state, action);
    default:
      // eslint-disable-next-line no-console
      console.log('WARNING: Unsupported reducer action.');
      return state;
  }
};

export default reducer;
export { initialState };
