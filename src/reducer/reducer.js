import initialState from './initial-state';

const reducer = (state, action) => {
  const { type } = action;

  switch (type) {
    default:
      // eslint-disable-next-line no-console
      console.log('WARNING: Unsupported reducer action.');
      return state;
  }
};

export default reducer;
export { initialState };
