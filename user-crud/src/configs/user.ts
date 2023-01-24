export type user_valid_types = 'admin' | 'user';

export const userTypes = {
  ADMIN: 'admin',
  USER: 'user',
};

export const update_user_retry = 2;

export const isUserType = (type: string): boolean => {
  return Object.values(userTypes).includes(type);
};

export const list_user_limit = 50;
