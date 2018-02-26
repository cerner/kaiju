import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Modal, Icon, Input, Tooltip } from 'antd';
import classNames from 'classnames';
import axios from '../../../../../utilities/axios';
import './Share.scss';

const propTypes = {
  collaborationInvitation: PropTypes.string,
};

class Rename extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    this.setState({ isOpen: false, shareUrl: null });
  }

  showModal() {
    axios
      .get(this.props.collaborationInvitation)
      .then(({ data }) => {
        this.setState({ isOpen: true, shareUrl: data.url, copied: false });
      });
  }

  render() {
    const clipboard = (
      <CopyToClipboard text={this.state.shareUrl} onCopy={() => this.setState({ copied: true })}>
        <Tooltip placement="bottom" title="Copied!" trigger="click">
          <Icon type="copy" className={classNames(['kaiju-Share-clipboard', { 'is-copied': this.state.copied }])} />
        </Tooltip>
      </CopyToClipboard>
    );

    return (
      <div onClick={this.showModal} role="presentation">
        <Icon type="share-alt" />
        <Modal className="kaiju-Share" title="Share" visible={this.state.isOpen} footer={null} onCancel={this.handleCancel}>
          <div className="kaiju-Share-title">Workspace link:</div>
          <Input value={this.state.shareUrl} readOnly addonAfter={clipboard} className="kaiju-Share-input" />
          <div className="kaiju-Share-info">Users will have 24 hours to activate this link and become a collaborator</div>
        </Modal>
      </div>
    );
  }
}

Rename.propTypes = propTypes;

export default Rename;
