import { IComment } from "./comment.interface";

export interface IPost {
  id: number;
  userId: number;
  content: string;
  createAt: Date | string | number | null;
  updatedAt: Date | string | number | null;
  thumbnailImage: string;
  title: string;
  author: string;
  totalLike?: number;
  totalDislike?: number;
  commentList?: IComment[];
  visibleAction: boolean;
}
