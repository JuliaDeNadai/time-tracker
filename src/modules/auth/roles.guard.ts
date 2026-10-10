import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/users.schema';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const userId = request?.decodedData?.userId;

    // O perfil é lido do banco: o token dura 30 dias e pode carregar um perfil desatualizado.
    const user = userId ? await this.usersService.findById(userId) : null;
    if (!user) throw new ForbiddenException('Usuário não encontrado');

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Acesso restrito ao perfil: ' + requiredRoles.join(', '));
    }

    request.decodedData.role = user.role;
    return true;
  }
}
