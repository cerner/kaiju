import React, { useContext } from 'react';
import SelectField from 'terra-form-select/lib/native-select/NativeSelectField';
import { ApplicationStateContext } from '../context';
import example from '../example-generator';
import plugins from '../plugins';

const pluginOptions = Object.keys(plugins).map((plugin) => ({ value: plugin, display: plugins[plugin].display || plugin }));

const ComponentField = (props) => {
  const { label, id, type, value } = props;
  const { dispatch } = useContext(ApplicationStateContext);

  const handleChange = (event) => {
    // Generates an example component for the specified plugin.
    const replacement = example(event.target.value);

    dispatch({ type: 'REPLACE', id: event.target.id, replacement });
  };

  const handleSelect = () => {
    dispatch({ type: 'SELECT', id });
  };

  if (!value) {
    return <SelectField label={label} selectId={id} options={pluginOptions} onChange={handleChange} />;
  }

  const { component } = value;

  return (
    <div onClick={handleSelect}>
      <div>
        {label}
      </div>
      {plugins[component].display || component}
    </div>
  );
};

export default ComponentField;
