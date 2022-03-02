export * from './sequelize';
import User, { associate as associateUser } from './user';

const db = {
  User,
};
export type dbType = typeof db;

associateUser(db);