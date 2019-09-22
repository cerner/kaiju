import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from '../../../../utilities/axios';
import MenuItem from '../../components/Menu/MenuItem/MenuItem';

const propTypes = {
  resourceUrl: PropTypes.string,
};

const OpenMenuItem = ({ resourceUrl }) => {
  function createNewProject() {
    axios.post(resourceUrl)
      .then(({ data }) => {
        // TODO: Rehydrate Redux, single page navigation rather than multi
        window.location = data.url;
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
