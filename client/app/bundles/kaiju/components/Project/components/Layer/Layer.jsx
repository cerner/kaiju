import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { replace } from '../../utilities/messenger';
import styles from './Layer.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The child content.
   */
  children: PropTypes.node,
  /**
   * The layer identifier.
   */
  id: PropTypes.string,
  /**
   * The layer type.
   */
  type: PropTypes.string,
};

class Layer extends React.Component {
  constructor() {
    super();

    this.state = {
      isActive: false,
    };

    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
  }

  /**
   * Handles the drop event by replacing the current component.
   * @param {event} event - The drop event.
   */
  handleDrop(event) {
    const componentData = event.dataTransfer.getData('text');
    const properties = componentData.length > 0 ? JSON.parse(componentData) : null;

    replace(this.props.id, properties);

    this.setState({ isActive: false });
  }

  /**
   * Handles the drag leave event by deactivating the hover effects.
   */
  handleDragLeave() {
    this.setState({ isActive: false });
  }

  /**
   * Handles the drag enter event.
   * @param {event} event - The drag enter event.
   */
  handleDragOver(event) {
    event.preventDefault();

    if (this.state.isActive === false) {
      this.setState({ isActive: true });
    }
  }

  render() {
    const {
      children,
      id,
      type,
      ...customProps
    } = this.props;

    if (type === 'Placeholder') {
      customProps.onDragLeave = this.handleDragLeave;
      customProps.onDragOver = this.handleDragOver;
      customProps.onDrop = this.handleDrop;
    }

    return (
      <li {...customProps} className={cx('layer', { 'is-active': this.state.isActive })}>
        {children}
      </li>
    );
  }
}

Layer.propTypes = propTypes;

export default Layer;
