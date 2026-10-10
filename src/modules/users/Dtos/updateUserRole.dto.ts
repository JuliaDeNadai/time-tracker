import { IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from "../users.schema";

export class UpdateUserRoleDto {
  @IsEnum(UserRole, { message: 'role deve ser admin ou general' })
  @IsNotEmpty()
  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
