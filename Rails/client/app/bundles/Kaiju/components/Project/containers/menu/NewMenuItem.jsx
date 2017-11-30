import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ajax from 'superagent';
import MenuItem from '../../components/Menu/MenuItem/MenuItem';

const propTypes = {
  resourceUrl: PropTypes.string,
};

const OpenMenuItem = ({ resourceUrl }) => {
  function createNewProject() {
    ajax.post(resourceUrl)
    .set('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'))
    .end((error, { text }) => {
      // TODO: Rehydrate Redux, single page navigation rather than multi
      window.location = JSON.parse(text).url;
    });
  }

  return (
    <MenuItem title="New" onClick={createNewProject} />
  );
};

OpenMenuItem.propTypes = propTypes;

const mapStateToProps = ({ user }) => ({
  resourceUrl: user.projectsUrl,
});

export default connect(mapStateToProps)(OpenMenuItem);
