import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import {AddressService} from "./address.service";
import {ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags} from "@nestjs/swagger";
import {Address} from "./address.model";
import {CreateAddressDto} from "./dto/create-address.dto";

@ApiTags('Address')
@Controller('address')
export class AddressController {
    constructor(private addressesService: AddressService) {
    }

    @ApiOperation({
        summary: 'Create address'
    })
    @ApiCreatedResponse({type: Address})
    @Post()
    create(@Body() dto: CreateAddressDto) {
        return this.addressesService.createAddress(dto);
    }

    @ApiOperation({
        summary: 'Get rooms in current city'
    })
    @ApiOkResponse({
        description: 'Success'
    })
    @ApiParam({
        name: 'page',
        description: 'Current page',
    })
    @ApiQuery({
        name: 'city',
        description: 'Current city'
    })
    @ApiQuery({
        name: 'places',
        description: 'Places in room'
    })
    @ApiQuery({
        name: 'fridge',
        description: 'Is there a fridge in room? (true/false)'
    })
    @ApiQuery({
        name: 'price',
        description: 'asc/desc'
    })
    @Get('/rooms/city/:page')
    getRoomsByCity(@Param() params: any, @Query() query: any) {
        return this.addressesService.getRoomsByCity(query, params.page)
    }


    @ApiOperation({
        summary: 'Get rooms in current country'
    })
    @ApiOkResponse({
        description: 'Success'
    })
    @ApiParam({
        name: 'page',
        description: 'Current page',
    })
    @ApiQuery({
        name: 'country',
        description: 'Current country'
    })
    @ApiQuery({
        name: 'places',
        description: 'Places in room'
    })
    @ApiQuery({
        name: 'fridge',
        description: 'Is there a fridge in room? (true/false)'
    })
    @ApiQuery({
        name: 'price',
        description: 'asc/desc'
    })
    @Get('/rooms/country/:page')
    getRoomsByCountry(@Param() params: any, @Query() query: any) {
        return this.addressesService.getRoomsByCountry(query, params.page)
    }


    @ApiOperation({
        summary: 'Delete address by address ID'
    })
    @Delete('/:id')
    deleteAddress(@Param() params: any) {
        return this.addressesService.deleteAddress(params.id)
    }


    @ApiOperation({
        summary: 'Get hotels in country'
    })
    @ApiQuery({
        name: 'country',
        description: 'Country'
    })
    @ApiParam({
        name: 'page',
        description: 'Current page',
    })
    @Get('/hotels/country/:page')
    getHotelsByCountry(@Param() params: any, @Query() query: any) {
        return this.addressesService.getHotelsByCountry(query, params.page)
    }

    @ApiOperation({
        summary: 'Get hotels in current city'
    })
    @ApiQuery({
        name: 'city',
        description: 'City'
    })
    @ApiParam({
        name: 'page',
        description: 'Current page'
    })
    @Get('/hotels/city/:page')
    getHotelsByCity(@Param() params: any, @Query() query: any) {
        return this.addressesService.getHotelsByCity(query, params.page)
    }
}
