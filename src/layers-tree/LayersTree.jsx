/* eslint-disable react/forbid-dom-props */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import IconChevronRight from 'terra-icon/lib/icon/IconChevronRight';
import IconChevronDown from 'terra-icon/lib/icon/IconChevronDown';
import plugins from '../plugins';
import styles from './LayersTree.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The node to generate.
   */
  node: PropTypes.object.isRequired,
  /**
   * The depth of the node.
   */
  depth: PropTypes.number,
  /**
   * The identifier of the selected node.
   */
  selected: PropTypes.string,
};

const defaultProps = {
  depth: 0,
};

const Tree = (props) => {
  const [open, setOpen] = useState(true);

  const { node, depth, selected } = props;
  const { id, value } = node;

  if (!value) {
    return null;
  }

  const { component, props: properties } = value;
  const { display } = plugins[component];

  const children = [];

  Object.keys(properties).forEach((property) => {
    const { id: propertyID, type, value: propertyValue } = properties[property];

    if (type === 'node' && propertyValue) {
      children.push(Object.keys(propertyValue).map((key) => (
        <Tree key={key} node={propertyValue[key]} depth={depth + 1} selected={selected} />
      )));
    }

    if (type === 'element' && propertyValue) {
      children.push(<Tree key={propertyID} node={properties[property]} depth={depth + 1} selected={selected} />);
    }
  });

  return (
    <ul className={cx('tree')}>
      <li>
        <div
          className={cx('label', { selected: selected === id })}
          id={id}
          onClick={() => setOpen(!open)}
          style={{ paddingLeft: `${depth * 15}px` }}
        >
          <span className={cx('icon', { hidden: children.length === 0 })}>
            {open && <IconChevronDown />}
            {!open && <IconChevronRight />}
          </span>
          {display}
        </div>
        {(open && children.length > 0) && (
          <ul className={cx('children')}>
            {children}
          </ul>
        )}
      </li>
    </ul>
  );
};

Tree.propTypes = propTypes;
Tree.defaultProps = defaultProps;

export default Tree;
