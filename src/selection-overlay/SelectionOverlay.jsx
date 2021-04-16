import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Hookshot from 'terra-hookshot';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SelectionOverlay.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The target identifier.
   */
  target: PropTypes.string,
};

const SelectionOverlay = (props) => {
  const { target } = props;

  const hookshotRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const node = document.getElementById(target);

    setIsOpen(!!node);
  }, [target]);

  useEffect(() => {
    const node = document.getElementById(target);

    if (node && hookshotRef.current) {
      console.log('Adjusting');
      const { height, width } = node.getBoundingClientRect();

      hookshotRef.current.style.height = `${height}px`;
      hookshotRef.current.style.width = `${width}px`;
    }
  });

  if (!target) {
    return null;
  }

  return (
    <Hookshot
      isOpen={isOpen}
      isEnabled={isOpen}
      targetRef={() => document.getElementById(target)}
      attachmentBehavior="none"
      contentAttachment={{ horizontal: 'center', vertical: 'middle' }}
      targetAttachment={{ horizontal: 'center', vertical: 'middle' }}
    >
      <Hookshot.Content className={cx('selection-overlay')} refCallback={(ref) => { hookshotRef.current = ref; }}>
        MWUAHAHAHA
      </Hookshot.Content>
    </Hookshot>
  );
};

SelectionOverlay.propTypes = propTypes;

export default SelectionOverlay;
