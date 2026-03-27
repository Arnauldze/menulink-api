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
     * Update an employee's info (name, email, phone, role)
     */
    async updateEmployee(restaurantId, userId, updateData) {
        try {
            // Cannot update a MANAGER through this endpoint
            const user = await User.findOne({ _id: userId, restaurant_id: restaurantId });
            if (!user) {
                throw new Error('Employee not found');
            }
            if (user.role === 'MANAGER') {
                throw new Error('Cannot modify a MANAGER account through this endpoint');
            }

            // Prevent promoting to MANAGER
            if (updateData.role === 'MANAGER') {
                throw new Error('Cannot assign MANAGER role through this endpoint');
            }

            // Check email uniqueness if email is being changed
            if (updateData.email && updateData.email !== user.email) {
                const existingUser = await User.findOne({ email: updateData.email });
                if (existingUser) {
                    throw new Error('A user with this email already exists');
                }
            }

            // Only allow updating specific fields
            const allowedFields = ['name', 'email', 'phone', 'role'];
            const updates = {};
            for (const field of allowedFields) {
                if (updateData[field] !== undefined) {
                    updates[field] = updateData[field];
                }
            }

            const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true })
                .select('-password_hash');

            logger.info('Employee updated', { userId, updates: Object.keys(updates) });
            return updatedUser;
        } catch (error) {
            logger.error('Error updating employee', { error: error.message });
            throw error;
        }
    }

    /**
     * Generate a random password
     */
    _generatePassword(length = 8) {
        const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const lowercase = 'abcdefghjkmnpqrstuvwxyz';
        const digits = '23456789';
        const special = '!@#$&*';
        const all = uppercase + lowercase + digits + special;

        // Guarantee at least one of each type
        let password = '';
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += digits[Math.floor(Math.random() * digits.length)];
        password += special[Math.floor(Math.random() * special.length)];

        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            password += all[Math.floor(Math.random() * all.length)];
        }

        // Shuffle the password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    /**
     * Reset an employee's password (Manager action)
     * Auto-generates a new password and returns it in plain text
     */
    async resetPassword(restaurantId, userId) {
        try {
            const user = await User.findOne({ _id: userId, restaurant_id: restaurantId });
            if (!user) {
                throw new Error('Employee not found');
            }
            if (user.role === 'MANAGER') {
                throw new Error('Cannot reset MANAGER password through this endpoint');
            }

            const newPassword = this._generatePassword();

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await User.findByIdAndUpdate(userId, { password_hash: hashedPassword });

            logger.info('Employee password reset', { userId });
            return {
                message: 'Password reset successfully',
                new_password: newPassword
            };
        } catch (error) {
            logger.error('Error resetting password', { error: error.message });
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
