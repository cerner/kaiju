import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconCaretDown from 'terra-icon/lib/icon/IconCaretDown';

import './TreeView.scss';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
  /**
   * Display header
   */
  header: PropTypes.node,
  /**
   * Whether the child nodes of the tree are collapsed
   */
  isCollapsed: PropTypes.bool,
};

const defaultProps = {
  header: '--',
  isCollapsed: false,
};

/* eslint-disable jsx-a11y/no-static-element-interactions */
class TreeView extends React.Component {
  constructor({ isCollapsed }) {
    super();
    this.state = { isCollapsed };
    this.handleCollapseChange = this.handleCollapseChange.bind(this);
  }

  handleCollapseChange() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    const {
      header, children, isCollapsed, ...customProps
    } = this.props;

    const chevonClasses = classNames([
      'kaiju-TreeView-chevron',
      { 'is-collapsed': this.state.isCollapsed },
    ]);

    const childrenClasses = classNames([
      'kaiju-TreeView-children',
      { 'is-collapsed': this.state.isCollapsed },
    ]);

    return (
      <ul className="kaiju-TreeView" {...customProps}>
        <li className="kaiju-TreeView-header" onClick={this.handleCollapseChange} role="presentation">
          <IconCaretDown className={chevonClasses} />
          {header}
        </li>
        <ul className={childrenClasses}>
          {children}
        </ul>
      </ul>
    );
  }
}

TreeView.propTypes = propTypes;
TreeView.defaultProps = defaultProps;

export default TreeView;
