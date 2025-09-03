import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTimeEntryDTO {

    @IsNotEmpty({ message: 'Id do serviço é obrigatório'})
    @ApiProperty()
    service: string;

    @IsNotEmpty({ message: 'Id do usuário é obrigatório'})
    @ApiProperty()
    user: string;

    @IsNotEmpty({ message: 'Id da contratante é obrigatório'})
    @ApiProperty()
    company: string;

    @ApiProperty({ required: false })
    @IsOptional()
    details?: string;
}