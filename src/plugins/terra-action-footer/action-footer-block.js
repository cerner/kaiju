import BlockActionFooter from 'terra-action-footer/lib/BlockActionFooter';
import { description, version } from 'terra-action-footer/package.json';

export default {
  package: 'terra-action-footer',
  display: 'Action Footer Block',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-action-footer/action-footer/block',
  componentType: BlockActionFooter,
  props: {
    children: {
      type: 'node',
      required: false,
      description: '',
      displayName: 'Children',
    },
  },
};
