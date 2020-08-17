import Divider from 'terra-divider';
import { description, version } from 'terra-divider/package.json';

export default {
  package: 'terra-divider',
  display: 'Divider',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-divider/divider/divider',
  componentType: Divider,
  props: {
    text: {
      type: 'string',
      required: false,
      description: 'String to be displayed inline with the divider.',
    },
  },
};
