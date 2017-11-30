import React from 'react';
import PropTypes from 'prop-types';
import Layer from '../Form/Child/Child';
import TreeView from '../../../common/TreeView/TreeView';
import './Layers.scss';

const propTypes = {
  /**
   * Flattened components
   */
  components: PropTypes.object,
  /**
   * The root component identifier
   */
  root: PropTypes.string,
  /**
   * The identifier of the selected component
   */
  selectedComponent: PropTypes.string,
};

class Layers extends React.Component {
  constructor() {
    super();
    this.generateTree = this.generateTree.bind(this);
    this.scrollToComponent = this.scrollToComponent.bind(this);
  }

  componentDidMount() {
    window.addEventListener('message', this.scrollToComponent);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.scrollToComponent);
  }

  scrollToComponent({ data }) {
    if (data.message === 'kaiju-component-selected') {
      const element = document.querySelectorAll(`[data-kaiju-component-id="${data.id}"]`)[0];
      if (element) {
        /** TODO: Animate scrolling */
        element.scrollIntoView();
      } else {
        // eslint-disable-next-line
        console.warn('Attempted to scroll to an unmounted element');
      }
    }
  }

  generateTree(id) {
    if (!id) { return null; }

    const { display, name, properties, insertAfterUrl } = this.props.components[id];
    const isSelected = this.props.selectedComponent === id;

    const data = { key: id, 'data-kaiju-component-id': id };
    if (insertAfterUrl) {
      data['data-kaiju-sortable'] = true;
    }

    const children = [];
    Object.keys(properties).forEach((key) => {
      const { type, value } = properties[key];
      if (type === 'Component' && value) {
        children.push(this.generateTree(value.id));
      }
    });

    const layer = <Layer id={id} isDuplicable={!!insertAfterUrl} isSelected={isSelected} type={display || name} />;
    if (children.length > 0) {
      return <TreeView header={layer} {...data}>{children}</TreeView>;
    }

    return <li {...data}>{layer}</li>;
  }

  render() {
    return (
      <div className="kaiju-Layers">
        {this.generateTree(this.props.root)}
      </div>
    );
  }
}

Layers.propTypes = propTypes;

export default Layers;
