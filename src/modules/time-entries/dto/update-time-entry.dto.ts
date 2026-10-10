import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateTimeEntryDTO {

    @ApiPropertyOptional({ description: 'Início da jornada (ISO 8601, ex: 2026-10-10T08:00:00-03:00)' })
    @IsOptional()
    @IsDateString({}, { message: 'clock_in deve ser uma data ISO 8601' })
    clock_in?: string;

    @ApiPropertyOptional({ description: 'Fim da jornada (ISO 8601, ex: 2026-10-10T17:00:00-03:00)' })
    @IsOptional()
    @IsDateString({}, { message: 'clock_out deve ser uma data ISO 8601' })
    clock_out?: string;

    @ApiPropertyOptional({ description: 'Id da empresa contratante' })
    @IsOptional()
    @IsMongoId({ message: 'company deve ser um id válido' })
    company?: string;

    @ApiPropertyOptional({ description: 'Id do serviço prestado' })
    @IsOptional()
    @IsMongoId({ message: 'service deve ser um id válido' })
    service?: string;

    @ApiPropertyOptional({ description: 'Detalhes adicionais' })
    @IsOptional()
    @IsString()
    details?: string;
}
