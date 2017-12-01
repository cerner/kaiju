import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
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
      return <div>{this.state.error.toString()}</div>;
    }
    return this.props.children;
  }
}

SafeRender.propTypes = propTypes;

export default SafeRender;
