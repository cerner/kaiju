import CenteredActionFooter from 'terra-action-footer/lib/CenteredActionFooter';
import { description, version } from 'terra-action-footer/package.json';

export default {
  package: 'terra-action-footer',
  display: 'Action Footer Centered',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-action-footer/action-footer/centered',
  componentType: CenteredActionFooter,
  props: {
    center: {
      type: 'node',
      required: false,
      description: 'Actions to be displayed in the center socket',
      displayName: 'Center',
    },
  },
};
