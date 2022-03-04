import User, { associate as associateUser } from './user';
import Post, { associate as associatePost } from './post';
import Image, { associate as associateImage } from './image';
import Hash, { associate as associateHash } from './hashtag';
import Comment, { associate as associateComment } from './comment';

export * from './sequelize';
const db = {
  User,
  Post,
  Image,
  Hash,
  Comment
};
export type dbType = typeof db;

associateUser(db);
associatePost(db);
associateImage(db);
associateHash(db);
associateComment(db);