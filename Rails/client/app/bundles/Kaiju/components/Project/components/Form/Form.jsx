import React from 'react';
import PropTypes from 'prop-types';
import { update } from '../../utilities/messenger';
import { getRootProps, humanize } from '../../../../utilities/utilities';
import Checkbox from './Checkbox/Checkbox';
import ChildContainer from '../../containers/ChildContainer';
import Cloneable from './Cloneable/Cloneable';
import ComponentSelectContainer from '../../containers/ComponentSelectContainer';
import Input from './Input/Input';
import Item from './Item/Item';
import Number from './Number/Number';
import Select from './Select/Select';
import './Form.scss';

const propTypes = {
  /**
   * The identifier of the Component
   */
  id: PropTypes.string.isRequired,
  /**
   * The Component name
   */
  name: PropTypes.string.isRequired,
  /**
   * The Component properties
   */
  properties: PropTypes.object.isRequired,
  /**
   * The Component property URL
   */
  propertyUrl: PropTypes.string,
};

const Form = ({ id, propertyUrl, name, properties }) => {
  /**
   * Creates a form for a given property
   * @param {Object} property - The property
   * @return {Node} - A form element
   */
  const createForm = (property) => {
    const key = `${id}-${property.id}`;
    const type = property.formType || property.type;
    const label = property.display || humanize(property.id);
    const onChange = newValue => update(id, property, newValue);


    switch (type) {
      case 'Array':
        return property.value.map(item => (
          <Cloneable key={`${id}-${item.id}`} {...properties[item.id]} componentId={id}>
            {createForm(properties[item.id], true)}
          </Cloneable>
      ));
      case 'Hash':
        return Object.keys(property.value).map(item => (
          <Item key={`${key}-${item}`} label={property.value[item].type === 'Bool' ? null : humanize(item)}>
            {createForm(properties[property.value[item].id])}
          </Item>
        ));
      case 'Bool':
        return <Checkbox key={key} {...property} display={label} onChange={onChange} />;
      case 'CodifiedList':
        return <Select key={key} {...property} onChange={onChange} />;
      case 'Number':
        return <Number key={key} {...property} onChange={onChange} />;
      case 'String':
      case 'DelayedInput':
        return <Input key={key} {...property} onChange={onChange} isDelayed={type === 'DelayedInput'} />;
      case 'Component':
        return property.value ?
          <ChildContainer key={key} id={property.value.id} /> :
          <ComponentSelectContainer key={key} {...property} id={id} />;
      default:
        return null;
    }
  };

  if (name === 'Placeholder') {
    return (
      <div className="kaiju-Form">
        <ComponentSelectContainer key={id} url={propertyUrl} id={id} />
      </div>
    );
  }

  const forms = getRootProps(properties).map((property) => {
    const form = createForm(properties[property]);
    const { display, type, id: propName } = properties[property];
    const label = type === 'Bool' ? null : (display || humanize(propName));
    return <Item key={`${id}-${propName}`} label={label}>{form}</Item>;
  });

  return (
    <div className="kaiju-Form">
      {forms}
    </div>
  );
};

Form.propTypes = propTypes;

export default Form;
