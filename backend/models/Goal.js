import { Model, DataTypes } from 'sequelize';
import sequelize from '../config.js';

class Goal extends Model { }

Goal.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        target_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Goal',
        tableName: 'goals',
        timestamps: false,
    }
);

export default Goal;
