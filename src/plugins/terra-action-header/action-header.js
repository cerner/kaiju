import ActionHeader from 'terra-action-header';
import { description, version } from 'terra-action-header/package.json';

export default {
  package: 'terra-action-header',
  display: 'Action Header',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-action-header/action-header/action-header',
  componentType: ActionHeader,
  props: {
    children: {
      type: 'element',
      required: false,
      description: 'Displays a single terra `Collapsible Menu View` (_Not provided by `Action Header`_) child element on the right end of the header.',
      displayName: 'Children',
    },
    level: {
      type: 'number',
      required: false,
      description: "Optionally sets the heading level. One of `1`, `2`, `3`, `4`, `5`, `6`. Default `level=1`. This helps screen readers to announce appropriate heading levels.\nChanging 'level' will not visually change the style of the content.",
      displayName: 'Level',
      defaultValue: '1',
      options: [
        {
          displayName: '1',
          value: '1',
          type: 'number',
        },
        {
          displayName: '2',
          value: '2',
          type: 'number',
        },
        {
          displayName: '3',
          value: '3',
          type: 'number',
        },
        {
          displayName: '4',
          value: '4',
          type: 'number',
        },
        {
          displayName: '5',
          value: '5',
          type: 'number',
        },
        {
          displayName: '6',
          value: '6',
          type: 'number',
        },
      ],
    },
    onClose: {
      type: 'func',
      required: false,
      description: 'Callback function for when the close button is clicked.\nOn small viewports, this will be triggered by a back button if onBack is not set.',
      displayName: 'On close',
    },
    onBack: {
      type: 'func',
      required: false,
      description: 'Callback function for when the back button is clicked. The back button will not display if this is not set.',
      displayName: 'On back',
    },
    onMaximize: {
      type: 'func',
      required: false,
      description: 'Callback function for when the expand button is clicked.\nThe expand button will not display if this is not set or on small viewports.\nOnly the expand button will be rendered if onMaximize and onMinimize are set.\n\n*Note: If `onBack` is set, the maximize button will not appear and a custom maximize button must be provided\nas a child inside a `Collapsible Menu View`.*',
      displayName: 'On maximize',
    },
    onMinimize: {
      type: 'func',
      required: false,
      description: 'Callback function for when the minimize button is clicked.\nThe minimize button will not display if this is not set or on small viewports.\nOnly the expand button will be rendered if both onMaximize and onMinimize are set.\n\n*Note: If `onBack` is set, the minimize button will not appear and a custom minimize button must be provided\nas a child inside a `Collapsible Menu View`.*',
      displayName: 'On minimize',
    },
    onNext: {
      type: 'func',
      required: false,
      description: 'Callback function for when the next button is clicked. The previous-next button group will display if either this or onPrevious is set but the button for the one not set will be disabled.',
      displayName: 'On next',
    },
    onPrevious: {
      type: 'func',
      required: false,
      description: 'Callback function for when the previous button is clicked. The previous-next button group will display if either this or onNext is set but the button for the one not set will be disabled.',
      displayName: 'On previous',
    },
    title: {
      type: 'string',
      required: false,
      description: 'Text to be displayed as the title in the header bar.',
      displayName: 'Title',
    },
  },
};
