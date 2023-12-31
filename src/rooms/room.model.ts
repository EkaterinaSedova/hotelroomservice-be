import {Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript"
import {Hotel} from "../hotels/hotel.model";
import {Booking} from "../bookings/booking.model";

interface RoomCreationAttrs {
}

@Table({tableName: 'rooms', createdAt: false, updatedAt: false})
export class Room extends Model<Room, RoomCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;


    @ForeignKey(() => Hotel)
    @Column({type: DataType.INTEGER})
    hotelId: number;

    @HasMany(() => Booking)
    bookings: Booking[];
}