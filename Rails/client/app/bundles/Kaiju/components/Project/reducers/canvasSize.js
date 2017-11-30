const canvasSize = (state = 'auto', action) => {
  switch (action.type) {
    case 'SET_CANVAS_SIZE':
      return action.size;
    default:
      return state;
  }
};

export default canvasSize;
