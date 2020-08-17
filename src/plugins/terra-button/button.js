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
      displayName: 'Icon',
      placeholder: false,
    },
    isIconOnly: {
      type: 'bool',
      required: false,
      description: 'Whether or not the button should only display as an icon.',
      displayName: 'Icon only',
      defaultValue: false,
    },
    isBlock: {
      type: 'bool',
      required: false,
      description: 'Whether or not the button should display as a block.',
      displayName: 'Block',
      defaultValue: false,
    },
    isCompact: {
      type: 'bool',
      required: false,
      description: 'Whether or not the button has reduced padding',
      displayName: 'Compact',
      defaultValue: false,
    },
    isDisabled: {
      type: 'bool',
      required: false,
      description: 'Whether or not the button should be disabled.',
      displayName: 'Disabled',
      defaultValue: false,
    },
    isReversed: {
      type: 'bool',
      required: false,
      description: 'Reverses the position of the icon and text.',
      displayName: 'Reversed',
      defaultValue: false,
    },
    onMouseDown: {
      type: 'func',
      required: false,
      description: 'Callback function triggered when mouse is pressed.',
      displayName: 'On mouse down',
    },
    onClick: {
      type: 'func',
      required: false,
      description: 'Callback function triggered when clicked.',
      displayName: 'On click',
    },
    onBlur: {
      type: 'func',
      required: false,
      description: 'Callback function triggered when button loses focus.',
      displayName: 'On blur',
    },
    onFocus: {
      type: 'func',
      required: false,
      description: 'Callback function triggered when button gains focus.',
      displayName: 'On focus',
    },
    onKeyDown: {
      type: 'func',
      required: false,
      description: 'Callback function triggered when key is pressed.',
      displayName: 'On key down',
    },
    onKeyUp: {
      type: 'func',
      required: false,
      description: 'Callback function triggered when key is released.',
      displayName: 'On key up',
    },
    refCallback: {
      type: 'func',
      required: false,
      description: 'Callback ref to pass into the dom element.',
      displayName: 'Ref callback',
    },
    text: {
      type: 'string',
      required: true,
      description: 'Sets the button text.\nIf the button is `isIconOnly` or variant `utility` this text is set as the aria-label and title for accessibility.',
      displayName: 'Text',
      example: 'Button Text',
    },
    title: {
      type: 'string',
      required: false,
      description: 'Additional information to display as a native tooltip on hover.\nButtons declared as `isIconOnly` or `utility` will fallback to using `text` if not provided.',
      displayName: 'Title',
    },
    type: {
      type: 'string',
      required: false,
      description: 'Sets the button type. One of `button`, `submit`, or `reset`.',
      displayName: 'Type',
      defaultValue: 'button',
      options: [
        {
          displayName: 'Button',
          value: 'button',
          type: 'string',
        },
        {
          displayName: 'Submit',
          value: 'submit',
          type: 'string',
        },
        {
          displayName: 'Reset',
          value: 'reset',
          type: 'string',
        },
      ],
    },
    variant: {
      type: 'string',
      required: false,
      description: 'Sets the button variant. One of `neutral`,  `emphasis`, `ghost`, `de-emphasis`, `action` or `utility`.',
      displayName: 'Variant',
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
