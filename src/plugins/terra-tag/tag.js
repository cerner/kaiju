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
    },
    text: {
      type: 'string',
      required: true,
      description: 'Sets the tag text.',
    },
  },
};
