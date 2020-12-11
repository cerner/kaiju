import Card from 'terra-card';
import { description, version } from 'terra-card/package.json';

export default {
  package: 'terra-card',
  display: 'Card',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-card/card/card',
  componentType: Card,
  props: {
    children: {
      type: 'node',
      required: false,
      description: 'Child Nodes',
      displayName: 'Children',
    },
    variant: {
      type: 'string',
      required: false,
      description: 'Sets the card variant to change the style for different use cases. One of `default`,  `raised`.',
      displayName: 'Variant',
      defaultValue: 'default',
      options: [
        {
          displayName: 'Default',
          value: 'default',
          type: 'string',
        },
        {
          displayName: 'Raised',
          value: 'raised',
          type: 'string',
        },
      ],
    },
    visuallyHiddenText: {
      type: 'string',
      required: false,
      description: 'Text that describes the badge to a screen reader. Use this\nif more information is needed to accurately describe\nthis card to screen reader users.',
      displayName: 'Visually hidden text',
    },
  },
};

