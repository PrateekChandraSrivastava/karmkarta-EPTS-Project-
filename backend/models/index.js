import sequelize from '../config.js';
import User from './User.js';
import Employee from './Employee.js';
import Task from './Task.js';
import Goal from './Goal.js';
import PerformanceMetric from './PerformanceMetric.js';
import Feedback from './Feedback.js';
import LeaveRequest from './LeaveRequest.js';
import Complaint from './Complaint.js';
import Attendance from './Attendance.js';

// Associations

// Employee: optionally linked to a manager (User)
Employee.belongsTo(User, { as: 'manager', foreignKey: 'manager_id' });

// Task: assigned to an Employee and created by a User (manager)
Task.belongsTo(Employee, { as: 'assignedEmployee', foreignKey: 'assigned_to' });
Task.belongsTo(User, { as: 'assignedBy', foreignKey: 'assigned_by' });

// Goal: assigned to an Employee
Goal.belongsTo(Employee, { as: 'assignedTo', foreignKey: 'assigned_to' });

// PerformanceMetric: belongs to an Employee
PerformanceMetric.belongsTo(Employee, { as: 'employee', foreignKey: 'employee_id', onDelete: 'CASCADE' });
Employee.hasMany(PerformanceMetric, { foreignKey: 'employee_id', onDelete: 'CASCADE' });

// Feedback: from a User (manager) to an Employee
Feedback.belongsTo(User, { as: 'fromUser', foreignKey: 'from_user' });
Feedback.belongsTo(Employee, { as: 'toEmployee', foreignKey: 'to_employee' });

// Complaint: belongs to User
Complaint.belongsTo(User, { foreignKey: 'userId' });

// Only export models and associations, do not sync here
export {
    User,
    Employee,
    Task,
    Goal,
    PerformanceMetric,
    Feedback,
    LeaveRequest,
    Complaint,
    Attendance,
};
