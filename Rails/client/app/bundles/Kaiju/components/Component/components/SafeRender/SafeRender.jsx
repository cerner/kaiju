import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
  /**
   * The Component type
   */
  type: PropTypes.node,
};

class SafeRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  // eslint-disable-next-line
  unstable_handleError(error) {
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return <div>{this.props.type}: Failed to Render</div>;
    }
    return this.props.children;
  }
}

SafeRender.propTypes = propTypes;

export default SafeRender;
