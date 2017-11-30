import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatDate } from '../../../utilities/utilities';
import './Card.scss';

const propTypes = {
  /**
   * The original author's name
   */
  author: PropTypes.string,
  /**
   * Whether the card is currently open
   */
  isOpen: PropTypes.bool,
  /**
   * The name of the project or workspace
   */
  name: PropTypes.string,
  /**
   * Callback for click events
   */
  onClick: PropTypes.func,
  /**
   * The name of the project the workspace belongs to
   */
  project: PropTypes.string,
  /**
   * The date of the last update
   */
  updateDateTime: PropTypes.string,
};

const Card = ({ author, isOpen, name, onClick, project, updateDateTime }) => (
  <div className={classNames(['kaiju-Card', { 'is-open': isOpen }])} onClick={onClick} role="presentation">
    <div className="kaiju-Card-details">
      { project && <div className="kaiju-Card-project">{project}</div> }
      <div className="kaiju-Card-name">{name}</div>
      <div className="kaiju-Card-updateDateTime">{formatDate(updateDateTime)}</div>
      <div className="kaiju-Card-author">{author}</div>
    </div>
  </div>
);


Card.propTypes = propTypes;

export default Card;
