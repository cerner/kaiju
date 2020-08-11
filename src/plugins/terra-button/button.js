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
    href: {
      type: 'string',
      required: false,
      description: 'Sets the href. When set will render the component as an anchor tag.',
    },
    text: {
      type: 'string',
      required: true,
      description: 'Sets the button text.\nIf the button is `isIconOnly` or variant `utility` this text is set as the aria-label and title for accessibility.',
      example: 'Button Text',
    },
  },
};
