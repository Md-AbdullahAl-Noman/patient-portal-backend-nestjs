import { Controller, Post, Body, Param, NotFoundException, Get } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto'; // You need to create this DTO
import { Doctor } from './entities/doctor.entity';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('create-doctor')
  async create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.create(createDoctorDto);
  }


  @Get('view-doctor/:id')
  async findOne(@Param('id') id: string): Promise<Doctor> {
    const doctor = await this.doctorService.findOne(+id);
    if (!doctor) {
      throw new NotFoundException('Doctor with this id not found');
    }
    return doctor;
  }

}
