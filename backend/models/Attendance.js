import { Model, DataTypes } from 'sequelize';
import sequelize from '../config.js';
import User from './User.js';

class Attendance extends Model { }

Attendance.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        action: {
            type: DataTypes.ENUM('checked-in', 'checked-out'),
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Attendance',
        tableName: 'attendances',
        timestamps: false,
    }
);

Attendance.belongsTo(User, { foreignKey: 'userId' });

export default Attendance;
