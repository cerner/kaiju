import React from 'react';
import PropTypes from 'prop-types';
import ajax from 'superagent';
import classNames from 'classnames';
import marked from 'marked';
import { Icon, Popover } from 'antd';
import changelog from '../../../../../../../../../changelog.md';
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
    ajax
      .put(changelogViewedUrl)
      .set('Accept', 'application/json')
      .set('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'))
      .send({ changelog_viewed: true })
      .end(() => {
        if (onClick) {
          onClick();
        }
      });
  };

  return (
    <Popover title="What's new" trigger="click" content={content}>
      <div className={classes} onClick={toggleChangelog} role="presentation">
        <Icon type="gift" className="kaiju-Changelog-giftIcon" />
      </div>
    </Popover>
  );
};

Changelog.propTypes = propTypes;

export default Changelog;
