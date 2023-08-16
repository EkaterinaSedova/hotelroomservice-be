import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Room} from "./room.model";
import {CreateRoomDto} from "./dto/create-room.dto";
import {HotelsService} from "../hotels/hotels.service";
import {Hotel} from "../hotels/hotel.model";
import {FilesService} from "../files/files.service";
import {Booking} from "../bookings/booking.model";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import {UpdateRoomDto} from "./dto/update-room.dto";

@Injectable()
export class RoomsService {

    constructor(@InjectModel(Room) private roomRepository: typeof Room,
                @InjectModel(Hotel) private hotelRepository: typeof Hotel,
                @InjectModel(Booking) private bookingRepository: typeof Booking,
                private fileService: FilesService) {}

    async createRoom(dto: CreateRoomDto, images: any[]) {
        const hotel = await this.hotelRepository.findOne({
            where: {id: dto.hotelId}
        });
        const addressId = hotel.addressId;
        let fileNames = [];
        for(let i = 0; i < images.length; i++)
        {
            fileNames.push(await this.fileService.createImage(images[i]));
        }
        const optionsJSON = JSON.parse(dto.options);
        const room = await this.roomRepository.create({...dto, options: optionsJSON,addressId: addressId, images: fileNames});
        return room;
    }

    async getAllRooms(params, query) {
        const limit = 2;
        const places = query.places;
        const fridge = query.fridge;
        const offset = params.page * limit - limit;
        if (query.fridge != null) {
            const rooms = await this.roomRepository.findAll({
                where: {
                    options: {
                        places: places,
                        fridge: fridge
                    }
                },
                limit,
                offset,
                order: [['options.price', 'ASC']]
            })
            return rooms;
        }
        const rooms = await this.roomRepository.findAll({
            where: {
                options: {
                    places: places,
                }
            },
            limit,
            offset,
            order: [['options.price', 'ASC']],
            include: {all: true}
        })
        return rooms;
    }

    async deleteRoom(id) {
        const room = await this.roomRepository.destroy({where: {id}})
        if (!room) throw new HttpException("Room not found", HttpStatus.BAD_REQUEST);
        const bookings = await this.bookingRepository.destroy({where: {roomId: id}})
        return {message: "Room successfully deleted"};
    }

    async getRoomsByHotelId(hotelId) {
        const rooms = await this.roomRepository.findAll({where: {hotelId}});
        return rooms;
    }

    async updateRoom(dto: UpdateRoomDto, images: any[]) {
        const candidate = await this.roomRepository.findByPk(dto.id);
        let fileNames = [];
        for(let i = 0; i < images.length; i++)
        {
            fileNames.push(await this.fileService.createImage(images[i]));
        }
        if(!fileNames.length) fileNames = null;
        let optionsJSON = null;
        if(dto.options) optionsJSON = JSON.parse(dto.options);
        const room = await this.roomRepository.update({
            options: optionsJSON || candidate.options,
            images: fileNames || candidate.images
        }, {where: {id: dto.id}});

        return {message: 'Successfully updated'}
    }


}
