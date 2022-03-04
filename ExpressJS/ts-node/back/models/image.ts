import { DataTypes, Model } from "sequelize";
import { dbType } from "./index";
import { sequelize } from './sequelize';

class Image extends Model {
    public readonly id!: number;
    public src!: number;
    public readonly createdAt!: Date;
    public readonly updateAT!: Date;

}

Image.init({
    src: {
        type: DataTypes.STRING(200),
        allowNull: false,
    }
},{
    sequelize,
    modelName: 'Image',
    tableName: 'image',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
});

export const associate = (db: dbType) => {
    
};
export default Image;