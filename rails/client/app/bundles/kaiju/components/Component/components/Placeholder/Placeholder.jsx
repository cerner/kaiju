import React from 'react';
import classNames from 'classnames/bind';
import TreeParser from '../../utilities/TreeParser';
import styles from './Placeholder.scss';

const cx = classNames.bind(styles);

class Placeholder extends React.Component {
  /**
   * Replaces the Placeholder with the dropped component.
   * @param {event} event - The drop event.
   */
  static handleDrop(event) {
    const target = TreeParser.findDOMNodeKey(event.target);
    const data = event.dataTransfer.getData('text');
    const properties = data.length > 0 ? JSON.parse(data) : null;
    window.postMessage({ message: 'kaiju-replace', properties, target }, '*');
  }

  constructor() {
    super();
    this.state = { isActive: false };
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
  }

  componentDidMount() {
    const { clientHeight, clientWidth } = this.placeholder;
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ autoHeight: clientHeight === 0, autoWidth: clientWidth === 0 });
  }

  /**
   * Handles the drag leave event.
   */
  handleDragLeave() {
    this.setState({ isActive: false });
  }

  /**
   * Handles the drag enter event.
   * @param {event} event - The drag enter event.
   */
  handleDragEnter(event) {
    event.preventDefault();

    if (this.state.isActive === false) {
      this.setState({ isActive: true });
    }
  }

  render() {
    const classes = cx(
      'placeholder',
      { 'is-active': this.state.isActive },
      { autoHeight: this.state.autoHeight },
      { autoWidth: this.state.autoWidth },
    );

    return (
      <div
        className={classes}
        onDragLeave={this.handleDragLeave}
        onDragEnter={this.handleDragEnter}
        onDrop={Placeholder.handleDrop}
        ref={(ref) => { this.placeholder = ref; }}
      />
    );
  }
}

export default Placeholder;
