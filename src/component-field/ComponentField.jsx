import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import SelectField from 'terra-form-select/lib/native-select/NativeSelectField';
import { ApplicationStateContext } from '../context';
import example from '../example-generator';
import plugins from '../plugins';

// An array of key value pairs for each plugin.
const pluginOptions = Object.keys(plugins).map((plugin) => (
  { value: plugin, display: plugins[plugin].display || plugin }
));

const propTypes = {
  /**
   * The unique identifier of the component.
   */
  id: PropTypes.string.isRequired,
  /**
   * The label for the component.
   */
  label: PropTypes.string,
  /**
   * The component type.
   */
  type: PropTypes.string.isRequired,
  /**
   * The value of the component node.
   */
  value: PropTypes.object,
};

const ComponentField = (props) => {
  const { label, id, type, value } = props;
  const { component } = value || {}; // Value can be undefined
  const { dispatch } = useContext(ApplicationStateContext);

  /**
   * Handles the on change event of the component selection.
   * @param {Event} event - The on change event.
   */
  const handleChange = (event) => {
    // Generates an example component for the specified plugin.
    const replacement = example(event.target.value);

    dispatch({ type: 'REPLACE', id: event.target.id, replacement });
  };

  /**
   * Handles selecting a component.
   */
  const handleSelect = () => {
    dispatch({ type: 'SELECT', id });
  };

  if (!value || component === 'terra-sandbox:placeholder') {
    // If the node has no value render a select dropdown.
    return <SelectField label={label} selectId={id} options={pluginOptions} onChange={handleChange} />;
  }

  return (
    <div onClick={handleSelect}>
      <div>
        {label}
      </div>
      {plugins[component].display || component}
    </div>
  );
};

ComponentField.propTypes = propTypes;

export default ComponentField;
