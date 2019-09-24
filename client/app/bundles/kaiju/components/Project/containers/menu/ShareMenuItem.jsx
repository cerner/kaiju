import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import Share from '../../components/ActionBar/Share/Share';
import styles from './ShareMenuItem.scss';

const cx = classNames.bind(styles);

const ShareMenuItem = (props) => (
  <li>
    <Share {...props}>
      <div className={cx('title')}>Share</div>
    </Share>
  </li>
);

const mapStateToProps = ({ project }) => ({
  collaborationInvitation: project.collaborationInvitationUrl,
  readOnlyUrl: project.url,
  type: 'PROJECT',
});

export default connect(mapStateToProps)(ShareMenuItem);
