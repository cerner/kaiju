import React from 'react';
import Base from 'terra-base';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Provider } from 'react-redux';
import configureStore from './store/componentStore';
import ComponentContainer from './containers/ComponentContainer';
import SelectedContainer from './containers/SelectedContainer';
import HighlightContainer from './containers/HighlightContainer';
import dispatcher from './utilities/dispatcher';
import initializeDrag from './utilities/drag';
import axios from '../../utilities/axios';
import styles from './Component.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The Component identifer.
   */
  id: PropTypes.string.isRequired,
  /**
   * The Component url.
   */
  url: PropTypes.string.isRequired,
};

class Component extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: true };
  }

  componentDidMount() {
    axios
      .get(this.props.url)
      .then(({ data }) => {
        this.store = configureStore(data);
        dispatcher(this.store, this.props.id);
        initializeDrag(this.store, this.props.id);

        // Remove the transparent styles on the document and body.
        document.documentElement.style = '';
        document.body.style = '';

        this.setState({ loading: false });
      });
  }

  render() {
    if (this.state.loading) {
      return null;
    }

    return (
      <Provider store={this.store}>
        <Base locale="en-US" id="kaiju-root" className={cx('root')}>
          <ComponentContainer root={this.props.id} />
          <SelectedContainer />
          <HighlightContainer />
        </Base>
      </Provider>
    );
  }
}

Component.propTypes = propTypes;

export default Component;
