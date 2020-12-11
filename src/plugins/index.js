import { Avatar, FacilityAvatar, GenericAvatar } from './terra-avatar';
import { ActionFooterBlock, ActionFooterCentered, ActionFooterStandard } from './terra-action-footer';
import { Card, CardBody } from './terra-card';
import ActionHeader from './terra-action-header';
import Alert from './terra-alert';
import Arrange from './terra-arrange';
import Badge from './terra-badge';
import Button from './terra-button';
import Divider from './terra-divider';
import ContentContainer from './terra-content-container';
import Placeholder from './terra-sandbox';
import Tag from './terra-tag';

export default {
  'terra-action-footer:action-footer-block': ActionFooterBlock,
  'terra-action-footer:action-footer-centered': ActionFooterCentered,
  'terra-action-footer:action-footer-standard': ActionFooterStandard,
  'terra-action-header': ActionHeader,
  'terra-alert:alert': Alert,
  'terra-arrange:arrange': Arrange,
  'terra-avatar:avatar': Avatar,
  'terra-badge:badge': Badge,
  'terra-button:button': Button,
  'terra-card:card': Card,
  'terra-card:card:body': CardBody,
  'terra-content-container:content-container': ContentContainer,
  'terra-divider:divider': Divider,
  'terra-avatar:generic': GenericAvatar,
  'terra-avatar:facility': FacilityAvatar,
  'terra-sandbox:placeholder': Placeholder,
  'terra-tag:tag': Tag,
};
