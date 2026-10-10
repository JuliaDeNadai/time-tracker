import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserValueHourDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'value_hour deve ser um número com até 2 casas decimais' })
  @Min(0, { message: 'value_hour não pode ser negativo' })
  @Max(999999, { message: 'value_hour muito alto' })
  @IsNotEmpty()
  @ApiProperty({ example: 45.5 })
  value_hour: number;
}
