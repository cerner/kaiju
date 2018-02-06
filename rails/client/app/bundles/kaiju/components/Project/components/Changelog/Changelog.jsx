import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import marked from 'marked';
import { Icon, Popover } from 'antd';
import axios from '../../../../utilities/axios';
import changelog from '../../../../../../../../changelog.md';
import './Changelog.scss';

const propTypes = {
  /**
   * Url to mark a user as having read the changelog
   */
  changelogViewedUrl: PropTypes.string.isRequired,
  /**
   * Indicates if the changelog has been viewed
   */
  viewed: PropTypes.bool,
  /**
   * Callback invoked on click
   */
  onClick: PropTypes.func,
};

const Changelog = ({ changelogViewedUrl, viewed, onClick }) => {
  // eslint-disable-next-line react/no-danger
  const content = <div className="kaiju-Changelog-content" dangerouslySetInnerHTML={{ __html: marked(changelog) }} />;

  const classes = classNames([
    'kaiju-Changelog',
    { 'is-highlighted': !viewed },
  ]);

  /**
   * Notifies the server the changelog has been viewed
   */
  const toggleChangelog = () => {
    if (viewed) { return; }
    axios
      .put(changelogViewedUrl, { changelog_viewed: true })
      .then(() => {
        if (onClick) {
          onClick();
        }
      });
  };

  return (
    <Popover title="What's new" trigger="click" content={content} placement="bottomRight">
      <div className={classes} onClick={toggleChangelog} role="presentation">
        <Icon type="gift" className="kaiju-Changelog-giftIcon" />
      </div>
    </Popover>
  );
};

Changelog.propTypes = propTypes;

export default Changelog;
