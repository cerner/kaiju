import React from 'react';
import PropTypes from 'prop-types';
import GridItem from './GridItem/GridItem';

import './SelectableGrid.scss';

const propTypes = {
  /**
   * Child Nodes.
   */
  children: PropTypes.node,
  /**
   * Callback function triggered when a Grid item is selected, passes in the selected key as an argument.
   */
  onChange: PropTypes.func,
  /**
   * The default selected key.
   */
  defaultSelection: PropTypes.string,
};

class SelectableGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedKey: props.defaultSelection };
    this.handleSelection = this.handleSelection.bind(this);
  }

  /**
   * Manages the selection state of Grid items.
   * Note: Selecting an already selected item will deselect it.
   * @param {String} key - The selected key.
   */
  handleSelection(key) {
    const selectedKey = (this.state.selectedKey === key) ? null : key;

    this.setState({ selectedKey });

    if (this.props.onChange) {
      this.props.onChange(selectedKey);
    }
  }

  render() {
    const children = React.Children.map(this.props.children, child => (
      <GridItem onClick={() => this.handleSelection(child.key)} isSelected={child.key === this.state.selectedKey}>
        {child}
      </GridItem>
    ));

    return (
      <div className="kaiju-SelectableGrid">
        {children}
      </div>
    );
  }
}

SelectableGrid.propTypes = propTypes;

export default SelectableGrid;
