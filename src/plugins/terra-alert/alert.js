import Alert from 'terra-alert';
import { description, version } from 'terra-alert/package.json';

export default {
  package: 'terra-alert',
  display: 'Alert',
  version,
  description,
  documentation: 'https://engineering.cerner.com/terra-ui/components/terra-alert/alert/alert',
  componentType: Alert,
  props: {
    action: {
      type: 'element',
      required: false,
      description: 'An action element to be added to the action section of the alert to give the user an easy way\nto accomplish a task to resolve the notification.',
      displayName: 'Action',
    },
    children: {
      type: 'node',
      required: false,
      description: 'Child Nodes providing the message content for the alert. Can contain text and HTML.',
      displayName: 'Children',
    },
    customIcon: {
      type: 'element',
      required: false,
      description: 'The icon to be used for an alert of type custom. This will not be used for any other alert types.',
      displayName: 'Custom icon',
    },
    customColorClass: {
      type: 'string',
      required: false,
      description: 'Sets an author-defined class, to control the status bar color to be used for an alert of type custom.\n\n![IMPORTANT](https://badgen.net/badge//IMPORTANT/CSS?icon=github)\nAdding `var(--my-app...` CSS variables is required for proper re-themeability when creating custom color styles _(see included examples)_.',
      displayName: 'Custom color class',
      defaultValue: 'custom-default-color',
    },
    onDismiss: {
      type: 'func',
      required: false,
      description: 'Callback function triggered when Dismiss button is clicked. The presence of this prop will cause the Dismiss button to be included on the alert.',
      displayName: 'On dismiss',
    },
    title: {
      type: 'string',
      required: false,
      description: 'The title for the alert which will be bolded.',
      displayName: 'Title',
    },
    type: {
      type: 'string',
      required: false,
      description: 'The type of alert to be rendered. One of `alert`, `error`, `warning`, `unsatisfied`, `unverified`, `advisory`,\n`info`, `success`, or `custom`.',
      displayName: 'Type',
      defaultValue: 'alert',
      options: [
        {
          displayName: 'Alert',
          value: 'alert',
          type: 'string',
        },
        {
          displayName: 'Error',
          value: 'error',
          type: 'string',
        },
        {
          displayName: 'Warning',
          value: 'warning',
          type: 'string',
        },
        {
          displayName: 'Unsatisfied',
          value: 'unsatisfied',
          type: 'string',
        },
        {
          displayName: 'Unverified',
          value: 'unverified',
          type: 'string',
        },
        {
          displayName: 'Advisory',
          value: 'advisory',
          type: 'string',
        },
        {
          displayName: 'Info',
          value: 'info',
          type: 'string',
        },
        {
          displayName: 'Success',
          value: 'success',
          type: 'string',
        },
        {
          displayName: 'Custom',
          value: 'custom',
          type: 'string',
        },
      ],
    },
  },
};

