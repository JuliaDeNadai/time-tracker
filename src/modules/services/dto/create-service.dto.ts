import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateServiceDTO {

    @IsNotEmpty({ message: 'Nome do serviço é obrigatório'})
    @ApiProperty({ description: 'Nome do serviço prestado' })
    name: string;

}