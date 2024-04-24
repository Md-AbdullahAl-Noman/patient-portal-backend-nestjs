import { Appointment } from 'src/patients/entities/appointment.entity';
import { Consultation } from 'src/patients/entities/consultation.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
// import { Appointment } from '../appointments/appointment.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  specialization: string;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];

  @ManyToMany(() => Consultation, consultation => consultation.doctors)
  consultations: Consultation[];
}
