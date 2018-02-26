import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Modal, Tooltip } from 'antd';
import classNames from 'classnames/bind';
import CopyToClipboard from 'react-copy-to-clipboard';
import Magician from '../../../../common/Magician/Magician';
import axios from '../../../../../utilities/axios';
import styles from './Share.scss';

const cx = classNames.bind(styles);

const ShareType = {
  PROJECT: 'PROJECT',
  WORKSPACE: 'WORKSPACE',
};

const Permissions = {
  READ: 'READ',
  WRITE: 'WRITE',
};

const Descriptions = {
  PROJECT: {
    TITLE: 'Share Project',
    INFO: 'Share link expires in 24 hours.',
    READ: 'A public link to view your project but not make any edits.',
    WRITE: 'Grants permission to make edits to your entire project.',
  },
  WORKSPACE: {
    TITLE: 'Share Workspace',
    INFO: 'Share link expires in 24 hours.',
    READ: 'A public link to view your workspace but not make any edits.',
    WRITE: 'Grants permission to make edits to your workspace.',
  },
  READ: {
    TITLE: 'Read-Only link',
    ALT: 'Share link',
  },
  WRITE: {
    TITLE: 'Share link',
    ALT: 'Read-Only link',
  },
};

const propTypes = {
  /**
   * The click target to open the modal.
   */
  children: PropTypes.node,
  /**
   * The request route for generating a new invitation.
   */
  collaborationInvitation: PropTypes.string,
  /**
   * The public read-only URL.
   */
  readOnlyUrl: PropTypes.string,
  /**
   * The type of content being shared.
   */
  type: PropTypes.oneOf([ShareType.PROJECT, ShareType.WORKSPACE]),
};

class Share extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false, permissions: Permissions.WRITE };
    this.ref = this.ref.bind(this);
    this.select = this.select.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.togglePermissions = this.togglePermissions.bind(this);
  }

  /**
   * Handles the cancel action of the share modal.
   */
  handleCancel() {
    this.setState({ isOpen: false, shareUrl: null });
  }

  /**
   * Selects the share invitation text.
   */
  select() {
    this.input.refs.input.select();
  }

  /**
   * Sets the input ref.
   */
  ref(input) {
    this.input = input;
  }

  /**
   * Toggles between a read-only an edit access.
   */
  togglePermissions() {
    const permissions = this.state.permissions === Permissions.WRITE ? Permissions.READ : Permissions.WRITE;
    this.setState({ permissions });

    // The input can only be selected when the loading animation completes.
    setTimeout(this.select, 200);
  }

  /**
   * Opens the share modal.
   */
  showModal() {
    axios
      .get(this.props.collaborationInvitation)
      .then(({ data }) => {
        this.setState({ isOpen: true, shareUrl: data.url });

        // The input can only be selected when the modal has finished animating.
        setTimeout(this.select, 200);
      });
  }

  render() {
    const { isOpen, permissions, shareUrl } = this.state;
    const { children, readOnlyUrl, type } = this.props;

    const isShareable = permissions === Permissions.WRITE;
    const value = isShareable ? shareUrl : readOnlyUrl;

    const addon = (
      <CopyToClipboard text={value}>
        <Tooltip placement="bottom" title="Copied!" trigger="click" onClick={this.select}>
          <span className={cx('copy')}>Copy</span>
        </Tooltip>
      </CopyToClipboard>
    );

    return (
      <div onClick={this.showModal} role="presentation">
        {children}
        <Modal title={Descriptions[type].TITLE} onCancel={this.handleCancel} visible={isOpen} footer={null}>
          <Magician key={permissions}>
            <h2 className={cx('title')}>{Descriptions[permissions].TITLE}</h2>
            <p className={cx('description')}>{Descriptions[type][permissions]}</p>
            <Input readOnly value={value} addonAfter={addon} onFocus={this.select} ref={this.ref} />
            {isShareable && <div className={cx('info')}>{Descriptions[type].INFO}</div>}
            <div className={cx('toggle', { 'is-edit': isShareable })} onClick={this.togglePermissions} role="presentation">
              Get a {Descriptions[permissions].ALT} <Icon type={isShareable ? 'eye-o' : 'edit'} />
            </div>
          </Magician>
        </Modal>
      </div>
    );
  }
}

Share.propTypes = propTypes;

export default Share;
