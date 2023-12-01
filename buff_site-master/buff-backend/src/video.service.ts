import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { Image, ImageType } from './typeorm/image';
import { WorkoutProgram } from './typeorm/workoutProgram';
import { WorkoutVideo } from './typeorm/workoutVideo';
import { CreateProgramSessionBody, CreateSubProgramSessionBody } from './types';
import { customAlphabet } from 'nanoid';
import { User, UserRole } from './typeorm/user';
import { VideoPlayLog, VideoPlayLogStatus } from './typeorm/videoPlayLog';

const nanoid = customAlphabet('qwertyuiopasdfghjklzxcvbnm123456789', 10);

const randomSessionHash = () => nanoid();

@Injectable()
export class VideoService {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(VideoPlayLog)
    private readonly videoLogRepo: Repository<VideoPlayLog>,
  ) {
    if (process.env.NODE_ENV !== 'production') {
      this.createSession(
        {
          programID: 1,
          userRole: UserRole.GYM,
          userID: 1,
        },
        'test357',
      );
    }
  }

  sessionStateMap = new Map<string, SessionStatus>();

  async createSession(args: CreateProgramSessionBody, customSessionID?: string) {
    const workoutProgram = await this.appService.getWorkoutProgram(args.programID);
    const sessionID = customSessionID || randomSessionHash();
    this.sessionStateMap.set(sessionID, {
      createDate: new Date(),
      workoutProgram: workoutProgram,
      playersStatus: {
        players: [],
      },
      programStatus: {
        loop: false,
        paused: false,
        currentSetCount: 0,
        currentSetWorkoutCount: 0,
        currentState: ProgramState.READY,
        userRole: args.userRole,
        explicitWaitSeconds: 0,
        setCount: workoutProgram.workoutSets.length,
        setPlayCounts: workoutProgram.workoutSets.map((s) => s.setPlayCount),
        setWorkoutCount: workoutProgram.workoutSets[0]?.setPlayCount || 0,
        workoutSeconds: workoutProgram.workoutSets[0]?.workoutTimeSeconds || 0,
        breakTimeSeconds: workoutProgram.workoutSets[0]?.workoutTermSeconds || 0,
        setBreakTimeSeconds: workoutProgram.workoutSets[0]?.breakTimeSeconds || 0,
        warmupTimeSeconds: workoutProgram.warmupTimeSeconds,
        warmupBreakTimeSeconds: workoutProgram.warmupBreakTimeSeconds,
        warmupCount: 0,
        coverImage: workoutProgram.coverImage?.filePath,
        coverImageType: workoutProgram.coverImage?.type,
        warmupBreakTimeImage: workoutProgram.warmupBreakTimeImage?.filePath,
        workoutBreakTimeImage: workoutProgram.workoutBreakTimeImage?.filePath,
        setBreakTimeImage: workoutProgram.setBreakTimeImage?.filePath,
        reservations: [],
      },
      abortController: new AbortController(),
    });

    this.addLog({
      logType:
        args.userRole === UserRole.GYM
          ? VideoPlayLogStatus.CREATE_PROGRAM_SESSION
          : VideoPlayLogStatus.CREATE_CUSTOMER_PROGRAM_SESSION,
      user: { id: args.userID } as User,
      workoutProgram: workoutProgram,
    });

    return { sessionID };
  }

  async createSubSession(args: CreateSubProgramSessionBody) {
    const sessionID = randomSessionHash();

    const videos = await this.appService.getWorkoutVideosByIds(
      args.workoutVideos.map((v) => v.id || (v as any).videos_id),
    );

    this.sessionStateMap.set(sessionID, {
      createDate: new Date(),
      workoutProgram: {
        workoutVideos: videos,
      } as WorkoutProgram,
      playersStatus: {
        players: [],
      },
      programStatus: {
        loop: false,
        paused: false,
        currentSetCount: 0,
        currentSetWorkoutCount: 0,
        currentState: ProgramState.READY,
        userRole: UserRole.SUBGYM,
        explicitWaitSeconds: 0,
        setPlayCounts: new Array(args.workoutSetCount || 1).fill(videos.length),
        setCount: args.workoutSetCount,
        setWorkoutCount: videos.length,
        workoutSeconds: args.workoutSeconds,
        breakTimeSeconds: 0,
        setBreakTimeSeconds: args.workoutSetBreakTimeSeconds,
        warmupTimeSeconds: 0,
        warmupBreakTimeSeconds: 0,
        warmupCount: 0,
        coverImage: null,
        coverImageType: null,
        warmupBreakTimeImage: null,
        workoutBreakTimeImage: null,
        setBreakTimeImage: null,
        reservations: args.reservations,
      },
      abortController: new AbortController(),
    });

    this.addLog({
      logType: VideoPlayLogStatus.CREATE_SUB_PROGRAM_SESSION,
      user: { id: args.userID } as User,
    });

    return { sessionID };
  }

  getSessionState(sessionID: string) {
    if (!this.sessionStateMap.has(sessionID)) {
      return null;
    }

    return this.sessionStateMap.get(sessionID);
  }

  getSubProgram(sessionID: string) {
    return this.sessionStateMap.get(sessionID);
  }

  getWorkoutProgramBySessionID(sessionID: string) {
    const state = this.getSessionState(sessionID);

    if (!state) {
      return undefined;
    }

    return state;

    if (state.programStatus.userRole === UserRole.SUBGYM) {
      return state.programStatus;
    } else {
      return state.workoutProgram;
    }
  }

  resetSessionState(sessionID: string) {
    const sessionState = this.getSessionState(sessionID);
    if (sessionState) {
      sessionState.programStatus.currentSetCount = 0;
      sessionState.programStatus.currentSetWorkoutCount = 0;
    }
  }

  addLog(log: Partial<VideoPlayLog>) {
    return this.videoLogRepo.save(log);
  }
}

export enum Event {
  RESET = 'RESET',
  SET_PROGRAM_STATE = 'SET_PROGRAM_STATE',
}

export enum ProgramState {
  READY = 'READY',
  DESCRIPTION = 'DESCRIPTION',
  COUNTDOWN = 'COUNTDOWN',
  PLAYING_WARMUP = 'WARMUP',
  PLAYING_WORKOUT = 'PLAYING',
  PREPARE = 'PREPARE',
  BREAKING_WORKOUT = 'BREAKING_WORKOUT',
  BREAKING_SET = 'BREAKING_SET',
  MIDDLE_DESCRIPTION = 'MIDDLE_DESCRIPTION',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
  FINISHED = 'FINISHED',
  WAIT_NEXT = 'WAIT_NEXT',
}

export type Screen = {
  index: number;
  currentTime: number;
  src: WorkoutVideo;
  coverImage: Image;
};

export type PlayerStatus = {
  id: string;
  screens: Screen[];
  isPlaying: boolean;
  isBreaking: boolean;
  isWarmup: boolean;
};

export type PlayersStatus = {
  players: PlayerStatus[];
};

export type ProgramReservation = {
  hour: number;
  minute: number;
  played: boolean;
};

export type ProgramStatus = {
  currentSetWorkoutCount: number;
  currentSetCount: number;
  currentState: ProgramState;
  workoutSeconds: number;
  paused: boolean;
  reservations: ProgramReservation[];
  explicitWaitSeconds: number;
  setWorkoutCount: number;
  setBreakTimeSeconds: number;
  breakTimeSeconds: number;
  workoutBreakTimeImage: string;
  setPlayCounts: number[];
  loop: boolean;
  warmupCount: number;
  readonly userRole: UserRole;
  readonly setCount: number;
  readonly warmupTimeSeconds: number;
  readonly warmupBreakTimeSeconds: number;
  readonly setBreakTimeImage: string;
  readonly coverImage: string;
  readonly coverImageType: ImageType;
  readonly warmupBreakTimeImage: string;
};

export type SessionStatus = {
  workoutProgram: WorkoutProgram;
  programStatus: ProgramStatus;
  playersStatus: PlayersStatus;
  createDate: Date;
  abortController: AbortController;
};
