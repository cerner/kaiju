import React from 'react';
import PropTypes from 'prop-types';
import { TreeSelect } from 'antd';
import ajax from 'superagent';
import { refresh } from '../../../utilities/messenger';
import './ComponentSelect.scss';

const propTypes = {
  /**
   * The availe reference components
   */
  components: PropTypes.array,
  /**
   * The component identifier
   */
  id: PropTypes.string,
  /**
   * The component property url
   */
  url: PropTypes.string,
};

const ComponentSelect = ({ components, id, url }) => {
  const onChange = (value) => {
    ajax
      .put(url)
      .set('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'))
      .send({ value: { type: value } })
      .end(() => {
        refresh(id);
      });
  };

  const generateTreeView = (group) => {
    const children = group.children.map((item) => {
      if (item.children) {
        return generateTreeView(item);
      }
      const { display, library, name } = item;
      return <TreeSelect.TreeNode key={`${library}::${name}`} title={display || name} value={`${library}::${name}`} />;
    });
    return <TreeSelect.TreeNode key={group.display} title={group.display} disabled>{children}</TreeSelect.TreeNode>;
  };

  return (
    <TreeSelect
      className="kaiju-ComponentSelect"
      showSearch
      placeholder="Select component"
      allowClear
      dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
      onChange={onChange}
      treeDefaultExpandAll
    >
      {components.map(component => generateTreeView(component))}
    </TreeSelect>
  );
};

ComponentSelect.propTypes = propTypes;

export default ComponentSelect;
