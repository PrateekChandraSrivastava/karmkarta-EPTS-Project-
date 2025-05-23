// backend/models/PerformanceMetric.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config.js';

class PerformanceMetric extends Model { }

PerformanceMetric.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        employee_id: { // Add this field
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        kpi_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
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
        modelName: 'PerformanceMetric',
        tableName: 'performance_metrics',
        timestamps: false,
    }
);

export default PerformanceMetric;
