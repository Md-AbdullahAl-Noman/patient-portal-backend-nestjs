import { Doctor } from 'src/doctor/entities/doctor.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Patient } from './patient.entity';


@Entity()
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  consultationDate: Date;

  @Column()
  notes: string;

  @ManyToMany(() => Doctor, doctor => doctor.consultations)
  @JoinTable()
  doctors: Doctor[];

  @ManyToMany(() => Patient, patient => patient.consultations)
  @JoinTable()
  patients: Patient[];
}
