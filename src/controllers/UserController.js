const UserService = require('../services/UserService');
const logger = require('../utils/logger');

class UserController {
    /**
     * Create an employee
     * POST /api/users
     */
    async createEmployee(req, res, next) {
        try {
            // Seul le MANAGER devrait pouvoir faire ça idéalement
            if (req.user.role !== 'MANAGER') {
                return res.status(403).json({
                    success: false,
                    error: { message: "Seul le gérant principal (MANAGER) peut ajouter de nouveaux employés." }
                });
            }

            const { name, email, password, role, phone } = req.body;

            if (!name || !email || !password || !role) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Les champs name, email, password et role sont requis' }
                });
            }

            const employee = await UserService.createEmployee(req.user.restaurant_id, req.body);

            res.status(201).json({
                success: true,
                message: 'Employé créé avec succès',
                data: employee
            });
        } catch (error) {
            logger.error('Error in createEmployee', { error: error.message });
            res.status(400).json({
                success: false,
                error: { message: error.message }
            });
        }
    }

    /**
     * List employees
     * GET /api/users
     */
    async getEmployees(req, res, next) {
        try {
            const employees = await UserService.getEmployees(req.user.restaurant_id);
            res.status(200).json({
                success: true,
                count: employees.length,
                data: employees
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete an employee
     * DELETE /api/users/:id
     */
    async deleteEmployee(req, res, next) {
        try {
            if (req.user.role !== 'MANAGER') {
                return res.status(403).json({
                    success: false,
                    error: { message: "Seul le gérant (MANAGER) peut supprimer des employés." }
                });
            }
            const { id } = req.params;
            await UserService.deleteEmployee(req.user.restaurant_id, id);

            res.status(200).json({
                success: true,
                message: "Employé supprimé avec succès."
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: { message: error.message }
            });
        }
    }
}

module.exports = new UserController();
