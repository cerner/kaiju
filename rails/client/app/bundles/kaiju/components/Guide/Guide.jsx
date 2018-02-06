import React from 'react';
import marked from 'marked';
import classNames from 'classnames/bind';
import 'github-markdown-css';
import guide from '../../../../../../guide.md';
import styles from './Guide.scss';

const cx = classNames.bind(styles);

const Guide = () => (
  // eslint-disable-next-line react/no-danger
  <div className={cx('markdown-body', 'guide')} dangerouslySetInnerHTML={{ __html: marked(guide) }} />
);

export default Guide;
