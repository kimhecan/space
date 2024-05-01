import { join } from 'path';

export const PROJECT_ROOT_PATH = process.cwd();

export const PUBLIC_FOLDER_NAME = 'public';

export const USER_FOLDER_NAME = 'user';

// {프로젝트 위치}/public
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

// public/user
export const USER_PUBLIC_IMAGE_PATH = join(
  PUBLIC_FOLDER_NAME,
  USER_FOLDER_NAME,
);
