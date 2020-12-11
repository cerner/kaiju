import Card from 'terra-card';
import { description, version } from 'terra-card/package.json';

export default {
  hidden: true,
  package: 'terra-card',
  display: 'Card Body',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-card/card/card',
  componentType: Card.Body,
  props: {
    children: {
      type: 'node',
      required: false,
      description: 'Child Nodes',
      displayName: 'Children',
    },
    hasPaddingVertical: {
      type: 'bool',
      required: false,
      description: 'Provides themeable padding vertical',
      displayName: 'Has padding vertical',
      defaultValue: true,
    },
    hasPaddingHorizontal: {
      type: 'bool',
      required: false,
      description: 'Provides themeable padding horizontal',
      displayName: 'Has padding horizontal',
      defaultValue: true,
    },
    isContentCentered: {
      type: 'bool',
      required: false,
      description: 'Sets the content of the card to be centered',
      displayName: 'Content centered',
      defaultValue: false,
    },
  },
};

