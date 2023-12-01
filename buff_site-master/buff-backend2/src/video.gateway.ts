import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as _ from 'lodash';
import { setTimeout } from 'timers/promises';
import { AppService } from './app.service';
import { UserRole } from './typeorm/user';
import { PlayerStatus, ProgramState, Screen, SessionStatus, VideoService } from './video.service';

type ConnectionQuery = {
  sessionID: string;
  type: 'controller' | 'player';
};

const Events = {
  COMMAND_PLAY: 'command:play',
  COMMAND_STOP: 'command:stop',
  COMMAND_PAUSE: 'command:pause',
  COMMAND_SKIP: 'command:skip',
  COMMAND_PEEK: 'command:peek',
  COMMAND_PEEK_WARMUP: 'command:peekWarmup',
  COMMAND_DESCRIPTION_LOOP: 'command:descriptionLoop',
  COMMAND_ADD_RESERV: 'command:addReservation',
  COMMAND_DELETE_RESERV: 'command:deleteReservation',

  NOTIFY_PLAYER_INIT: 'notify:playerInit',
  NOTIFY_PLAYER_JOIN: 'notify:playerJoin',
  NOTIFY_PLAYER_STATUS: 'notify:playerStatus',
  NOTIFY_CONTROLLER_JOIN: 'notify:controllerJoin',

  NOTIFY_PLAYERS_STATUS: 'notify:playersStatus',
  NOTIFY_SESSION_STATUS: 'notify:sessionStatus',
  NOTIFY_PROGRAM_STATUS: 'notify:programStatus',
};
@WebSocketGateway({
  cors: {
    origin: [
      'http://13.125.177.176:3000',
      'https://buf40.com',
      'http://localhost:3000',
      'https://localhost',
      'http://localhost',
    ],
  },
})
export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly appService: AppService, private readonly videoService: VideoService) {}

  @WebSocketServer()
  server: Server;

  sessionStateMap = this.videoService.sessionStateMap;

  async handleConnection(socket: Socket) {
    const { sessionID, type } = socket.handshake.query as ConnectionQuery;

    if (!this.videoService.getSessionState(sessionID)) {
      return;
    }

    socket.join(sessionID);

    if (type === 'player') {
      this.handlePlayerSocket(socket);
    }

    if (type === 'controller') {
      this.handleControllerSocket(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    const { sessionID, type } = socket.handshake.query as ConnectionQuery;
    const sessionState = this.sessionStateMap.get(sessionID);

    if (!this.videoService.getSessionState(sessionID)) {
      return;
    }

    if (type === 'player') {
      const idx = sessionState.playersStatus.players.findIndex((state) => state.id === socket.data.playerState.id);
      sessionState.playersStatus.players.splice(idx, 1);
    }

    sessionState.programStatus.paused = true;
    this.abortTimer(sessionID);
    this.calculatePlayerScreens(sessionID);
    this.broadcastCurrentGlobalSessionStatus(sessionID);
    this.broadcastPlayerStatus(sessionID);
    this.broadcastProgramStatus(sessionID);
  }

  handlePlayerSocket = (socket: Socket) => {
    const { sessionID } = socket.handshake.query as ConnectionQuery;
    const sessionState = this.sessionStateMap.get(sessionID);
    const programStatus = sessionState.programStatus;

    socket.on(Events.NOTIFY_PLAYER_INIT, () => {
      console.log('playerInit');
      socket.data.playerState = {
        id: socket.id,
        screens: [],
      } as PlayerStatus;
    });

    socket.on(Events.NOTIFY_PLAYER_STATUS, () => {
      this.broadcastCurrentGlobalSessionStatus(sessionID);
    });

    socket.on(Events.NOTIFY_PLAYER_JOIN, async () => {
      console.log('playerJoin');
      sessionState.playersStatus.players.push(socket.data.playerState);

      if (sessionState.playersStatus.players.length > 1) {
        sessionState.programStatus.paused = true;
      }

      this.abortTimer(sessionID);
      this.calculatePlayerScreens(sessionID);
      this.broadcastCurrentGlobalSessionStatus(sessionID);
      this.notifyProgramStatus(sessionID, socket);
      this.broadcastPlayerStatus(sessionID);
    });

    socket.on(Events.COMMAND_PLAY, async () => {
      if (programStatus.currentState !== ProgramState.READY) {
        return;
      }
      console.log('COMMAND_PLAY');
      this.playRoutine(sessionID);
    });

    socket.on(Events.COMMAND_SKIP, () => {
      if (programStatus.currentState === ProgramState.DESCRIPTION) {
        programStatus.currentState = ProgramState.COUNTDOWN;
      }

      if (programStatus.currentState === ProgramState.MIDDLE_DESCRIPTION) {
        programStatus.currentState = ProgramState.PLAYING_WORKOUT;
      }
      this.abortTimer(sessionID);
      this.playRoutine(sessionID);
    });
  };

  handleControllerSocket = (socket: Socket) => {
    const { sessionID } = socket.handshake.query as ConnectionQuery;
    const sessionState = this.sessionStateMap.get(sessionID);
    const programStatus = sessionState.programStatus;

    socket.on(Events.COMMAND_PLAY, () => {
      if (programStatus.currentState !== ProgramState.READY && !programStatus.paused) {
        return;
      }
      console.log('COMMAND_PLAY');
      sessionState.programStatus.paused = false;
      this.playRoutine(sessionID);
    });

    socket.on(Events.COMMAND_PAUSE, () => {
      sessionState.programStatus.paused = true;
      this.abortTimer(sessionID);
      this.broadcastProgramStatus(sessionID);
    });

    socket.on(Events.COMMAND_STOP, () => {
      sessionState.programStatus.paused = false;
      sessionState.programStatus.warmupCount = 0;
      sessionState.programStatus.currentSetCount = 0;
      sessionState.programStatus.currentSetWorkoutCount = 0;
      sessionState.programStatus.currentState = ProgramState.READY;
      if (sessionState.programStatus.userRole !== UserRole.SUBGYM) {
        const set = sessionState.workoutProgram.workoutSets[0];
        if (set) {
          programStatus.setWorkoutCount = set.setPlayCount;
          programStatus.workoutSeconds = set.workoutTimeSeconds;
          programStatus.breakTimeSeconds = set.workoutTermSeconds;
          programStatus.setBreakTimeSeconds = set.breakTimeSeconds;
        }
      }
      this.abortTimer(sessionID);
      this.broadcastPlayerStatus(sessionID);
      this.broadcastProgramStatus(sessionID);
    });

    socket.on(Events.COMMAND_PEEK, ({ set, workout }) => {
      sessionState.programStatus.paused = true;
      sessionState.programStatus.currentSetCount = set;
      sessionState.programStatus.currentSetWorkoutCount = workout;
      if (sessionState.programStatus.userRole !== UserRole.SUBGYM) {
        const currentSet = sessionState.workoutProgram.workoutSets[set];
        programStatus.setWorkoutCount = currentSet.setPlayCount;
        programStatus.workoutSeconds = currentSet.workoutTimeSeconds;
        programStatus.breakTimeSeconds = currentSet.workoutTermSeconds;
        programStatus.setBreakTimeSeconds = currentSet.breakTimeSeconds;
      }
      sessionState.programStatus.currentState = ProgramState.PREPARE;
      this.abortTimer(sessionID);
      this.broadcastProgramStatus(sessionID);
    });

    socket.on(Events.COMMAND_PEEK_WARMUP, ({ index }) => {
      sessionState.programStatus.paused = true;
      sessionState.programStatus.currentSetCount = 0;
      sessionState.programStatus.currentSetWorkoutCount = 0;
      if (sessionState.programStatus.userRole !== UserRole.SUBGYM) {
        const currentSet = sessionState.workoutProgram.workoutSets[0];
        programStatus.setWorkoutCount = currentSet.setPlayCount;
        programStatus.workoutSeconds = currentSet.workoutTimeSeconds;
        programStatus.breakTimeSeconds = currentSet.workoutTermSeconds;
        programStatus.setBreakTimeSeconds = currentSet.breakTimeSeconds;
      }
      sessionState.programStatus.currentState = ProgramState.PLAYING_WARMUP;
      sessionState.programStatus.warmupCount = index;
      this.abortTimer(sessionID);
      this.broadcastProgramStatus(sessionID);
      this.broadcastPlayerStatus(sessionID);
    });

    socket.on(Events.COMMAND_DESCRIPTION_LOOP, (toggle: boolean) => {
      if (toggle) {
        sessionState.programStatus.loop = true;
        sessionState.programStatus.paused = true;
        sessionState.programStatus.currentState = ProgramState.DESCRIPTION;
        sessionState.programStatus.currentSetCount = 0;
        sessionState.programStatus.currentSetWorkoutCount = 0;
        this.abortTimer(sessionID);
        this.broadcastProgramStatus(sessionID);
      } else {
        sessionState.programStatus.loop = false;
      }
    });

    socket.on(Events.NOTIFY_CONTROLLER_JOIN, async () => {
      console.log('ControllerJoin');

      this.abortTimer(sessionID);
      this.calculatePlayerScreens(sessionID);
      this.broadcastDesirePlayersStatus(sessionID, Events.COMMAND_STOP);
      this.broadcastCurrentGlobalSessionStatus(sessionID);
      this.notifyProgramStatus(sessionID, socket);
    });

    socket.on(Events.COMMAND_ADD_RESERV, async (args) => {
      const reservations = sessionState.programStatus.reservations;

      if (reservations.find((r) => r.hour === args.hour && r.minute === args.minute)) {
        return;
      }

      reservations.push({ hour: args.hour, minute: args.minute, played: false });
      sessionState.programStatus.reservations = _.sortBy(reservations, ['hour', 'minute']);

      sessionState.programStatus.paused = true;
      this.abortTimer(sessionID);
      this.broadcastProgramStatus(sessionID);
    });

    socket.on(Events.COMMAND_DELETE_RESERV, async (args) => {
      const reservations = sessionState.programStatus.reservations;

      const idx = reservations.findIndex((r) => r.hour === args.hour && r.minute === args.minute);

      if (idx === -1) {
        return;
      }

      reservations.splice(idx, 1);

      sessionState.programStatus.paused = true;
      this.abortTimer(sessionID);
      this.broadcastProgramStatus(sessionID);
    });
  };

  broadcastCurrentGlobalSessionStatus = (sessionID: string) => {
    const status = this.sessionStateMap.get(sessionID);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { abortController, ..._status } = status;
    this.server.in(sessionID).emit(Events.NOTIFY_SESSION_STATUS, _status);
  };

  broadcastDesirePlayersStatus = (sessionID: string, command: string, args?: any) => {
    this.server.in(sessionID).emit(command, args);
  };

  broadcastProgramStatus = (sessionID: string) => {
    const status = this.sessionStateMap.get(sessionID);
    this.server.in(sessionID).emit(Events.NOTIFY_PROGRAM_STATUS, status.programStatus);
  };

  broadcastPlayerStatus = (sessionID: string) => {
    const state = this.sessionStateMap.get(sessionID);

    for (const player of state.playersStatus.players) {
      this.notifyPlayerStatus(player);
    }
  };

  notifyProgramStatus = (sessionID: string, socket: Socket) => {
    const status = this.sessionStateMap.get(sessionID);
    socket.emit(Events.NOTIFY_PROGRAM_STATUS, status.programStatus);
  };

  notifyPlayerStatus = (playerState: PlayerStatus) => {
    this.server.sockets.sockets.get(playerState.id)?.emit(Events.NOTIFY_PLAYER_STATUS, playerState);
  };

  calculateSinglePlayerScreen = (sessionID: string) => {
    const state = this.sessionStateMap.get(sessionID);

    if (state.programStatus.currentState === ProgramState.FINISHED) {
      return;
    }

    const currentSet = state.workoutProgram.workoutSets[state.programStatus.currentSetCount];

    for (const player of state.playersStatus.players) {
      if (state.programStatus.currentState === ProgramState.DESCRIPTION) {
        player.screens = [
          {
            currentTime: 0,
            index: 0,
            src: state.workoutProgram.warmUpVideos[0],
            coverImage: state.workoutProgram.coverImage,
          },
        ];
        continue;
      }

      const workout = currentSet.workouts[state.programStatus.currentSetWorkoutCount];

      const screen: Screen = {
        currentTime: 0,
        index: 0,
        src: workout.workoutVideo,
        coverImage: state.workoutProgram.coverImage,
      };
      player.screens = [screen];
    }
  };

  calculateGymPlayerScreens = (sessionID: string) => {
    const state = this.sessionStateMap.get(sessionID);

    const currentSet = state.workoutProgram.workoutSets[state.programStatus.currentSetCount];

    if (currentSet) {
      state.programStatus.workoutBreakTimeImage =
        currentSet.workouts[state.programStatus.currentSetCount]?.coverImage?.filePath;
    }

    const videoLength =
      state.programStatus.currentState === ProgramState.PLAYING_WARMUP
        ? state.workoutProgram.warmUpVideos.length
        : currentSet.workouts.length;

    const maximumScreensPerPlayer = currentSet ? Math.ceil(videoLength / state.playersStatus.players.length) : 1;

    const rows = Math.round(Math.log2(maximumScreensPerPlayer));
    const cols = Math.ceil(maximumScreensPerPlayer / rows);
    const blocks = cols * rows;

    let videoIndex = 0;

    for (const player of state.playersStatus.players) {
      if (state.programStatus.currentState === ProgramState.DESCRIPTION) {
        const video = state.workoutProgram.descriptionVideo;

        player.screens = [
          {
            currentTime: 0,
            index: 0,
            src: video,
            coverImage: state.workoutProgram.coverImage,
          },
        ];
        continue;
      }

      const screens: Screen[] = [];

      if (state.programStatus.currentState === ProgramState.PLAYING_WARMUP) {
        const video = state.workoutProgram.warmUpVideos[state.programStatus.warmupCount];
        player.screens = [
          {
            currentTime: 0,
            index: 0,
            src: video,
            coverImage: state.workoutProgram.coverImage,
          },
        ];

        continue;
      }

      for (let i = 0; i < blocks; i++) {
        const screen: Screen = {
          currentTime: 0,
          index: videoIndex,
          src: null,
          coverImage: state.workoutProgram.coverImage,
        };

        if (i < maximumScreensPerPlayer && videoIndex < currentSet.workouts.length) {
          const workout = currentSet.workouts[videoIndex];
          screen.src = workout.workoutVideo;
          screen.coverImage = workout.coverImage || state.workoutProgram.coverImage;
          videoIndex++;
        }

        screens.push(screen);
      }

      player.screens = screens;
    }
  };

  calculateSubGymPlayerScreens = (sessionID: string) => {
    const state = this.sessionStateMap.get(sessionID);

    const maximumScreensPerPlayer = Math.ceil(
      state.workoutProgram.workoutVideos.length / state.playersStatus.players.length,
    );

    const rows = Math.round(Math.log2(maximumScreensPerPlayer));
    const cols = Math.ceil(maximumScreensPerPlayer / rows);
    const blocks = cols * rows;

    let videoIndex = 0;

    for (const player of state.playersStatus.players) {
      const screens: Screen[] = [];

      for (let i = 0; i < blocks; i++) {
        const screen: Screen = {
          currentTime: 0,
          index: videoIndex,
          src: null,
          coverImage: state.workoutProgram.coverImage,
        };

        if (i < maximumScreensPerPlayer && videoIndex < state.workoutProgram.workoutVideos.length) {
          screen.src = state.workoutProgram.workoutVideos[videoIndex];
          videoIndex++;
        }

        screens.push(screen);
      }

      player.screens = screens;
    }
  };

  calculatePlayerScreens = (sessionID: string) => {
    const state = this.sessionStateMap.get(sessionID);

    console.log(state.programStatus.userRole);

    /**
     * Customer 일 경우
     */
    if (state.programStatus.userRole === UserRole.CUSTOMER) {
      this.calculateSinglePlayerScreen(sessionID);
      return;
    }

    /**
     * Gym 일 경우
     */
    if (state.programStatus.userRole === UserRole.GYM) {
      this.calculateGymPlayerScreens(sessionID);
      return;
    }

    /**
     * SubGym 일 경우
     */
    if (state.programStatus.userRole === UserRole.SUBGYM) {
      this.calculateSubGymPlayerScreens(sessionID);
      return;
    }

    /**
     * Gym 일 경우
     */
    if (state.programStatus.userRole === UserRole.ADMIN) {
      this.calculateGymPlayerScreens(sessionID);
      return;
    }
  };

  async playRoutine(sessionID: string) {
    const sessionState = this.sessionStateMap.get(sessionID);
    const programStatus = sessionState.programStatus;
    const userRole = sessionState.programStatus.userRole;
    const wait = this.waiter(sessionState);
    const setState = (newState: ProgramState) => (sessionState.programStatus.currentState = newState);

    try {
      mainloop: while (true) {
        console.log(programStatus.currentState);
        this.calculatePlayerScreens(sessionID);
        this.broadcastPlayerStatus(sessionID);
        this.broadcastProgramStatus(sessionID);
        switch (programStatus.currentState) {
          case ProgramState.READY: {
            if (userRole === UserRole.CUSTOMER) {
              if (
                sessionState.workoutProgram.warmUpVideos &&
                programStatus.warmupCount < sessionState.workoutProgram.warmUpVideos.length
              ) {
                setState(ProgramState.DESCRIPTION);
              } else {
                setState(ProgramState.MIDDLE_DESCRIPTION);
              }
            } else {
              const now = new Date();
              for (const reservation of programStatus.reservations) {
                if (reservation.hour * 60 + reservation.minute >= now.getHours() * 60 + now.getMinutes()) {
                  setState(ProgramState.WAIT_NEXT);
                  continue mainloop;
                }
              }
              if (sessionState.workoutProgram.descriptionVideo) {
                setState(ProgramState.DESCRIPTION);
              } else {
                setState(ProgramState.COUNTDOWN);
              }
            }
            continue;
          }
          case ProgramState.DESCRIPTION: {
            if (sessionState.workoutProgram.descriptionVideo) {
              programStatus.explicitWaitSeconds = sessionState.workoutProgram.descriptionVideo.duration;
              this.broadcastProgramStatus(sessionID);
              await wait(programStatus.explicitWaitSeconds + 1);
            }
            if (programStatus.loop) {
              continue;
            }
            setState(ProgramState.COUNTDOWN);
            continue;
          }
          case ProgramState.MIDDLE_DESCRIPTION: {
            await wait(8);
            setState(ProgramState.PLAYING_WORKOUT);
            continue;
          }
          case ProgramState.COUNTDOWN: {
            await wait(6);
            if (
              sessionState.workoutProgram.warmUpVideos &&
              programStatus.warmupCount < sessionState.workoutProgram.warmUpVideos.length
            ) {
              setState(ProgramState.PLAYING_WARMUP);
            } else {
              setState(ProgramState.PLAYING_WORKOUT);
            }
            continue;
          }
          case ProgramState.PLAYING_WARMUP: {
            if (programStatus.warmupCount === sessionState.workoutProgram.warmUpVideos.length) {
              setState(ProgramState.PREPARE);
              continue;
            }

            const waitSeconds =
              programStatus.warmupTimeSeconds ||
              sessionState.workoutProgram.warmUpVideos[programStatus.warmupCount].duration;
            programStatus.explicitWaitSeconds = waitSeconds;
            this.broadcastProgramStatus(sessionID);

            await wait(waitSeconds + 1);
            setState(ProgramState.PLAYING_WARMUP);
            programStatus.warmupCount++;
            continue;
          }
          case ProgramState.PREPARE: {
            await wait(programStatus.warmupBreakTimeSeconds + 1);
            if (userRole === UserRole.CUSTOMER) {
              setState(ProgramState.MIDDLE_DESCRIPTION);
            } else {
              setState(ProgramState.PLAYING_WORKOUT);
            }
            continue;
          }
          case ProgramState.PLAYING_WORKOUT: {
            const videos = sessionState.workoutProgram.workoutVideos
              ? sessionState.workoutProgram.workoutVideos
              : sessionState.workoutProgram.workoutSets[programStatus.currentSetCount].workouts.map(
                  (w) => w.workoutVideo,
                );

            if (programStatus.workoutSeconds) {
              await wait(programStatus.workoutSeconds + 1);
            } else {
              if (programStatus.userRole === UserRole.GYM) {
                const set = sessionState.workoutProgram.workoutSets[programStatus.currentSetCount];
                programStatus.workoutSeconds = set.workoutTimeSeconds;
                await wait(set.workoutTimeSeconds + 1);
              } else {
                programStatus.explicitWaitSeconds = videos[programStatus.currentSetWorkoutCount].duration;
                this.broadcastProgramStatus(sessionID);
                await wait(programStatus.explicitWaitSeconds + 1);
              }
            }

            programStatus.currentSetWorkoutCount++;

            if (programStatus.currentSetWorkoutCount === programStatus.setWorkoutCount) {
              programStatus.currentSetWorkoutCount = 0;
              if (programStatus.setCount) {
                programStatus.currentSetCount++;
                if (programStatus.userRole === UserRole.GYM) {
                  const set = sessionState.workoutProgram.workoutSets[programStatus.currentSetCount];
                  if (set) {
                    programStatus.setWorkoutCount = set.setPlayCount;
                    programStatus.workoutSeconds = set.workoutTimeSeconds;
                    programStatus.breakTimeSeconds = set.workoutTermSeconds;
                    programStatus.setBreakTimeSeconds = set.breakTimeSeconds;
                  }
                }
              }
            }

            if (programStatus.setCount && programStatus.currentSetCount === programStatus.setCount) {
              programStatus.currentSetCount = 0;
              programStatus.currentSetWorkoutCount = 0;
              setState(ProgramState.FINISHED);
              continue;
            }

            let next = ProgramState.BREAKING_WORKOUT;

            if (programStatus.currentSetWorkoutCount === 0) {
              next = ProgramState.BREAKING_SET;
            } else if (!sessionState.programStatus.breakTimeSeconds) {
              next = ProgramState.PLAYING_WORKOUT;
            }

            setState(next);
            continue;
          }
          case ProgramState.BREAKING_WORKOUT: {
            await wait(sessionState.programStatus.breakTimeSeconds + 1);
            if (sessionState.programStatus.userRole === UserRole.CUSTOMER) {
              setState(ProgramState.MIDDLE_DESCRIPTION);
            } else {
              setState(ProgramState.PLAYING_WORKOUT);
            }
            continue;
          }
          case ProgramState.BREAKING_SET: {
            await wait(sessionState.programStatus.setBreakTimeSeconds + 1);
            if (sessionState.programStatus.userRole === UserRole.CUSTOMER) {
              setState(ProgramState.MIDDLE_DESCRIPTION);
            } else {
              setState(ProgramState.PLAYING_WORKOUT);
            }
            continue;
          }
          case ProgramState.FINISHED: {
            await wait(3);
            const now = new Date();
            for (const reservation of programStatus.reservations) {
              if (reservation.played) {
                continue;
              }
              if (reservation.hour * 60 + reservation.minute >= now.getHours() * 60 + now.getMinutes()) {
                setState(ProgramState.WAIT_NEXT);
                break;
              }
            }

            if (userRole === UserRole.SUBGYM) {
              programStatus.currentSetWorkoutCount = 0;
              programStatus.currentSetCount = 0;
              setState(ProgramState.COUNTDOWN);
            }
            continue;
          }
          case ProgramState.WAIT_NEXT: {
            const now = new Date();
            programStatus.currentSetWorkoutCount = 0;
            programStatus.currentSetCount = 0;

            for (const reservation of programStatus.reservations) {
              if (reservation.hour * 60 + reservation.minute >= now.getHours() * 60 + now.getMinutes()) {
                const nextTime = new Date();
                nextTime.setHours(reservation.hour);
                nextTime.setMinutes(reservation.minute);
                programStatus.explicitWaitSeconds = parseInt(((nextTime.getTime() - now.getTime()) / 1000).toFixed(0));
                this.broadcastProgramStatus(sessionID);
                this.broadcastPlayerStatus(sessionID);
                await wait(programStatus.explicitWaitSeconds);
                reservation.played = true;
                break;
              }
            }

            const set = sessionState.workoutProgram.workoutSets[0];
            if (set) {
              programStatus.setWorkoutCount = set.setPlayCount;
            }
            setState(ProgramState.COUNTDOWN);
            continue;
          }
          default:
            return;
        }
      }
    } catch (e) {
      console.log(e);
      console.log('타이머 종료');
    }
  }

  abortTimer = (sessionID: string) => {
    console.log('abort');
    const sessionState = this.sessionStateMap.get(sessionID);
    sessionState.abortController.abort();
    sessionState.abortController = new AbortController();
  };

  waiter(sessionState: SessionStatus) {
    return (seconds: number) => {
      return setTimeout(seconds * 1000, null, {
        signal: sessionState.abortController.signal,
      });
    };
  }
}
