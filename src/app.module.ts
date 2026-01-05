import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamsModule } from './teams/teams.module';
import { ContactsModule } from './contacts/contacts.module';
import { CompanyDocumentsModule } from './company_documents/company_documents.module';
import { PublicModule } from './public/public.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ClientModule } from './client/client.module';

@Module({
  imports: [
    PrismaModule,
    ProjectsModule,
    TeamsModule,
    ContactsModule,
    CompanyDocumentsModule,
    PublicModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientModule,
  ],
  controllers: [AppController],
  // providers: [AppService],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
