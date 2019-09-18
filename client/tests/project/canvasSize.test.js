import reducer from '../../app/bundles/kaiju/components/Project/reducers/canvasSize';

describe('canvas size reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual('auto');
  });

  it('should handle SET_CANVAS_SIZE by setting the canvas size', () => {
    const size = 'size';
    const action = {
      type: 'SET_CANVAS_SIZE',
      size,
    };

    expect(reducer(undefined, action)).toEqual(size);
  });
});
