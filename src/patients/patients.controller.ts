
import { Controller, Post, UseInterceptors, UploadedFile, Body, Param, ParseIntPipe, Get, ConflictException, UsePipes, ValidationPipe, UseGuards, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { SessionGuard } from 'src/patient-auth/guards/session.guard';
import { SendEmailDto } from './dto/send-email.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './entities/note.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('profilePicture', {
    storage: diskStorage({
      destination: './uploads/profile-pictures',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}`);
      },
    }),
  }))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPatientDto: CreatePatientDto
  ) {

    try {
      return await this.patientsService.create(createPatientDto, file?.path);
    } catch (error) {
      //thw conflict exception
      if (error instanceof ConflictException) {
        return { message: error.message }; 
      }
      throw error; 
    }
  }


  //get patient
  @Get('profile/:id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

//updatesPatient
  @Patch(':id')
  @UseGuards(SessionGuard)
    update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
        return this.patientsService.update(+id, updatePatientDto);
    }



//emergency contrlr
@Post('send-emergency-email')
@UseGuards(SessionGuard)
async sendEmergencyEmail(@Body() sendEmailDto: SendEmailDto) {
  await this.patientsService.sendEmergencyEmail(sendEmailDto);
  return { message: 'Emergency email sent successfully.' };
}



//appoinmentbook
@Post(':patientId/appointments')
@UseGuards(SessionGuard)
@UsePipes(ValidationPipe)
  bookAppointment(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.patientsService.bookAppointment(patientId, createAppointmentDto);
  }


  // View appointments for a patient
@Get(':patientId/appointments')
viewAppointments(@Param('patientId', ParseIntPipe) patientId: number) {
  return this.patientsService.findAppointmentsByPatientId(patientId);
}

// Cancel an appointment
@Delete('cancel-appointments/:appointmentId')
async cancelAppointment(@Param('appointmentId', ParseIntPipe) appointmentId: number): Promise<{ message: string }> {
  return this.patientsService.cancelAppointment(appointmentId);
}

//add note
@Post(':patientid/notes')
@UsePipes(ValidationPipe)
@UseGuards(SessionGuard)
async addNote(
  @Param('patientid', ParseIntPipe) patientId: number,
  @Body() createNoteDto: CreateNoteDto
): Promise<Note> {
  return this.patientsService.addNote(patientId, createNoteDto.note_text);
}

//add feedback
@Post('feedback/:patientid')
@UsePipes(ValidationPipe)
@UseGuards(SessionGuard)
async addFeedback(
  @Param('patientid', ParseIntPipe) patientId: number,
  @Body() createFeedbackDto: CreateFeedbackDto 
): Promise<Feedback> {
  return this.patientsService.addFeedback(patientId, createFeedbackDto.feedback_message, createFeedbackDto.rating);
}


@Post('/consultation/:patientId/:doctorId')
addConsultation(
  @Param('patientId') patientId: number,
  @Param('doctorId') doctorId: number,
  @Body() createConsultationDto: CreateConsultationDto,
) {
  return this.patientsService.addConsultation(patientId, doctorId, createConsultationDto);
}

}
