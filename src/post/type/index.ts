import { PostModel } from 'src/post/entity/post.entity';

export enum PostType {
  Notice = 'Notice',
  Question = 'Question',
}

export interface ExtendedPostModel extends PostModel {
  isPopular: boolean;
}
