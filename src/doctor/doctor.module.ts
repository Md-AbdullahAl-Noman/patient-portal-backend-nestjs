import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor } from './entities/doctor.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Doctor])], 
  providers: [DoctorService], 
  exports:[DoctorService],
  controllers: [DoctorController],
})
export class DoctorModule {}
