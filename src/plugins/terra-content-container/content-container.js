import ContentContainer from 'terra-content-container';
import { description, version } from 'terra-content-container/package.json';

export default {
  package: 'terra-content-container',
  display: 'Content Container',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-content-container/content-container/content-container',
  componentType: ContentContainer,
  props: {
    header: {
      type: 'node',
      required: false,
      description: 'The header element to be placed within the header area of the container.',
      displayName: 'Header',
    },
    footer: {
      type: 'node',
      required: false,
      description: 'The footer element to be placed within the footer area of the container.',
      displayName: 'Footer',
    },
    children: {
      type: 'node',
      required: false,
      description: 'The children to be placed within the main content area of the container.',
      displayName: 'Children',
    },
    fill: {
      type: 'bool',
      required: false,
      description: 'Whether or not the container should expanded to fill its parent element.',
      displayName: 'Fill',
      defaultValue: false,
    },
    scrollRefCallback: {
      type: 'func',
      required: false,
      description: 'Ref callback for the scrollable area of the content container.',
      displayName: 'Scroll ref callback',
    },
  },
};
