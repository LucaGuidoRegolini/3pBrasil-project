import { User } from '@modules/users/entities/user';

export interface UserWebInterface {
  id: string;
  name: string;
  email: string;
  type: string;
  cpf: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
}

export class UserMap {
  public static toWeb(user: User): UserWebInterface {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      cpf: user.cpf,
      phone: user.phone,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
