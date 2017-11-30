import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Modal, Icon, Input, Tooltip } from 'antd';
import { connect } from 'react-redux';
import ajax from 'superagent';
import classNames from 'classnames';
import MenuItem from '../../components/Menu/MenuItem/MenuItem';

const propTypes = {
  collaborationInvitation: PropTypes.string,
};

class ShareMenuItem extends React.Component {
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
    ajax
    .get(this.props.collaborationInvitation)
    .end((error, { text }) => {
      this.setState({ isOpen: true, shareUrl: JSON.parse(text).url, copied: false });
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
      <MenuItem title="Share" onClick={this.showModal}>
        <Modal className="kaiju-Share" title="Share" visible={this.state.isOpen} footer={null} onCancel={this.handleCancel}>
          <div className="kaiju-Share-title">Project link:</div>
          <Input value={this.state.shareUrl} readOnly addonAfter={clipboard} className="kaiju-Share-input" />
          <div className="kaiju-Share-info">Users will have 24 hours to activate this link and become a collaborator</div>
        </Modal>
      </MenuItem>
    );
  }
}

ShareMenuItem.propTypes = propTypes;

const mapStateToProps = ({ project }) => ({
  collaborationInvitation: project.collaborationInvitationUrl,
});

export default connect(mapStateToProps)(ShareMenuItem);
