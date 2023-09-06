import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Feedback } from './feedback.model';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { CreateFeedbackDto, FeedbackDto } from './dto/feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectModel(Feedback) private feedbackRepository: typeof Feedback,
    private sequelize: Sequelize,
  ) {}

  async createFeedback(dto: CreateFeedbackDto) {
    const feedback = await this.feedbackRepository.create(dto);
    return feedback;
  }

  async deleteFeedback(id) {
    const feedback = await this.feedbackRepository.destroy({ where: { id } });
    if (!feedback)
      throw new HttpException('Feedback not found', HttpStatus.BAD_REQUEST);
    return { message: 'Feedback successfully deleted' };
  }

  async getAverageRating(hotelId) {
    return await this.sequelize.query(
      `
                SELECT AVG(feedbacks.rate) AS "averageRating"
                FROM feedbacks 
                WHERE feedbacks.hotel_id = ${hotelId}
                `,
      {
        plain: false,
        type: QueryTypes.SELECT,
      },
    );
  }

  async getFeedbackByHotelId(hotelId) {
    return await this.feedbackRepository.findAll({
      where: { hotelId },
    });
  }

  async updateFeedback(dto: FeedbackDto) {
    const candidate = await this.feedbackRepository.findByPk(dto.id);
    if (!candidate)
      throw new HttpException(
        'Feedback with such ID not found',
        HttpStatus.BAD_REQUEST,
      );
    await this.feedbackRepository.update(
      {
        message: dto.message || candidate.message,
        rate: dto.rate || candidate.rate,
      },
      { where: { id: dto.id } },
    );
    return { message: 'Successfully updated' };
  }
}
