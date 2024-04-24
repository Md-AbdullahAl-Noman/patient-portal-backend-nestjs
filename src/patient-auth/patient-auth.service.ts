// src/patient-auth/patient-auth.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PatientsService } from '../patients/patients.service'; // Assume this service exists for patient management
import * as bcrypt from 'bcrypt';

@Injectable()
export class PatientAuthService {
  constructor(
    private patientsService: PatientsService, 
    private jwtService: JwtService,
  ) {}

  async validatePatient(username: string, pass: string): Promise<any> {
    const patient = await this.patientsService.findOneByUsername(username);
    if (patient && await bcrypt.compare(pass, patient.password)) {
      const { password, ...result } = patient;
      return result;
    }
    return null;
  }

  async login(req:any,patient: any) {

    req.session.patientId = patient.id; 
    req.session.username = patient.username;

    const payload = { username: patient.username, sub: patient.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  async logout(req): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy(err => {
        if (err) {
          reject(new InternalServerErrorException('Logout failed'));
        } else {
          
          if (req.cookies && req.cookies['connect.sid']) {
            req.res.clearCookie('connect.sid');
          }
          resolve();
        }
      });
    });
  }



}
