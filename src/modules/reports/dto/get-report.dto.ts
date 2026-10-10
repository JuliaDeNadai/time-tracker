import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { GetTimeEntryDTO } from '../../time-entries/dto/get-time-entry.dto';

export class GetReportDTO extends GetTimeEntryDTO {

    @ApiPropertyOptional({ description: 'Id do usuário do relatório (somente admin, para usuários general). Padrão: o próprio usuário.' })
    @IsOptional()
    @IsMongoId({ message: 'userId deve ser um id válido' })
    userId?: string;
}
