import { ApiProperty } from '@nestjs/swagger';

export class CreateTimeEntryDTO {

    @ApiProperty()
    serviceId: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    companyId: string;

    @ApiProperty()
    details?: string;
}