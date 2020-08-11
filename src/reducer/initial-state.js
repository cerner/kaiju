import { v4 as uuidv4 } from 'uuid';

const initialState = {
  selected: null,
  sandbox: {
    id: 'root',
    children: [],
  },
};

export default initialState;
