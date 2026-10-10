import 'dotenv/config';

export const jwtConstants = {
    secret: process.env.JWT_SECRET_KEY as string,
  };

  export const publicRoutes = {
    '/auth': ['POST'],
    '/users': ['POST']
  }