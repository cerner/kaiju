import Button from 'terra-button';

export default {
  package: 'terra-button',
  display: 'Button',
  version: '3.44.0',
  description: 'A button for triggering actions.',
  documentation: 'http://engineering.cerner.com/terra-ui/#/components/terra-button/button/button',
  componentType: Button, // Circle back for dynamic imports.
  props: {
    href: {
      type: 'string',
      required: false,
      description: 'Sets the href. When set will render the component as an anchor tag.',
      displayName: 'href',
    },
  },
};
