import React from 'react';
import PropTypes from 'prop-types';
import Hookshot from 'terra-hookshot';
import classNames from 'classnames/bind';
import TreeParser from '../../utilities/TreeParser';
import styles from './Overlay.scss';

const cx = classNames.bind(styles);

const ATTACHMENT = {
  contentAttachment: {
    vertical: 'top',
    horizontal: 'start',
  },
  targetAttachment: {
    vertical: 'top',
    horizontal: 'start',
  },
};

const LABEL_ATTACHMENT = {
  contentAttachment: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  targetAttachment: {
    vertical: 'top',
    horizontal: 'center',
  },
};

const propTypes = {
  /**
   * The component identifier.
   */
  id: PropTypes.string,
  /**
   * Whether the overlay should display as an overlay hightlight.
   */
  isHighlight: PropTypes.bool,
  /**
   * The display of the overlay.
   */
  name: PropTypes.string,
};

class Overlay extends React.Component {
  static dimensions(node) {
    const {
      bottom,
      top,
      height,
      width,
    } = node.getBoundingClientRect();

    return {
      height: parseInt(Math.max(0, top > 0 ? Math.min(height, window.innerHeight - top) : Math.min(bottom, window.innerHeight)), 10),
      width: parseInt(width, 10),
    };
  }

  constructor(props) {
    super(props);

    this.state = {};
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    this.node = TreeParser.findDOMNode(this.props.id);

    if (this.node) {
      this.update();
    }
  }

  shouldComponentUpdate(props, state) {
    return this.props.id !== props.id || this.state.width !== state.width || this.state.height !== state.height;
  }

  update() {
    this.setState(Overlay.dimensions(this.node));
  }

  render() {
    if (!this.node) {
      return null;
    }

    const { isHighlight, name } = this.props;

    return [
      <Hookshot isOpen={this.state.height > 0} isEnabled={this.state.height > 0} targetRef={() => this.node} attachmentBehavior="none" {...ATTACHMENT} key="overlay">
        <Hookshot.Content onResize={this.update} className={cx('overlay', { highlight: isHighlight })} style={this.state} />
      </Hookshot>,
      <Hookshot isOpen isEnabled targetRef={() => this.node} {...LABEL_ATTACHMENT} onPosition={this.update} key="label">
        <Hookshot.Content className={cx('label')}>
          <span>
            {name}
          </span>
        </Hookshot.Content>
      </Hookshot>,
    ];
  }
}

Overlay.propTypes = propTypes;

export default Overlay;
