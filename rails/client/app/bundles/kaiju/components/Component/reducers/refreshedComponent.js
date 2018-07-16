import { REFRESH_STORE, SELECT_COMPONENT, UPDATE_PROPERTY } from '../actions/actions';

const refreshedComponent = (state = null, { type, id }) => {
  switch (type) {
    case SELECT_COMPONENT:
      return null;
    case REFRESH_STORE:
    case UPDATE_PROPERTY:
      return id;
    default:
      return state;
  }
};

export default refreshedComponent;
