import React from 'react';
import classNames from 'classnames';
import './Placeholder.scss';

class Placeholder extends React.Component {
  static handleDrop(event) {
    const target = event.target.getAttribute('data-kaiju-component-id');
    const data = event.dataTransfer.getData('text');
    const properties = data.length > 0 ? JSON.parse(data) : null;
    window.postMessage({ message: 'kaiju-replace', properties, target }, '*');
  }

  constructor() {
    super();
    this.state = { isActive: false };
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
  }

  /**
   * Disables the active state
   */
  handleDragLeave() {
    this.setState({ isActive: false });
  }

  /**
   * Enables the active state
   */
  handleDragOver(event) {
    event.preventDefault();

    if (this.state.isActive === false) {
      this.setState({ isActive: true });
    }
  }

  render() {
    const classes = classNames(['kaiju-Placeholder', { 'is-active': this.state.isActive }]);
    return (
      <div className={classes} onDragLeave={this.handleDragLeave} onDragOver={this.handleDragOver} onDrop={Placeholder.handleDrop}>
        Component Placeholder
      </div>
    );
  }
}

export default Placeholder;
