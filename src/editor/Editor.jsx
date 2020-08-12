import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import Checkbox from 'terra-form-checkbox';
import CheckboxField from 'terra-form-checkbox/lib/CheckboxField';
import InputField from 'terra-form-input/lib/InputField';
import StatusView from 'terra-status-view';
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

  const handleBoolChange = (event) => {
    dispatch({ type: 'UPDATE', id: event.target.id, value: event.target.checked });
  };

  const buildForm = (node) => {
    const { value } = node;
    const { props } = value;

    const fields = [];

    Object.keys(props).forEach((property) => {
      const { id, type, value: propertyValue } = props[property];

      if (type === 'string') {
        fields.push(<InputField key={id} inputId={id} label={property} value={propertyValue || ''} onChange={handleStringChange} />);
      } else if (type === 'bool') {
        fields.push(
          <CheckboxField key={id} isLegendHidden legend={property}>
            <Checkbox id={id} labelText={property} checked={propertyValue || false} onChange={handleBoolChange} />
          </CheckboxField>,
        );
      }
    });

    return fields;
  };

  return (
    <div className={cx('editor')}>
      {selectedNode && buildForm(selectedNode)}
      {!selectedNode && <StatusView message="Select a component to edit." />}
    </div>
  );
};

export default Editor;
