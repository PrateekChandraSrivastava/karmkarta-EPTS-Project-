import { Model, DataTypes } from 'sequelize';
import sequelize from '../config.js';
import User from './User.js';

class Complaint extends Model {}

Complaint.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
      allowNull: false,
      defaultValue: 'Medium',
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attachment: {
      type: DataTypes.STRING, // File path or URL
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Complaint',
    tableName: 'complaints',
    timestamps: false,
  }
);

Complaint.belongsTo(User, { foreignKey: 'userId' });

export default Complaint;
