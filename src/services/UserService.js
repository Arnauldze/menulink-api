const User = require('../models/User');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class UserService {
    /**
     * Create a new employee (WAITER, KITCHEN, CASHIER) under a restaurant
     */
    async createEmployee(restaurantId, employeeData) {
        try {
            // Verify role is not MANAGER
            if (employeeData.role === 'MANAGER') {
                throw new Error('Cannot create MANAGER accounts through this endpoint.');
            }

            // Verify if email already exists
            const existingUser = await User.findOne({ email: employeeData.email });
            if (existingUser) {
                throw new Error('A user with this email already exists');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(employeeData.password, salt);

            const newUser = new User({
                name: employeeData.name,
                email: employeeData.email,
                phone: employeeData.phone,
                password_hash: hashedPassword,
                role: employeeData.role || 'WAITER',
                restaurant_id: restaurantId,
            });
            await newUser.save();

            logger.info('New employee created', {
                userId: newUser._id,
                restaurantId: restaurantId,
                role: newUser.role
            });

            return {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone
            };
        } catch (error) {
            logger.error('Error in createEmployee Service', { error: error.message });
            throw error;
        }
    }

    /**
     * Get all employees for a restaurant
     */
    async getEmployees(restaurantId) {
        try {
            const employees = await User.find({ restaurant_id: restaurantId })
                .select('-password_hash')
                .sort({ created_at: -1 });
            return employees;
        } catch (error) {
            logger.error('Error getting employees', { error: error.message });
            throw error;
        }
    }

    /**
     * Delete an employee
     */
    async deleteEmployee(restaurantId, userId) {
        try {
            const user = await User.findOneAndDelete({ _id: userId, restaurant_id: restaurantId, role: { $ne: 'MANAGER' } });
            if (!user) {
                throw new Error('Employee not found or cannot be deleted');
            }
            logger.info('Employee deleted', { userId });
            return user;
        } catch (error) {
            logger.error('Error deleting employee', { error: error.message });
            throw error;
        }
    }
}

module.exports = new UserService();
