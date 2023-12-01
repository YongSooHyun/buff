<template>
  <div v-if="programStatus && programStatus.currentState !== 'WAIT_NEXT'" class="meter-wrapper">
    <div class="meter">
      <div
        v-for="(i) in programStatus.setCount || 1"
        :key="`${i}wc`"
        class="meter-workout-count-container"
        :style="{ ...meterWorkoutCountContainerStyle(i) }"
      >
        <div
          v-for="(j, jj) in programStatus.setPlayCounts[i - 1]"
          :key="`${i} + ${j}`"
          class="meter-workout-count-local-block"
          :style="{ ...meterWorkoutCountLocalBlockStyle(i, jj) }"
        >
          <div
            class="meter-workout-count-local-block-fill"
            :style="{ ...meterWorkoutCountLocalBlockFillAnimation(i, jj) }"
          />
        </div>
      </div>
      <div
        v-for="i in (programStatus.setCount || 1) - 1"
        :key="`${i}sb`"
        class="meter-set-bar"
        :style="{ ...meterSetBarStyle(i) }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

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
  WAIT_NEXT = 'WAIT_NEXT'
}

export type ProgramReservation = {
  hour: number;
  minute: number;
};

export type ProgramStatus = {
  readonly explicitWaitSeconds: number
  readonly currentSetWorkoutCount: number;
  readonly currentSetCount: number;
  readonly currentState: ProgramState;
  readonly reservations: ProgramReservation[];
  readonly paused: boolean;
  readonly setPlayCounts: number[];
  readonly setWorkoutCount: number;
  readonly setCount: number;
  readonly setBreakTimeSeconds: number;
  readonly workoutSeconds: number;
  readonly breakTimeSeconds: number;
  readonly warmupTimeSeconds: number;
  readonly warmupBreakTimeSeconds: number;
  readonly workoutBreakTimeImage: string;
  readonly setBreakTimeImage: string;
  readonly coverImage: string;
  readonly coverImageType: 'VIDEO' | 'THUMBNAIL' | 'WORKOUT_COVER' | 'WORKOUT_BREAK' | 'SET_BREAK' | 'WARMUP_BREAK';
  readonly warmupBreakTimeImage: string;
  readonly userRole: 'CUSTOMER' | 'GYM' | 'ADMIN' | 'SUBGYM'
  readonly warmupCount: number
}

export type Screen = {
  index: number
  src: any
}

export type PlayerStatus = {
  screens: Screen[]
}

@Component
export default class PlayMeter extends Vue {
  @Prop() programStatus!: ProgramStatus

  meterSetBarStyle (index: number) {
    const offset = (100 / this.programStatus.setCount) * index

    return {
      left: `${offset}%`
    }
  }

  meterWorkoutCountContainerStyle (index: number) {
    const offset = (100 / this.programStatus.setCount) * (index - 1)

    return {
      left: `${offset}%`
    }
  }

  meterWorkoutCountLocalBlockStyle (set: number, index: number) {
    if ((set - 1) < this.programStatus.currentSetCount) {
      return {
        'background-color': '#959'
      }
    }

    if ((set - 1) === this.programStatus.currentSetCount && index < this.programStatus.currentSetWorkoutCount) {
      return {
        'background-color': '#959'
      }
    }
  }

  meterWorkoutCountLocalBlockFillAnimation (set: number, index: number) {
    if (this.programStatus.currentState !== ProgramState.PLAYING_WORKOUT) {
      return
    }

    if ((set - 1) === this.programStatus.currentSetCount && (index) === this.programStatus.currentSetWorkoutCount) {
      return {
        'background-color': '#8d9',
        width: '100%',
        transition: `width ${(this.programStatus.workoutSeconds || this.programStatus.explicitWaitSeconds) + 1}s linear`
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.meter-wrapper {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 84px;
  padding: 24px;
  z-index: 11;

  .meter {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 6px;
    opacity: 0.8;
    display: flex;
    overflow: hidden;
    border: 1px solid #000;

    .meter-set-bar {
      position: absolute;
      background-color: #158;
      width: 10px;
      height: 100%;
      transform: translateX(-50%);
    }

    .meter-workout-count-container {
      display: flex;
      left: 0;
      height: 100%;
      flex: 1;

      .meter-workout-count-local-block {
        position: relative;
        flex: 1;

        .meter-workout-count-local-block-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
        }
      }

      .meter-workout-count-local-block:not(:last-child) {
        border-right: 1px solid #000;
      }
    }
  }
}
</style>
