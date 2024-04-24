import { IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateConsultationDto {
  @IsDateString({}, { message: 'The consultationDate must be a valid date string' })
  consultationDate: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 500)
  notes: string;
}
