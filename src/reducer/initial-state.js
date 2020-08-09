import { v4 as uuidv4 } from 'uuid';

const initialState = {
  selected: null,
  sandbox: {
    id: 'root',
    children: [{
      id: uuidv4(),
      parent: 'root',
      type: 'element',
      value: {
        component: 'terra-sandbox:placeholder',
      },
    }],
  },
};

export default initialState;
