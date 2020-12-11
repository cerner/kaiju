import ActionFooter from 'terra-action-footer';
import { description, version } from 'terra-action-footer/package.json';

export default {
  package: 'terra-action-footer',
  display: 'Action Footer Standard',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-action-footer/action-footer/standard',
  componentType: ActionFooter,
  props: {
    start: {
      type: 'node',
      required: false,
      description: 'Actions to be displayed in the start socket',
      displayName: 'Start',
    },
    end: {
      type: 'node',
      required: false,
      description: 'Actions to be displayed in the end socket',
      displayName: 'End',
    },
  },
};
