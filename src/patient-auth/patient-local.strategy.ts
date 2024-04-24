
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PatientAuthService } from './patient-auth.service';

@Injectable()
export class PatientLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private patientAuthService: PatientAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const patient = await this.patientAuthService.validatePatient(username, password);
    if (!patient) {
      throw new UnauthorizedException();
    }
    return patient;
  }
}
