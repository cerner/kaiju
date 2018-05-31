import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { select } from '../../utilities/messenger';
import Form from '../Form/Form';
import SectionHeader from '../SectionHeader/SectionHeader';
import './Editor.scss';

const propTypes = {
  selectedComponent: PropTypes.object,
  title: PropTypes.string,
};

const Editor = ({ selectedComponent, title }) => {
  let titleContent = null;
  if (selectedComponent && selectedComponent.parent) {
    titleContent = (
      <span>
        <span className="kaiju-Editor-back" onClick={() => select(selectedComponent.parent)} role="presentation">
          <Icon type="arrow-left" />
        </span>
        {title}
      </span>
    );
  } else {
    titleContent = title;
  }

  return (
    <div className="kaiju-Editor">
      <SectionHeader title={titleContent} />
      <div className="kaiju-Editor-form">
        {selectedComponent && <Form key={new Date().getTime()} {...selectedComponent} /> }
      </div>
    </div>
  );
};

Editor.propTypes = propTypes;

export default Editor;
