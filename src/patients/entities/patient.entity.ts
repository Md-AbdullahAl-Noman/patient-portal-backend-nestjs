// src/patients/entities/patient.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, ManyToMany } from 'typeorm';
import { Appointment } from './appointment.entity';
import { Note } from './note.entity';
import { Feedback } from './feedback.entity';
import { Consultation } from './consultation.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 100,unique: true })
  
  email: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => Note, note => note.patient)
  notes: Note[];

  @OneToMany(() => Feedback, feedback => feedback.patient)
  feedbacks: Feedback[];

  @ManyToMany(() => Consultation, consultation => consultation.patients)
  consultations: Consultation[];

}
