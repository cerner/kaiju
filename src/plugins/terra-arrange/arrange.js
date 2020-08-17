import Arrange from 'terra-arrange';
import { description, version } from 'terra-arrange/package.json';

export default {
  package: 'terra-arrange',
  display: 'Arrange',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-arrange/arrange/arrange',
  componentType: Arrange,
  props: {
    fitStart: {
      type: 'element',
      required: false,
      description: 'The content to display in the body of the fitStart.',
      displayName: 'Fit start',
    },
    fill: {
      type: 'element',
      required: true,
      description: 'The content to display in the body of the fill.',
      displayName: 'Fill',
    },
    fitEnd: {
      type: 'element',
      required: false,
      description: 'The content to display in the body of the fitEnd.',
      displayName: 'Fit end',
    },
    align: {
      type: 'string',
      required: false,
      description: 'The vertical orientation of all three containers. It will override the alignment of alignFitStart, alignFill and alignFitEnd if given. One of: `center`, `bottom`, `stretch`.',
      displayName: 'Align',
      options: [
        {
          displayName: 'Center',
          value: 'center',
          type: 'string',
        },
        {
          displayName: 'Bottom',
          value: 'bottom',
          type: 'string',
        },
        {
          displayName: 'Stretch',
          value: 'stretch',
          type: 'string',
        },
      ],
    },
    alignFitStart: {
      type: 'string',
      required: false,
      description: 'The vertical orientation of fitStart. One of: `center`, `bottom`, `stretch`.',
      displayName: 'Align fit start',
      options: [
        {
          displayName: 'Center',
          value: 'center',
          type: 'string',
        },
        {
          displayName: 'Bottom',
          value: 'bottom',
          type: 'string',
        },
        {
          displayName: 'Stretch',
          value: 'stretch',
          type: 'string',
        },
      ],
    },
    alignFitEnd: {
      type: 'string',
      required: false,
      description: 'The vertical orientation of fitEnd. One of: `center`, `bottom`, `stretch`.',
      displayName: 'Align fit end',
      options: [
        {
          displayName: 'Center',
          value: 'center',
          type: 'string',
        },
        {
          displayName: 'Bottom',
          value: 'bottom',
          type: 'string',
        },
        {
          displayName: 'Stretch',
          value: 'stretch',
          type: 'string',
        },
      ],
    },
    alignFill: {
      type: 'string',
      required: false,
      description: 'The vertical orientation of fill. One of: `center`, `bottom`, `stretch`.',
      displayName: 'Align fill',
      options: [
        {
          displayName: 'Center',
          value: 'center',
          type: 'string',
        },
        {
          displayName: 'Bottom',
          value: 'bottom',
          type: 'string',
        },
        {
          displayName: 'Stretch',
          value: 'stretch',
          type: 'string',
        },
      ],
    },
  },
};
