const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    /**
     * Register a new restaurant (SaaS Tenant) and its Manager
     */
    async registerRestaurant(registerData) {
        try {
            // 1. Verify if user already exists
            const existingUser = await User.findOne({ email: registerData.manager_email });
            if (existingUser) {
                throw new Error('A user with this email already exists');
            }

            const newRestaurant = new Restaurant({
                name: registerData.restaurant_name,
                email: registerData.restaurant_email,
                phone: registerData.restaurant_phone,
                address: registerData.restaurant_address,
                concept_type: registerData.concept_type,
                opening_time: registerData.opening_time,
                closing_time: registerData.closing_time,
                is_24h: registerData.is_24h || false,
                enabled_roles: registerData.enabled_roles || ['WAITER', 'KITCHEN', 'CASHIER', 'MANAGER', 'ASSISTANT_MANAGER'],
                welcome_banner: registerData.welcome_banner || `Welcome to ${registerData.restaurant_name}${registerData.concept_type ? ' ' + registerData.concept_type : ''}! Enjoy your meal.`
            });
            const savedRestaurant = await newRestaurant.save();

            // 3. Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(registerData.password, salt);

            // 4. Create the Manager User linked to the Restaurant
            const newManager = new User({
                name: registerData.manager_name,
                email: registerData.manager_email,
                phone: registerData.manager_phone,
                password_hash: hashedPassword,
                role: 'MANAGER',
                restaurant_id: savedRestaurant._id,
            });
            await newManager.save();

            logger.info('New Restaurant SaaS account created', {
                restaurantId: savedRestaurant._id,
                managerId: newManager._id
            });

            return {
                restaurant: savedRestaurant,
                manager: {
                    id: newManager._id,
                    name: newManager.name,
                    email: newManager.email,
                    role: newManager.role
                }
            };
        } catch (error) {
            logger.error('Error in registerRestaurant Service', { error: error.message });
            throw error;
        }
    }

    /**
     * Login user
     */
    async login(email, password) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            // Create JWT
            const payload = {
                user: {
                    id: user._id,
                    role: user.role,
                    restaurant_id: user.restaurant_id
                }
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET || 'super_secret_temporary_key_for_dev',
                { expiresIn: '24h' }
            );

            return {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    restaurant_id: user.restaurant_id
                }
            };
        } catch (error) {
            logger.error('Error in login Service', { error: error.message });
            throw error;
        }
    }
}

module.exports = new AuthService();
