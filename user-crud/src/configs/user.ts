export const userTypes = {
  ADMIN: 'admin',
  USER: 'user',
};

export const isUserType = (type: string): boolean => {
  return Object.values(userTypes).includes(type);
};

export const list_user_limit = 50;
