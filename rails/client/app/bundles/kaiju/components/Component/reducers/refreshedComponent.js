import { REFRESH_STORE, SELECT_COMPONENT } from '../actions/actions';

const refreshedComponent = (state = null, { type, id }) => {
  switch (type) {
    case SELECT_COMPONENT:
      return null;
    case REFRESH_STORE:
      return id;
    default:
      return state;
  }
};

export default refreshedComponent;
