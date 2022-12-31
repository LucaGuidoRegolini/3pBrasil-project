class AuthenticateUserController {
  public async handle(request: Request, response: Response) {
    const { email, password } = request.body;
    const authenticateUserService = new AuthenticateUserService();
    const token = await authenticateUserService.execute({ email, password });
  }
}
