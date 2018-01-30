import reducer from '../../app/bundles/kaiju/components/Component/reducers/components';

describe('components reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle UPDATE_PROPERTY', () => {
    const id = 'id';
    const value = 'value';
    const property = { id: 'property' };
    const action = {
      type: 'UPDATE_PROPERTY',
      id,
      value,
      property,
    };

    const components = {
      [id]: {
        id: 'id',
        properties: {
          property: {
            id: 'property',
            value: 'old value',
          },
        },
      },
    };

    expect(reducer(components, action)).toHaveProperty('id.properties.property.value', value);
  });

  it('should handle REFRESH_STORE', () => {
    const id = 'id';
    const store = {
      id: {
        id: 'id',
        properties: {
          property: {
            id: 'property',
            value: 'value',
          },
        },
      },
    };

    const action = {
      type: 'REFRESH_STORE',
      id,
      store,
    };

    const previousStore = {
      id: {
        id: 'id',
        properties: {
          property: {
            id: 'property',
            value: 'old value',
          },
        },
      },
    };

    expect(reducer(previousStore, action)).toEqual(store);
  });

  it('should handle REFRESH_STORE by adding addtional components', () => {
    const id = 'target';
    const store = {
      target: {
        id: 'target',
        properties: {
          property: {
            id: 'property',
            value: 'new value',
          },
          extraProperty: {
            id: 'extraProperty',
            value: 'extra',
          },
        },
      },
    };

    const action = {
      type: 'REFRESH_STORE',
      id,
      store,
    };

    const previousStore = {
      1: {
        id: '1',
        properties: {
          property: {
            id: 'property',
            value: 'value',
          },
        },
      },
      target: {
        id: 'target',
        properties: {
          property: {
            id: 'property',
            value: 'value',
          },
        },
      },
    };

    const expected = { ...previousStore, ...store };
    expect(reducer(previousStore, action)).toEqual(expected);
  });

  it('should handle COLLECT_GARBAGE', () => {
    const root = 'root';

    const action = {
      type: 'COLLECT_GARBAGE',
      root,
    };

    const store = {
      root: {
        id: 'root',
        properties: {
          property: {
            id: 'property',
            type: 'Component',
            value: {
              id: 'target',
            },
          },
        },
      },
      target: {
        id: 'target',
        properties: {
          property: {
            id: 'property',
            value: 'value',
          },
        },
      },
      garbage: {
        id: 'garbage',
        properties: {
          property: {
            id: 'property',
            value: 'value',
          },
        } },
    };

    const expected = {
      root: {
        id: 'root',
        properties: {
          property: {
            id: 'property',
            type: 'Component',
            value: {
              id: 'target',
            },
          },
        },
      },
      target: {
        id: 'target',
        properties: {
          property: {
            id: 'property',
            value: 'value',
          },
        },
      },
    };

    expect(reducer(store, action)).toEqual(expected);
  });
});
