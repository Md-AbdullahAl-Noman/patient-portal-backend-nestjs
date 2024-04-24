// src/patients/patients.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/send-email.dto';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Note } from './entities/note.entity';
import { Feedback } from './entities/feedback.entity';
import { Consultation } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    private mailerService: MailerService
  ) {}

  async create(createPatientDto: CreatePatientDto, profileImagePath?: string): Promise<Patient> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createPatientDto.password, saltOrRounds); // Hashing the password

    try {
    const newPatient = this.patientsRepository.create({
      ...createPatientDto,
      password: hashedPassword,
      profilePicture: profileImagePath,
    });

    await this.patientsRepository.save(newPatient);
    return newPatient;
  } 
catch (error) {
   
    if (error.code === '23505') {
      throw new ConflictException('Email address already exists');
    }
    throw error; 
  }
  }


//view patient
  
  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient with ID  not found');
    }
    return patient;
  }


//validation
  async findOneByUsername(username: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({ where: { username } });
    if (!patient) {
        throw new NotFoundException(`Patient with username ${username} not found`);
    }
    return patient;
}

//update
async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
  const patient = await this.patientsRepository.preload({
      id: id,
      ...updatePatientDto,
  });

  if (!patient) {
      throw new NotFoundException(`Patient #${id} not found`);
  }

  return this.patientsRepository.save(patient);
}


//emergency feature
async sendEmergencyEmail(sendEmailDto: SendEmailDto): Promise<void> {
  const { email, text } = sendEmailDto; 
  
  await this.mailerService.sendMail({
    to: email,
    subject: 'Emergency Notification',
    text: text, 
  });
}



//book appoinmnet
async bookAppointment(patientId: number, dto: CreateAppointmentDto): Promise<Appointment> {
  const patient = await this.patientsRepository.findOne({ where: { id: patientId } });
  if (!patient) throw new NotFoundException('Patient with ID ${patientId} not found');

  const doctor = await this.doctorRepository.findOne({ where: { id: dto.doctorId } });
  if (!doctor) throw new NotFoundException('Doctor with ID ${dto.doctorId} not found');

  const appointment = this.appointmentRepository.create({
    patient,
    doctor,
    appointmentDateTime: dto.appointmentDateTime,
    reason: dto.reason,
  });

  return this.appointmentRepository.save(appointment);
}

//view appoinmnets
async findAppointmentsByPatientId(patientId: number): Promise<Appointment[]> {
  const patient = await this.patientsRepository.findOne({
    where: { id: patientId },
    relations: ['appointments'], //one to many
  });

  if (!patient) {
    throw new NotFoundException('Patient with id ${patientId} not found');
  }

  return patient.appointments;
}



//cancel appoinmnet
async cancelAppointment(appointmentId: number): Promise<{ message: string }> {
  const result = await this.appointmentRepository.delete(appointmentId);

  if (result.affected === 0) {
    throw new NotFoundException("Appointment not found");
  }

  return { message: "Appointment  successfully canceled." };
}


//note
async addNote(patientId: number, noteText: string): Promise<Note> {
  const patient = await this.patientsRepository.findOne({
    where: { id: patientId },
  });
  if (!patient) {
    throw new NotFoundException(`Patient not found`);
  }

  const note = new Note();
  note.note_text = noteText;
  note.patient = patient; 

  return this.noteRepository.save(note); 
}


//give feedback
async addFeedback(patientId: number, feedbackMessage: string, rating: number): Promise<Feedback> {
  const patient = await this.patientsRepository.findOne({ where: { id: patientId } });
  if (!patient) {
    throw new NotFoundException(`Patient id not found`);
  }

  const feedback = new Feedback();
  feedback.feedback_message = feedbackMessage;
  feedback.rating = rating;
  feedback.patient = patient;

  return this.feedbackRepository.save(feedback);
}

async addConsultation(patientId: number, doctorId: number, dto: CreateConsultationDto): Promise<Consultation> {
  const patient = await this.patientsRepository.findOneOrFail({ where: { id: patientId } });
  const doctor = await this.doctorRepository.findOneOrFail({ where: { id: doctorId } });

  const consultation = new Consultation();
  consultation.consultationDate = new Date(dto.consultationDate);
  consultation.notes = dto.notes;
  consultation.doctors = [doctor];
  consultation.patients = [patient];

  await this.consultationRepository.save(consultation);
  return consultation;
}





}






