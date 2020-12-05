import React, { useState } from 'react';
import ContentContainer from 'terra-content-container';
import IconSearch from 'terra-icon/lib/icon/IconSearch';
import classNames from 'classnames/bind';
import DragItem from '../drag-item/DragItem';
import plugins from '../plugins';
import styles from './Catalog.module.scss';

const components = Object.keys(plugins);

const cx = classNames.bind(styles);

const Catalog = () => {
  const [searchText, setSearchText] = useState('');

  const handleChange = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };

  const filteredItems = [];

  for (let index = 0; index < components.length; index += 1) {
    const identifier = components[index];
    const { display } = plugins[identifier];

    if (display.toLowerCase().indexOf(searchText) > -1) {
      filteredItems.push(<DragItem key={identifier} identifier={identifier} display={display} />);
    }
  }

  return (
    <ContentContainer
      fill
      className={cx('catalog')}
      header={(
        <div className={cx('search-wrapper')}>
          <input
            className={cx('search-input')}
            placeholder="Search catalog"
            onChange={handleChange}
            value={searchText}
          />
          <IconSearch className={cx('search-icon')} />
        </div>
      )}
    >
      {filteredItems.length > 0 && (
        <div className={cx('content')}>
          {filteredItems}
        </div>
      )}
      {filteredItems.length === 0 && (
        <div className={cx('no-results')}>
          {`No components matching "${searchText}".`}
        </div>
      )}
    </ContentContainer>
  );
};

export default Catalog;
