import { v4 } from 'uuid';

export const generateUniqueString = (limit: number) => {
  const uuid = v4().replace(/-/g, '');
  const alphanumeric = uuid.replace(/[^\da-zA-Z]/g, '');
  return alphanumeric.substring(0, limit);
};
