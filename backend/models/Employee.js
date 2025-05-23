import { Model, DataTypes } from 'sequelize';
import sequelize from '../config.js';
import User from './User.js';

class Employee extends Model { }

Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: User,
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        designation: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        manager_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        joinDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'active',
        },
    },
    {
        sequelize,
        modelName: 'Employee',
        tableName: 'employees',
        timestamps: false,
    }
);

// Relationships
Employee.belongsTo(User, { foreignKey: 'id', as: 'user' }); // An employee IS a user
User.hasOne(Employee, { foreignKey: 'id', as: 'employeeDetails' }); // A user MIGHT have employee details

// For manager relationship
Employee.belongsTo(User, { foreignKey: 'manager_id', as: 'managedBy' });
User.hasMany(Employee, { foreignKey: 'manager_id', as: 'managesEmployees' });

export default Employee;
