import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { PatientAuthModule } from './patient-auth/patient-auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { DoctorModule } from './doctor/doctor.module';
import { HospitalServicesModule } from './hospital-services/hospital-services.module';






@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
  
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'PatientDB',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    })
    ,
    MailerModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com', // gmail's SMTP server
          port: 587,
          auth: {
            user: 'abdullahnoman1414@gmail.com', 
            pass: 'zeotkijzkisjfycj', 
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@example.com>',
        },
      }),
      inject: [ConfigService],
    }),
  
    PatientsModule,
  
    PatientAuthModule,
  
    DoctorModule,
  
    HospitalServicesModule,
  
    
  

  
 
  
  
  
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}