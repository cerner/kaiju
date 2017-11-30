import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import DraggableItem from '../DraggableItem/DraggableItem';
import Header from '../GroupHeader/GroupHeader';
import TreeView from '../../../common/TreeView/TreeView';
import SearchBar from '../../../common/SearchBar/SearchBar';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import './ComponentSearch.scss';

const propTypes = {
  /**
   * An Array of component data
   */
  components: PropTypes.array,
};

const defaultProps = {
  components: [],
};

class ComponentSearch extends React.Component {
  /**
   * Recursively generates a TreeView
   * Expected: { display: '', components: [ { name: '', displau: '', library: ''} ] }
   */
  static generateTreeView(group) {
    const children = group.children.map((item) => {
      if (item.children) {
        return ComponentSearch.generateTreeView(item);
      }
      return <DraggableItem {...item} key={`${item.library}::${item.name}`} />;
    });
    return <TreeView header={<Header text={group.display} />} key={group.display} isCollapsed={children.length > 15}>{children}</TreeView>;
  }

  constructor() {
    super();
    this.state = { searchValue: '' };
    this.handleSearch = this.handleSearch.bind(this);
    this.filterComponents = this.filterComponents.bind(this);
  }

  /**
   * Creates draggable items for all components that meet the search criteria
   * @return {Array} An array of DraggableItems
   */
  filterComponents(object) {
    let filteredComponents = [];
    object.forEach((item) => {
      if (item.children) {
        filteredComponents = filteredComponents.concat(this.filterComponents(item.children));
      } else if (item.display.toLowerCase().includes(this.state.searchValue)) {
        filteredComponents.push(<DraggableItem {...item} key={`${item.library}::${item.name}`} />);
      }
    });

    return filteredComponents;
  }

  handleSearch(event) {
    const searchValue = event.target.value.toLowerCase();
    this.setState({ searchValue });
  }

  render() {
    const activeFilter = this.state.searchValue.length > 0;
    const filteredComponents = activeFilter ? this.filterComponents(this.props.components) : null;
    const treeView = filteredComponents ? null : this.props.components.map(component => ComponentSearch.generateTreeView(component));
    const treeViewClasses = classNames([
      'kaiju-ComponentSearch-treeView',
      { 'is-hidden': activeFilter > 0 },
    ]);

    const filterClasses = classNames([
      'kaiju-ComponentSearch-filteredComponents',
      { 'is-hidden': !filteredComponents },
    ]);

    return (
      <div className="kaiju-ComponentSearch">
        <SectionHeader title="Components" />
        <div className="kaiju-ComponentSearch-searchContainer">
          <SearchBar onChange={this.handleSearch} placeholder="Search components" />
        </div>
        <div className={treeViewClasses}>
          {treeView}
        </div>
        <div className={filterClasses}>
          {filteredComponents}
        </div>
      </div>
    );
  }
}

ComponentSearch.propTypes = propTypes;
ComponentSearch.defaultProps = defaultProps;

export default ComponentSearch;
