import format from 'string-template';

/**
 *
 */
export const applyStringTemplate = (template: string, properties: any): string => {
  return format(template, properties);
};
