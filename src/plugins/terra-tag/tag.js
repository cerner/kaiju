import Tag from 'terra-tag';
import { description, version } from 'terra-tag/package.json';

export default {
  package: 'terra-tag',
  display: 'Tag',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-tag/tag/tag',
  componentType: Tag,
  props: {
    icon: {
      type: 'element',
      required: false,
      description: 'An optional icon.',
      displayName: 'Icon',
      placeholder: false,
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
      description: 'Callback function triggered when tag loses focus.',
      displayName: 'On blur',
    },
    onFocus: {
      type: 'func',
      required: false,
      description: 'Callback function triggered when tag gains focus.',
      displayName: 'On focus',
    },
    onKeyUp: {
      type: 'func',
      required: false,
      description: 'Callback function triggered when key is released.',
      displayName: 'On key up',
    },
    text: {
      type: 'string',
      required: true,
      description: 'Sets the tag text.',
      displayName: 'Text',
      example: 'Tag Text',
    },
  },
};
