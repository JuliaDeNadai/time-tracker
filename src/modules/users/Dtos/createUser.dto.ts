import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  username: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  email: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  password: string;

  @IsString()
  @MaxLength(3)
  @IsNotEmpty()
  value_hour: string;
}