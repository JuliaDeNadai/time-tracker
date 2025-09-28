import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetTimeEntryDTO {

    @ApiPropertyOptional({ description: 'Id da empresa contratante' })
    @IsOptional()
    @IsString({ message: 'companyId deve ser uma string' })
    companyId?: string;

    @ApiProperty({ description: 'Ano do filtro (ex: 2025)', required: true })
    @IsNumberString()
    @IsNotEmpty()
    year?: number;

    @ApiProperty({ description: 'Mês do filtro (ex: 9 para setembro)', required: true  })
    @IsNumberString()
    @IsNotEmpty()
    month?: number;
}