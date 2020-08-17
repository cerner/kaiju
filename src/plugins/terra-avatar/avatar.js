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
      displayName: 'Alt',
      example: 'Alt Text',
    },
    color: {
      type: 'string',
      required: false,
      description: "Sets the background color. Defaults to `auto`. Accepted color variants are theme specific.\nOne of: `'auto'`, `'neutral'`, `'one'`, `'two'`, `'three'`, `'four'`, `'five'`, `'six'`, `'seven'`, `'eight'`, `'nine'`, `'ten'`.",
      displayName: 'Color',
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
    hashValue: {
      type: 'string',
      required: false,
      description: 'Value used for the hash function when color is set to `auto`. If not provided, hash function utilizes alt.',
      displayName: 'Hash value',
    },
    image: {
      type: 'string',
      required: false,
      description: 'The image to display.',
      displayName: 'Image',
    },
    initials: {
      type: 'string',
      required: true,
      description: 'One or two letters to display.',
      displayName: 'Initials',
      example: 'JS',
    },
    isAriaHidden: {
      type: 'bool',
      required: false,
      description: 'Whether to hide avatar from the accessibility tree.',
      displayName: 'Aria hidden',
      defaultValue: false,
    },
    isDeceased: {
      type: 'bool',
      required: false,
      description: 'Whether the person is deceased. Overrides any color variant.',
      displayName: 'Deceased',
      defaultValue: false,
    },
    size: {
      type: 'string',
      required: false,
      description: 'Overrides the default size.',
      displayName: 'Size',
    },
  },
};
