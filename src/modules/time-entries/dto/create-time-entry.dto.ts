import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTimeEntryDTO {

    @IsNotEmpty({ message: 'Id do serviço é obrigatório'})
    @ApiProperty({ description: 'Id correspondente do serviço prestado', required: true })
    service: string;

    @IsNotEmpty({ message: 'Id da contratante é obrigatório'})
    @ApiProperty({ description: 'Id correspondente da empresa contratante', required: true })
    company: string;

    @ApiProperty({ description: 'Quaisquer outros detalhes que deseja adicionar', required: false })
    @IsOptional()
    details?: string;
}