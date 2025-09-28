import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDTO {

    @IsNotEmpty({ message: 'Nome da empresa contratante é obrigatório'})
    @ApiProperty({ description: 'Nome da empresa contratante' })
    name: string;

}