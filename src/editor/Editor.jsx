import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import InputField from 'terra-form-input/lib/InputField';
import { ApplicationStateContext } from '../context';
import Tree from '../tree/tree';
import styles from './Editor.module.scss';

const cx = classNames.bind(styles);

const Editor = () => {
  const { dispatch, state } = useContext(ApplicationStateContext);
  const { sandbox, selected } = state;

  const selectedNode = Tree.find(sandbox, selected);

  const handleStringChange = (event) => {
    dispatch({ type: 'UPDATE', id: event.target.id, value: event.target.value });
  };

  const buildForm = (node) => {
    const { value } = node;
    const { props } = value;

    const fields = [];

    Object.keys(props).forEach((property) => {
      const { id, type, value: propertyValue } = props[property];

      if (type === 'string') {
        fields.push(<InputField key={id} inputId={id} label={property} value={propertyValue} onChange={handleStringChange} />);
      }
    });

    return fields;
  };

  return (
    <div className={cx('editor')}>
      Editor
      {`Selected: ${selected}`}
      {selectedNode && buildForm(selectedNode)}
    </div>
  );
};

export default Editor;
