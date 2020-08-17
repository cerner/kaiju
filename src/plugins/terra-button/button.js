import Button from 'terra-button';
import { description, version } from 'terra-button/package.json';

export default {
  package: 'terra-button',
  display: 'Button',
  version,
  description,
  documentation: 'http://engineering.cerner.com/terra-ui/#/components/terra-button/button/button',
  componentType: Button,
  props: {
    icon: {
      type: 'element',
      required: false,
      description: 'An optional icon. Nested inline with the text when provided.',
      dropZone: false,
    },
    text: {
      type: 'string',
      required: true,
      description: 'Sets the button text.\nIf the button is `isIconOnly` or variant `utility` this text is set as the aria-label and title for accessibility.',
      example: 'Button Text',
    },
    isIconOnly: {
      type: 'bool',
      required: false,
      description: 'Whether or not the button should only display as an icon.',
      defaultValue: false,
    },
    isBlock: {
      type: 'bool',
      required: false,
      description: 'Whether or not the button should display as a block.',
      defaultValue: false,
    },
    isCompact: {
      type: 'bool',
      required: false,
      description: 'Whether or not the button has reduced padding',
      defaultValue: false,
    },
    isDisabled: {
      type: 'bool',
      required: false,
      description: 'Whether or not the button should be disabled.',
      defaultValue: false,
    },
    isReversed: {
      type: 'bool',
      required: false,
      description: 'Reverses the position of the icon and text.',
      defaultValue: false,
    },
    title: {
      type: 'string',
      required: false,
      description: 'Additional information to display as a native tooltip on hover.\nButtons declared as `isIconOnly` or `utility` will fallback to using `text` if not provided.',
    },
    variant: {
      type: 'string',
      required: false,
      description: 'Sets the button variant. One of `neutral`,  `emphasis`, `ghost`, `de-emphasis`, `action` or `utility`.',
      defaultValue: 'neutral',
      options: [
        {
          displayName: 'Neutral',
          value: 'neutral',
          type: 'string',
        },
        {
          displayName: 'Emphasis',
          value: 'emphasis',
          type: 'string',
        },
        {
          displayName: 'Ghost',
          value: 'ghost',
          type: 'string',
        },
        {
          displayName: 'Action',
          value: 'action',
          type: 'string',
        },
        {
          displayName: 'Utility',
          value: 'utility',
          type: 'string',
        },
      ],
    },
  },
};
