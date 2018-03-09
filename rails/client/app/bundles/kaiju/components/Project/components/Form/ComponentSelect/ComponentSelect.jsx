import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import iconMap from 'terra-kaiju-plugin/iconMap';
import { TreeSelect } from 'antd';
import { refresh } from '../../../utilities/messenger';
import { humanize } from '../../../../../utilities/utilities';
import axios from '../../../../../utilities/axios';
import styles from './ComponentSelect.scss';

const cx = classNames.bind(styles);
const TreeNode = TreeSelect.TreeNode;

const propTypes = {
  /**
   * The available reference components.
   */
  components: PropTypes.array,
  /**
   * The component identifier.
   */
  id: PropTypes.string,
  /**
   * The component property url.
   */
  url: PropTypes.string,
};

const ComponentSelect = ({ components, id, url }) => {
  /**
   * Replaces the current component with the selected value.
   * @param {string} value - The selected option value.
   */
  const onChange = (value) => {
    axios
      .put(url, { value: { type: value } })
      .then(() => {
        refresh(id);
      });
  };

  /**
   * Filters the available select options.
   * @param {string} input - The search input.
   * @param {node} option - React Select.Option.
   */
  const filterNodes = (input, option) => {
    const value = option.props.value;
    return value && humanize(value).toLowerCase().includes(input.toLowerCase());
  };

  /**
   * Generates a TreeSelect from the available reference components.
   * @param {array} data - Tree data.
   */
  const generateTreeView = (data) => {
    const nodes = data.children.map((child) => {
      const { children, display, library, name } = child;
      if (children) {
        return generateTreeView(child);
      }

      const Icon = iconMap[name];
      const value = `${library}::${name}`;
      const title = <div>{Icon && <Icon className={cx('icon')} />}{display || name}</div>;
      return <TreeNode key={value} value={value} title={title} />;
    });

    return <TreeNode key={data.display} title={data.display} selectable={false}>{nodes}</TreeNode>;
  };


  return (
    <TreeSelect
      className={cx('select')}
      dropdownStyle={{ maxHeight: 300 }}
      filterTreeNode={filterNodes}
      placeholder="Select component"
      onSelect={onChange}
      multiple
      showSearch
      treeDefaultExpandAll
    >
      {components.map(component => generateTreeView(component))}
    </TreeSelect>
  );
};

ComponentSelect.propTypes = propTypes;

export default ComponentSelect;
