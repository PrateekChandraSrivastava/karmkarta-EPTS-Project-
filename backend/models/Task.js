import { Model, DataTypes } from 'sequelize';
import sequelize from '../config.js';

class Task extends Model { }

Task.init(
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
        assignedTo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        employeeId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        priority: {
            type: DataTypes.ENUM('Low', 'Medium', 'High'),
            defaultValue: 'Medium',
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
            defaultValue: 'Pending',
        },
        updates: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },
    },
    {
        sequelize,
        modelName: 'Task',
        tableName: 'tasks',
        timestamps: false,
    }
);

export default Task;
