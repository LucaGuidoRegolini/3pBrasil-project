declare namespace Express {
  export interface Request {
    user: {
      id: string;
      email: string;
      type: user_valid_types;
    };
  }
}
