import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { publicRoutes } from "./constants";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate{
  constructor(private readonly authService: AuthService){
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const accessTokenHeader = request.headers['x-access-token'];
      const { authorization }: any = request.headers;

      if(publicRoutes[request.url]?.includes(request.method)) return true

      const rawToken = Array.isArray(accessTokenHeader)
        ? accessTokenHeader[0]
        : accessTokenHeader;

      let authToken: string | undefined;

      if (typeof rawToken === 'string' && rawToken.trim() !== '') {
        authToken = rawToken.trim();
      } else if (authorization && String(authorization).trim() !== '') {
        authToken = String(authorization).replace(/bearer/gim, '').trim();
      }

      if (!authToken) {
        throw new UnauthorizedException('Please provide token');
      }

      const resp = await this.authService.validateToken(authToken);
      request.decodedData = resp;

      return true;

    } catch (error) {
      console.log('auth error - ', error.message);
      throw new ForbiddenException(error.message || 'session expired! Please sign In');
    }
  }
}
