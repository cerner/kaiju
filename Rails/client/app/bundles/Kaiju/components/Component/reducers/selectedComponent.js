import { SELECT_COMPONENT } from '../actions/actions';

const selectedComponent = (state = null, action) => {
  switch (action.type) {
    case SELECT_COMPONENT:
      return action.id || null;
    default:
      return state;
  }
};

export default selectedComponent;
