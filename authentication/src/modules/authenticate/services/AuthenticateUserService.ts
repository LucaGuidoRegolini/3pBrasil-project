import { Either, left, right } from '@shared/either';
import { UserRepositoryInterface } from '../repositories/userRepository.interface';
import { NotFoundError, UnauthorizedError } from '@shared/errors';
import { HashGeneration } from '@shared/hashGeneration/hashGeneration';

interface AuthenticateRequestInterface {
  email: string;
  password: string;
}

interface AuthenticateResponseInterface {
  token: string;
  email: string;
}

export class AuthenticationService {
  private usersRepository: UserRepositoryInterface;

  private constructor(usersRepository: UserRepositoryInterface) {
    this.usersRepository = usersRepository;
  }

  public static build(usersRepository: UserRepositoryInterface): AuthenticationService {
    return new AuthenticationService(usersRepository);
  }

  async execute({
    email,
    password,
  }: AuthenticateRequestInterface): Promise<
    Either<NotFoundError | UnauthorizedError, AuthenticateResponseInterface>
  > {
    console.log('email', email);
    const user = await this.usersRepository.findOne({ email: email });

    if (!user) {
      return left(new NotFoundError('User not found'));
    }

    const passwordMatch = await HashGeneration.compareHash(password, user.password);

    if (!passwordMatch) {
      return left(new UnauthorizedError('User not found'));
    }

    const tokenData = {
      id: user.id,
      email: user.email,
      type: user.type,
    };

    const token = HashGeneration.generateToken(tokenData);

    return right({
      token,
      email: user.email,
    });
  }
}
