import { ImageType } from 'src/typeorm/image';
import { UserRole } from 'src/typeorm/user';
import { WorkoutVideo } from 'src/typeorm/workoutVideo';
import { ProgramReservation } from 'src/video.service';

export type PaginationQuery = {
  limit?: number;
  offset: number;
};

export type VideosListQuery = PaginationQuery & {
  preferPartID: number;
  preferCategoryID: number;
  query: string | null;
};

export type ProgramsListQuery = PaginationQuery & {
  targetUserRole: UserRole;
  fromYear: number;
  fromMonth: number;
  toYear: number;
  toMonth: number;
  random?: boolean;
};
export type ImagesQuery = {
  type?: ImageType;
};
export type SignupBody = {
  username: string;
  password: string;
  name: string;
  email: string;
  phoneNumber: string;
  userRole: UserRole;
};

export type Subscription = {
  id?: number;
  startDate: string;
  endDate: string;
};

export type UpdateUserBody = {
  granted?: boolean;
  suspended?: boolean;
  subscription?: Subscription;
  role?: UserRole;
  gymID?: number;
};

export type UploadVideoBody = {
  name: string;
  isWarmup: boolean;
  isDescription: boolean;
  categoryID: number;
  partID: number;
};

export type UploadImageBody = {
  type: ImageType;
  name: string;
};
export type DeleteImageBody = {
  id: number;
};

export type CreateWorkoutProgramBody = {
  name: string;
  descriptionVideoID: number;
  toolIDs: number[];
  preferCategoryID: number;
  preferPartID: number;
  coverImageID: number;
  workoutSets: {
    workoutTimeSeconds: number;
    workoutTermSeconds: number;
    breakTimeSeconds: number;
    setFinishImageID: number;
    setPlayCount?: number;
    workouts: {
      videoID: number;
      workoutFinishImageID?: number;
    }[];
  }[];
  workoutBreakTimeImageID: number;
  workoutBreakTimeSeconds: number;
  setBreakTimeImageID: number;
  setBreakTimeSeconds: number;
  workoutTimeSeconds: number;
  setCount: number;
  openDateMillis: number;
  closeDateMillis: number;
  warmUpVideo: any;
  warmupTimeSeconds: number;
  warmupBreakTimeSeconds: number;
  warmUpVideoIds: number[];
  warmUpImageID: number;
};

export type UpdateWorkoutProgramBody = CreateWorkoutProgramBody & {
  id: number;
};

export type CreateTypeBody = {
  type: 'PART' | 'CATEGORY' | 'SCHEDULE_TYPE' | 'TOOL';
  name: string;
};

export type DeleteTypeBody = {
  type: 'PART' | 'CATEGORY' | 'SCHEDULE_TYPE' | 'TOOL';
  id: number;
};

export type CreateProgramSessionBody = {
  programID: number;
  userID: number;
  userRole: UserRole;
};

export type UpdateWorkoutProgramScheduleBody = {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  scheduleID?: number;
  programTypeID?: number;
  programID?: number;
  year?: number;
  month?: number;
  date?: number;
};

export type CreateNoticeBody = {
  id?: number;
  title: string;
  body: string;
};

export type DeleteNoticeBody = {
  id: number;
};

export type EditNoticeBody = {
  id: number;
  title: string;
  body: string;
};

export type GetNoticeQuery = {
  id: number;
};

export type RandomQuery = {
  count: number;
  setCount: number;
  categoryID: number;
  partID: number;
};

export type CreateSubProgramSessionBody = {
  userID: number;
  workoutVideos: WorkoutVideo[];
  workoutSetCount: number;
  workoutSetBreakTimeSeconds: number;
  workoutSeconds: number;
  reservations: ProgramReservation[];
};

export type UpdatePasswordBody = {
  old: string;
  new: string;
};

export type UpdateProfileBody = {
  name: string;
  phoneNumber: string;
  email: string;
};
