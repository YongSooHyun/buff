import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocalStrategy } from './auth/local.strategy';
import { Gym } from './typeorm/gym';
import { Image } from './typeorm/image';
import { MediaArticle } from './typeorm/mediaArticle';
import { User } from './typeorm/user';
import { UserSubscription } from './typeorm/userSubscription';
import { VideoPlayLog } from './typeorm/videoPlayLog';
import { WorkoutCategory } from './typeorm/workoutCategory';
import { WorkoutPart } from './typeorm/workoutPart';
import { WorkoutProgram } from './typeorm/workoutProgram';
import { WorkoutProgramSchedule } from './typeorm/workoutProgramSchedule';
import { WorkoutProgramScheduleType } from './typeorm/workoutProgramScheduleType';
import { WorkoutTool } from './typeorm/workoutTool';
import { WorkoutVideo } from './typeorm/workoutVideo';
import { Notice } from './typeorm/notice';
import { VideoGateway } from './video.gateway';
import { VideoService } from './video.service';
import { WorkoutProgramSet } from './typeorm/workoutProgramSet';
import { WorkoutWorkout } from './typeorm/workoutWorkout';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([
      User,
      UserSubscription,
      Gym,
      MediaArticle,
      VideoPlayLog,
      WorkoutCategory,
      WorkoutPart,
      WorkoutProgram,
      WorkoutVideo,
      WorkoutProgramSchedule,
      WorkoutProgramScheduleType,
      WorkoutTool,
      Image,
      Notice,
      WorkoutProgramSet,
      WorkoutWorkout,
    ]),
    PassportModule,
    JwtModule.register({
      secret: '1290cmislkdmegoht',
      signOptions: { expiresIn: '3y' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, LocalStrategy, VideoGateway, VideoService],
})
export class AppModule {}
