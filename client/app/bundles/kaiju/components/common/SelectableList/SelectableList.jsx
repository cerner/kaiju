import React from 'react';
import PropTypes from 'prop-types';
import SelectableItem from './SelectableItem/SelectableItem';

import './SelectableList.scss';

const propTypes = {
  /**
   * Child Nodes.
   */
  children: PropTypes.node,
  /**
   * Callback function triggered when a List item is selected, passes in the selected key as an argument.
   */
  onChange: PropTypes.func,
  /**
   * The default selected key.
   */
  defaultSelection: PropTypes.string,
};

class SelectableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedKey: props.defaultSelection };
    this.handleSelection = this.handleSelection.bind(this);
  }

  /**
   * Manages the selection state of List items.
   * @param {String} key - The selected key.
   */
  handleSelection(key) {
    const isNewState = this.state.selectedKey !== key;

    if (isNewState) {
      this.setState({ selectedKey: key });
    }

    if (this.props.onChange && isNewState) {
      this.props.onChange(key);
    }
  }

  render() {
    const children = React.Children.map(this.props.children, (child) => (
      <SelectableItem onClick={() => this.handleSelection(child.key)} isSelected={child.key === this.state.selectedKey}>
        {child}
      </SelectableItem>
    ));

    return (
      <ul className="kaiju-SelectableList">
        {children}
      </ul>
    );
  }
}

SelectableList.propTypes = propTypes;

export default SelectableList;
