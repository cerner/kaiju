import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  /**
   * Child nodes.
   */
  children: PropTypes.node,
};

class SafeRender extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          Something went wrong.
          {this.state.error.toString()}
          {this.state.info.toString()}
        </div>
      );
    }

    return this.props.children;
  }
}

SafeRender.propTypes = propTypes;

export default SafeRender;
