import { Model, DataTypes, BelongsTo, BelongsToMany, BelongsToManyGetAssociationsMixin } from 'sequelize';
import { dbType } from './index';
import Post from './post';
import { sequelize } from './sequelize';

class User extends Model {
    public readonly id!: number;
    public nickname!: string;
    public userId!: string;
    public password!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly Posts?: Post[];
    public readonly Followers?: User[];
    public readonly Followings?: User[];

    public getFollowings!: BelongsToManyGetAssociationsMixin<User>;
    public getFollowers!: BelongsToManyGetAssociationsMixin<User>;
    
}

User.init({
    nickname: {
        type: DataTypes.STRING(20),
    },
    userId:{
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    charset: 'utf8',
    collate: 'utf8_general_ci',
});

export const associate = (db: dbType) => {
    db.User.hasMany(db.Post, { as: 'Posts '});
    db.User.belongsToMany(db.User, { through:'Follow', as:'Followers', foreignKey:'followingId' });
    db.User.belongsToMany(db.User, { through:'Follow', as:'Followings', foreignKey:'followerId' });
};

export default User;