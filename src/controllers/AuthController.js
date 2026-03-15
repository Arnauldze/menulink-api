const AuthService = require('../services/AuthService');
const logger = require('../utils/logger');

class AuthController {
    /**
     * Register a new Restaurant (SaaS)
     * POST /api/auth/register
     */
    async register(req, res, next) {
        try {
            const {
                restaurant_name,
                restaurant_email,
                restaurant_phone,
                restaurant_address,
                concept_type,
                opening_time,
                closing_time,
                is_24h,
                enabled_roles,
                manager_name,
                manager_email,
                manager_phone,
                password
            } = req.body;

            // Basic Validation
            if (!restaurant_name || !manager_email || !password || !manager_name) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Missing required fields (restaurant_name, manager_name, manager_email, password)' }
                });
            }

            const result = await AuthService.registerRestaurant(req.body);

            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: result
            });
        } catch (error) {
            logger.error('Error in AuthController register', { error: { message: error.message || 'An error occurred' } });
            next(error);
        }
    }

    /**
     * Login user
     * POST /api/auth/login
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Email and password are required' }
                });
            }

            const result = await AuthService.login(email, password);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error) {
            logger.error('Error in AuthController login', { error: { message: error.message || 'An error occurred' } });
            // If "Invalid credentials"
            if (error.message.includes('credentials')) {
                return res.status(401).json({
                    success: false,
                    error: { message: error.message }
                });
            }
            next(error);
        }
    }
}

module.exports = new AuthController();
