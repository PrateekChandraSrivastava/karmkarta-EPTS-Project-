import express from 'express';
import Employee from '../models/Employee.js';
import User from '../models/User.js'; // Import User model
import { verifyToken } from '../middleware/authMiddleware.js';
// import { Op } from 'sequelize'; // Import Op if needed for complex queries

const router = express.Router();

const cleanDate = (date) => {
    if (!date || date === 'Invalid date') return null;
    return date;
};

// GET /employees - Retrieve employees based on user role
router.get('/', verifyToken, async (req, res) => {
    console.log(`[GET /employees] Request received. User role: ${req.user?.role}, User ID: ${req.user?.id}`);

    const loggedInUser = req.user;

    if (loggedInUser.role === 'admin') {
        console.log('[GET /employees] Admin role detected. Fetching all users with employee details.');
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'department', 'jobTitle', 'imageUrl'],
            include: [{
                model: Employee,
                as: 'employeeDetails', // Use the alias defined in User model
                attributes: ['designation', 'phone', 'dob', 'joinDate', 'status', 'manager_id', 'department' /* Employee.department */, 'image' /* Employee.image */],
                required: false // Left join: get all users, even if no matching employee entry
            }],
        });
        console.log(`[GET /employees] Admin: Found ${users.length} records from User table (with potential employeeDetails).`);

        const combinedData = users.map(user => {
            const empDetail = user.employeeDetails;
            return {
                id: user.id,
                employeeId: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: empDetail?.department || user.department, // Prefer Employee.department
                designation: empDetail?.designation || user.jobTitle, // Prefer Employee.designation
                jobTitle: user.jobTitle || empDetail?.designation,    // Fallback
                phone: empDetail?.phone,
                dob: empDetail?.dob,
                joinDate: empDetail?.joinDate,
                status: empDetail?.status,
                manager_id: empDetail?.manager_id,
                imageUrl: user.imageUrl || empDetail?.image, // Prefer User.imageUrl
            };
        });
        console.log(`[GET /employees] Admin: Mapped to ${combinedData.length} records. Sending response.`);
        res.json(combinedData);

    } else if (loggedInUser.role === 'manager') {
        console.log(`[GET /employees] Manager role detected. Fetching employees for manager ID: ${loggedInUser.id}`);
        const employees = await Employee.findAll({
            where: { manager_id: loggedInUser.id },
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'email', 'role', 'department', 'jobTitle', 'imageUrl']
            }],
        });

        if (employees.length === 0) {
            console.warn(`[GET /employees] No employees found for manager ID: ${loggedInUser.id}.`);
        } else {
            console.log(`[GET /employees] Found ${employees.length} employees for manager ID: ${loggedInUser.id}.`);
        }

        const managerEmployees = employees.map(emp => {
            if (!emp.user) {
                console.warn(`[GET /employees] Manager: Employee ID ${emp.id} is missing associated 'user' details. This indicates a potential data integrity or association issue.`);
                // Fallback if user details are not properly included
                return {
                    id: emp.id,
                    employeeId: emp.id,
                    name: emp.name, // from Employee model itself
                    email: emp.email,
                    role: 'employee', // Default or consider how to handle
                    department: emp.department,
                    designation: emp.designation,
                    jobTitle: emp.designation, // Fallback
                    phone: emp.phone,
                    dob: emp.dob,
                    joinDate: emp.joinDate,
                    status: emp.status,
                    manager_id: emp.manager_id,
                    imageUrl: emp.image, // from Employee model
                };
            }
            return {
                id: emp.id,
                employeeId: emp.id,
                name: emp.user.name,
                email: emp.user.email,
                role: emp.user.role,
                department: emp.department || emp.user.department,
                designation: emp.designation || emp.user.jobTitle,
                jobTitle: emp.user.jobTitle || emp.designation,
                phone: emp.phone,
                dob: emp.dob,
                joinDate: emp.joinDate,
                status: emp.status,
                manager_id: emp.manager_id,
                imageUrl: emp.user.imageUrl || emp.image,
            };
        });
        console.log(`[GET /employees] Manager: Mapped to ${managerEmployees.length} records. Sending response.`);
        res.json(managerEmployees);
    } else {
        console.log(`[GET /employees] Role ${loggedInUser.role} has no specific logic, returning empty list.`);
        res.json([]);
    }
});

// GET /employees/:id - Retrieve a specific employee by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const employee = await Employee.findByPk(req.params.id);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Authorization: Managers can only view employees they manage (or admins can view any)
        if (loggedInUser.role === 'manager' && employee.manager_id !== loggedInUser.id) {
            return res.status(403).json({ error: 'Forbidden: You can only view employees you manage.' });
        }

        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /employees - Create a new employee
router.post('/', verifyToken, async (req, res) => {
    // Added console.log for entry point
    console.log(`[POST /employees] Request received. User role: ${req.user?.role}, User ID: ${req.user?.id}. Body:`, req.body);
    try {
        const loggedInUser = req.user;
        const { name, email, department, designation, phone, dob, joinDate, image, status } = req.body;
        let manager_id_from_payload = req.body.manager_id; // manager_id from payload, if admin sets it

        // Determine the manager_id for the new employee
        let effective_manager_id;
        if (loggedInUser.role === 'manager') {
            effective_manager_id = loggedInUser.id;
            console.log(`[POST /employees] Manager creating employee. Manager ID set to: ${effective_manager_id}`);
            // Optionally, force department to be the manager's department
            // if (loggedInUser.department && department !== loggedInUser.department) {
            //     console.log(`[POST /employees] Manager department mismatch. Manager: ${loggedInUser.department}, Employee: ${department}`);
            //     return res.status(400).json({ error: `Manager can only add employee to their own department: ${loggedInUser.department}` });
            // }
        } else if (loggedInUser.role === 'admin') {
            effective_manager_id = manager_id_from_payload; // Admin can specify manager_id
            console.log(`[POST /employees] Admin creating employee. Manager ID from payload: ${effective_manager_id}`);
        } else {
            console.log(`[POST /employees] User role ${loggedInUser.role} not authorized to create employees directly through this logic.`);
            return res.status(403).json({ error: 'Forbidden: Your role cannot create employees here.' });
        }

        console.log(`[POST /employees] Checking for existing employee with email: ${email}`);
        const existingEmployee = await Employee.findOne({ where: { email } });
        if (existingEmployee) {
            console.log(`[POST /employees] Employee with email ${email} already exists.`);
            return res.status(400).json({ error: 'Employee with this email already exists.' });
        }

        console.log(`[POST /employees] Finding user with email: ${email} to link.`);
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(`[POST /employees] No user account found for email ${email}. User must be registered first.`);
            return res.status(400).json({ error: 'No user account found for this email. Please register the user first.' });
        }
        console.log(`[POST /employees] User found with ID: ${user.id}. User details:`, user.toJSON()); // Log user details

        const newEmployeeData = {
            id: user.id, // Use User's ID as Employee's ID
            name: name || user.name, // Use payload 'name' or fallback to User.name
            email, // email is already a required part of the payload for linking
            department: (loggedInUser.role === 'manager' && loggedInUser.department) ? loggedInUser.department : department || user.department, // Prefer manager's dept, then payload, then user's
            designation: designation || user.jobTitle, // Use payload 'designation' or fallback to User.jobTitle
            phone: phone || user.phone, // Use payload 'phone' or fallback to User.phone
            dob: cleanDate(dob),
            joinDate: cleanDate(joinDate),
            image: image || user.imageUrl, // Use payload 'image' or fallback to User.imageUrl
            status,
            manager_id: effective_manager_id,
        };
        console.log('[POST /employees] Creating new employee with data:', newEmployeeData);

        const newEmployee = await Employee.create(newEmployeeData);
        console.log('[POST /employees] Employee created successfully:', newEmployee.toJSON());
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error(`[POST /employees] CRITICAL ERROR. User role: ${req.user?.role}, User ID: ${req.user?.id}. Error: ${error.message}`, error.stack);
        res.status(500).json({ error: 'Internal Server Error while creating employee. ' + error.message });
    }
});

// PUT /employees/:id - Update an existing employee
router.put('/:id', verifyToken, async (req, res) => {
    console.log(`[PUT /employees/:id] Request received for ID: ${req.params.id}. User role: ${req.user?.role}, User ID: ${req.user?.id}. Body:`, req.body);
    console.log(`[PUT /employees/:id] Verifying request data and user role.`);

    try {
        const employeeToUpdate = await Employee.findByPk(req.params.id);
        if (!employeeToUpdate) {
            console.log(`[PUT /employees/:id] Employee with ID ${req.params.id} not found.`);
            return res.status(404).json({ error: 'Employee not found' });
        }

        console.log(`[PUT /employees/:id] Found employee to update:`, employeeToUpdate.toJSON());

        const loggedInUser = req.user;

        if (loggedInUser.role === 'manager') {
            console.log(`[PUT /employees/:id] Manager role. Checking ownership. Employee manager_id: ${employeeToUpdate.manager_id}, Logged-in manager ID: ${loggedInUser.id}`);
            if (employeeToUpdate.manager_id !== loggedInUser.id) {
                console.log(`[PUT /employees/:id] Manager forbidden to update. Not their employee.`);
                return res.status(403).json({ error: 'Forbidden: You can only update employees you manage.' });
            }
        }

        const updateData = req.body;
        console.log(`[PUT /employees/:id] Updating employee with data:`, updateData);

        await employeeToUpdate.update(updateData);
        console.log(`[PUT /employees/:id] Employee updated successfully:`, employeeToUpdate.toJSON());

        res.json(employeeToUpdate);
    } catch (error) {
        console.error(`[PUT /employees/:id] Error occurred:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /employees/:id - Delete an employee
router.delete('/:id', verifyToken, async (req, res) => {
    console.log(`[DELETE /employees/:id] Request received for ID: ${req.params.id}. User role: ${req.user?.role}, User ID: ${req.user?.id}`);
    try {
        const employeeToDelete = await Employee.findByPk(req.params.id);
        if (!employeeToDelete) {
            console.log(`[DELETE /employees/:id] Employee with ID ${req.params.id} not found.`);
            return res.status(404).json({ error: 'Employee not found' });
        }
        console.log(`[DELETE /employees/:id] Found employee to delete:`, employeeToDelete.toJSON());

        const loggedInUser = req.user;
        if (loggedInUser.role === 'manager' && employeeToDelete.manager_id !== loggedInUser.id) {
            console.log(`[DELETE /employees/:id] Manager forbidden to delete. Not their employee. Employee manager_id: ${employeeToDelete.manager_id}, Logged-in manager ID: ${loggedInUser.id}`);
            return res.status(403).json({ error: 'Forbidden: You can only delete employees you manage.' });
        }
        console.log(`[DELETE /employees/:id] Authorization passed or user is admin.`);

        await employeeToDelete.destroy();
        console.log(`[DELETE /employees/:id] Employee ID ${req.params.id} deleted successfully.`);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(`[DELETE /employees/:id] CRITICAL ERROR for ID ${req.params.id}. User role: ${req.user?.role}, User ID: ${req.user?.id}. Error: ${error.message}`, error.stack);
        res.status(500).json({ error: 'Internal Server Error while deleting employee. ' + error.message });
    }
});

export default router;
