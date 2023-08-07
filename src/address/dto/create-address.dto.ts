import {ApiProperty} from "@nestjs/swagger";

export class CreateAddressDto {

    @ApiProperty({
        description: 'Hotel ID',
    })
    readonly hotelId: number;

    @ApiProperty({
        description: 'Country',
    })
    readonly country: string;

    @ApiProperty({
        description: 'City',
    })
    readonly city: string;

    @ApiProperty({
        description: 'Address',
    })
    readonly address: string;
}