import React from 'react';
import Base from 'terra-base';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Provider } from 'react-redux';
import configureStore from './store/componentStore';
import ComponentContainer from './containers/ComponentContainer';
import Spinner from '../common/Spinner/Spinner';
import distpatcher from './utilities/dispatcher';
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
    initializeDrag();

    axios
      .get(this.props.url)
      .then(({ data }) => {
        this.store = configureStore(data);
        distpatcher(this.store, this.props.id);
        this.setState({ loading: false });
      });
  }

  render() {
    if (this.state.loading) {
      return <div className={cx('loading')}><Spinner /></div>;
    }

    return (
      <Provider store={this.store}>
        <Base locale="en-US">
          <ComponentContainer root={this.props.id} />
        </Base>
      </Provider>
    );
  }
}

Component.propTypes = propTypes;

export default Component;
