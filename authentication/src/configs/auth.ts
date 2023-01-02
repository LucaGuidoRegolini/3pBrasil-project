export const authConfig = {
  saltOrRounds: 10,
  jwt_secret: process.env.JWT_SECRET || 'secret',
  jwt_expiresIn: '1d',
};
