import { Model, DataTypes } from 'sequelize';
import sequelize from '../config.js';

class Feedback extends Model { }

Feedback.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        from_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        to_employee: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Feedback',
        tableName: 'feedbacks',
        timestamps: false,
    }
);

export default Feedback;
