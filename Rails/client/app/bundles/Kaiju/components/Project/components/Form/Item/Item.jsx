import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import './Item.scss';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
  /**
   * The item label
   */
  label: PropTypes.string,
};

const Item = ({ children, label }) => (
  <Form.Item className="kaiju-FormItem" colon={false} label={label}>
    {children}
  </Form.Item>
);

Item.propTypes = propTypes;

export default Item;
