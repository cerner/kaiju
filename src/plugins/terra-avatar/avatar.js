import Avatar from 'terra-avatar';
import { description, version } from 'terra-avatar/package.json';

export default {
  package: 'terra-avatar',
  display: 'Avatar',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-avatar/avatar/avatar',
  componentType: Avatar,
  props: {
    alt: {
      type: 'string',
      required: true,
      description: 'Specifies the alternative text for the image.',
      example: 'Alt Text',
    },
    color: {
      type: 'string',
      required: false,
      description: 'Sets the background color. Defaults to auto. Accepted color variants are theme specific. One of: `auto`, `neutral`, `one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`, `ten`.',
      defaultValue: 'auto',
      options: [
        {
          displayName: 'Auto',
          value: 'auto',
          type: 'string',
        },
        {
          displayName: 'Neutral',
          value: 'neutral',
          type: 'string',
        },
        {
          displayName: 'One',
          value: 'one',
          type: 'string',
        },
        {
          displayName: 'Two',
          value: 'two',
          type: 'string',
        },
        {
          displayName: 'Three',
          value: 'three',
          type: 'string',
        },
        {
          displayName: 'Four',
          value: 'four',
          type: 'string',
        },
        {
          displayName: 'Five',
          value: 'five',
          type: 'string',
        },
        {
          displayName: 'Six',
          value: 'six',
          type: 'string',
        },
        {
          displayName: 'Seven',
          value: 'seven',
          type: 'string',
        },
        {
          displayName: 'Eight',
          value: 'eight',
          type: 'string',
        },
        {
          displayName: 'Nine',
          value: 'nine',
          type: 'string',
        },
        {
          displayName: 'Ten',
          value: 'ten',
          type: 'string',
        },
      ],
    },
    image: {
      type: 'string',
      required: false,
      description: 'The image to display.',
    },
    initials: {
      type: 'string',
      required: true,
      description: 'One or two letters to display.',
      example: 'JS',
    },
    isAriaHidden: {
      type: 'bool',
      required: false,
      description: 'Whether to hide avatar from the accessibility tree.',
      defaultValue: false,
    },
    isDeceased: {
      type: 'bool',
      required: false,
      description: 'Whether the person is deceased. Overrides any color variant.',
      defaultValue: false,
    },
    size: {
      type: 'string',
      required: false,
      description: 'Overrides the default size.',
    },
  },
};
