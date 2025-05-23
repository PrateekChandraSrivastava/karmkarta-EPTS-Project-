import { DataTypes } from 'sequelize';
import sequelize from '../config.js';

const LeaveRequest = sequelize.define('LeaveRequest', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    employeeId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    employeeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    leaveType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

export default LeaveRequest;