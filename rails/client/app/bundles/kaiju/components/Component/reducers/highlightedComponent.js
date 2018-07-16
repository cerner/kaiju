import { HIGHLIGHT_COMPONENT } from '../actions/actions';

const highlightedComponent = (state = null, { id, type }) => {
  switch (type) {
    case HIGHLIGHT_COMPONENT:
      return id || null;
    default:
      return state;
  }
};

export default highlightedComponent;
