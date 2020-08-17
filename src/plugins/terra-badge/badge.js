import Badge from 'terra-badge';
import { description, version } from 'terra-badge/package.json';

export default {
  package: 'terra-badge',
  display: 'Badge',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-badge/badge/badge',
  componentType: Badge,
  props: {
    children: {
      type: 'node',
      required: false,
      description: 'Child Nodes.',
      displayName: 'Children',
      placeholder: false,
    },
    icon: {
      type: 'element',
      required: false,
      description: 'An optional icon. Nested inline with the text when provided.',
      displayName: 'Icon',
      placeholder: false,
    },
    intent: {
      type: 'string',
      required: false,
      description: 'Sets the badge color scheme. One of `default`, `primary`, `secondary`, `positive`, `negative`, `warning`, `info`.',
      displayName: 'Intent',
      defaultValue: 'default',
      options: [
        {
          displayName: 'Default',
          value: 'default',
          type: 'string',
        },
        {
          displayName: 'Primary',
          value: 'primary',
          type: 'string',
        },
        {
          displayName: 'Secondary',
          value: 'secondary',
          type: 'string',
        },
        {
          displayName: 'Info',
          value: 'info',
          type: 'string',
        },
        {
          displayName: 'Warning',
          value: 'warning',
          type: 'string',
        },
        {
          displayName: 'Positive',
          value: 'positive',
          type: 'string',
        },
        {
          displayName: 'Negative',
          value: 'negative',
          type: 'string',
        },
      ],
    },
    isReversed: {
      type: 'bool',
      required: false,
      description: 'Reverses the position of the icon and text.',
      displayName: 'Reversed',
      defaultValue: false,
    },
    size: {
      type: 'string',
      required: false,
      description: 'Sets the badge size. One of `tiny`, `small`, `medium`, `large`, `huge`.',
      displayName: 'Size',
      defaultValue: 'small',
      options: [
        {
          displayName: 'Tiny',
          value: 'tiny',
          type: 'string',
        },
        {
          displayName: 'Small',
          value: 'small',
          type: 'string',
        },
        {
          displayName: 'Medium',
          value: 'medium',
          type: 'string',
        },
        {
          displayName: 'Large',
          value: 'large',
          type: 'string',
        },
        {
          displayName: 'Huge',
          value: 'huge',
          type: 'string',
        },
      ],
    },
    text: {
      type: 'string',
      required: false,
      description: 'Sets the badge text.',
      displayName: 'Text',
    },
    visuallyHiddenText: {
      type: 'string',
      required: false,
      description: 'Text that describes the badge to a screen reader. Use this\nfor creating an accessible badge.',
      displayName: 'Visually hidden text',
    },
  },
};

