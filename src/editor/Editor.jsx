import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import ContentContainer from 'terra-content-container';
import Checkbox from 'terra-form-checkbox';
import CheckboxField from 'terra-form-checkbox/lib/CheckboxField';
import InputField from 'terra-form-input/lib/InputField';
import SelectField from 'terra-form-select/lib/native-select/NativeSelectField';
import StatusView from 'terra-status-view';
import ComponentField from '../component-field/ComponentField';
import { ApplicationStateContext } from '../context';
import plugins from '../plugins';
import Tree from '../tree/tree';
import styles from './Editor.module.scss';

const cx = classNames.bind(styles);

const Editor = () => {
  const { dispatch, state } = useContext(ApplicationStateContext);
  const { sandbox, selected } = state;

  const selectedNode = Tree.find(sandbox, selected);

  /**
   * Handles the change event for string properties.
   * @param {Event} event- The change event.
   */
  const handleStringChange = (event) => {
    dispatch({ type: 'UPDATE', id: event.target.id, value: event.target.value });
  };

  /**
   * Handles the change event for bool properties.
   * @param {Event} event- The change event.
   */
  const handleBoolChange = (event) => {
    dispatch({ type: 'UPDATE', id: event.target.id, value: event.target.checked });
  };

  /**
   * Creates a string form field.
   * If the property only accepts an array of strings a select will be constructed with the available options.
   * @param {string} label - The property name.
   * @param {Object} property - The property.
   * @param {Object} config - The plugin property configuration.
   */
  const buildStringField = (label, property, config) => {
    const { id, value } = property;
    const { displayName, options } = config;

    if (options) {
      return (
        <SelectField
          key={id}
          label={displayName || label}
          onChange={handleStringChange}
          options={options.map((option) => ({ display: option.displayName, value: option.value }))}
          selectId={id}
          value={value}
        />
      );
    }

    return <InputField key={id} inputId={id} label={displayName || label} value={value || ''} onChange={handleStringChange} />;
  };

  /**
   * Creates a bool form field.
   * If the property only accepts an array of strings a select will be constructed with the available options.
   * @param {string} label - The property name.
   * @param {Object} property - The property.
   * @param {Object} config - The plugin property configuration.
   */
  const buildBoolField = (label, property, config) => {
    const { id, value } = property;
    const { displayName } = config;

    return (
      <CheckboxField key={id} isLegendHidden legend={displayName || label}>
        <Checkbox id={id} labelText={displayName || label} checked={value || false} onChange={handleBoolChange} />
      </CheckboxField>
    );
  };

  /**
   * Creates a node form field.
   * @param {string} label - The property name.
   * @param {Object} property - The property.
   * @param {Object} config - The plugin property configuration.
   */
  const buildNodeForm = (label, property, config) => {
    const { value } = property;
    const { displayName } = config;

    const nodes = (value || []).map((node) => (
      <ComponentField key={node.id} {...node} />
    ));

    return (
      <div>
        {displayName || label}
        {nodes}
      </div>
    );
  };

  const buildForm = (node) => {
    const { value } = node;
    const { component, props } = value;
    const { props: pluginProps } = plugins[component];

    const fields = [];

    Object.keys(props).forEach((propertyName) => {
      const property = props[propertyName];
      const config = pluginProps[propertyName];
      const { id, type, value: propertyValue } = property;

      if (type === 'string') {
        fields.push(buildStringField(propertyName, property, config));
      } else if (type === 'bool') {
        fields.push(buildBoolField(propertyName, property, config));
      } else if (type === 'element') {
        fields.push(<ComponentField key={id} id={id} type={type} value={propertyValue} label={config.displayName || propertyName} />);
      } else if (type === 'node') {
        fields.push(buildNodeForm(propertyName, property, config));
      }
    });

    if (fields.length === 0) {
      return <div>No editable fields for this component</div>;
    }

    return fields;
  };

  if (!selectedNode) {
    return (
      <ContentContainer className={cx('editor')} fill>
        <StatusView message="Select a component to edit" />
      </ContentContainer>
    );
  }

  const { value } = selectedNode;
  const { component } = value;

  return (
    <ContentContainer
      className={cx('editor')}
      fill
      header={(
        <div className={cx('header')}>
          {plugins[component].display}
        </div>
      )}
    >
      <div className={cx('content')}>
        {buildForm(selectedNode)}
      </div>
    </ContentContainer>
  );
};

export default Editor;
