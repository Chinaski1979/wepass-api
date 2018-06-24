// Email templates

import htmlHead from './htmlHead';
import htmlContent from './htmlContent';

import styles from './styles';

export const genericTemplate = ({ title, content, footer }) => `
  ${htmlHead(styles)}
  ${htmlContent(title, content, footer)}`;
