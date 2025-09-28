import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';

export class GetTimeEntryDTO {

    @ApiPropertyOptional({ description: 'Id da empresa contratante' })
    @IsOptional()
    @IsString({ message: 'companyId deve ser uma string' })
    companyId?: string;

    @ApiPropertyOptional({ description: 'Ano do filtro (ex: 2025)' })
    @IsNumberString()
    year?: number;

    @ApiPropertyOptional({ description: 'Mês do filtro (ex: 9 para setembro)' })
    @IsNumberString()
    month?: number;
}