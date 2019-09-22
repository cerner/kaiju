import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setSelectedListItem } from '../actions/actions';
import SelectableList from '../../common/SelectableList/SelectableList';

const propTypes = {
  /**
   * Child nodes.
   */
  children: PropTypes.node,
  /**
   * The key of the selected list item.
   */
  defaultSelection: PropTypes.string,
  /**
   * Callback function triggered when a list item is selected.
   */
  onChange: PropTypes.func,
};

const mapStateToProps = ({ selectedListItem }) => ({
  defaultSelection: selectedListItem,
});

const mapDispatchToProps = dispatch => ({
  onChange: (listItemKey) => {
    dispatch(setSelectedListItem(listItemKey));
  },
});

const SelectionList = ({ children, defaultSelection, onChange }) => (
  <SelectableList defaultSelection={defaultSelection} onChange={onChange}>
    {children}
  </SelectableList>
);

SelectionList.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(SelectionList);
