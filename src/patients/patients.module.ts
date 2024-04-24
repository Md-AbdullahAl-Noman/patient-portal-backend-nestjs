// src/patients/patients.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import { Appointment } from './entities/appointment.entity';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Note } from './entities/note.entity';
import { Feedback } from './entities/feedback.entity';
import { Consultation } from './entities/consultation.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Patient, Appointment,Doctor,Note,Feedback,Consultation])],
  controllers: [PatientsController],
  providers: [PatientsService], 
  exports: [PatientsService],
})
export class PatientsModule {}
