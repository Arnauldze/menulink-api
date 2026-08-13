const OrderService = require('../services/OrderService');
const logger = require('../utils/logger');

class OrderController {

    /**
     * Create new order
     * POST /api/orders
     */
    async createOrder(req, res, next) {
        try {
            // Assuming session might be passed in headers or body
            // For now, let's assume session_id is in the body for simplicity
            // In a cleaner auth system, it would be in req.user.session_id
            const { session_id, items, note } = req.body;

            if (!session_id || !items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'An error occurred' }
                });
            }

            const order = await OrderService.createOrder(session_id, items, note);

            res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                data: order
            });
        } catch (error) {
            logger.error('Error creating order', { error: { message: 'An error occurred' } });
            next(error);
        }
    }

    /**
     * Get order details
     * GET /api/orders/:id
     */
    async getOrder(req, res, next) {
        try {
            const { id } = req.params;
            const order = await OrderService.getOrderById(id);

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            logger.error('Error getting order', { error: { message: 'An error occurred' } });
            if (error.message.includes('not found')) {
                return res.status(404).json({ success: false, error: { message: 'An error occurred' } });
            }
            next(error);
        }
    }

    /**
     * List orders for a session (Client view)
     * GET /api/orders?session_id=...
     */
    async listOrders(req, res, next) {
        try {
            const { session_id } = req.query;

            if (!session_id) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'An error occurred' }
                });
            }

            const orders = await OrderService.getOrdersBySession(session_id);

            res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });
        } catch (error) {
            logger.error('Error listing orders', { error: { message: 'An error occurred' } });
            next(error);
        }
    }

    /**
     * List all active orders for the Kitchen view (Requires JWT)
     * GET /api/orders/kitchen
     */
    async getRestaurantOrders(req, res, next) {
        try {
            const restaurantId = req.user.restaurant_id;
            const orders = await OrderService.getRestaurantOrders(restaurantId);

            res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });
        } catch (error) {
            logger.error('Error getting kitchen orders', { error: { message: 'An error occurred' } });
            next(error);
        }
    }

    /**
     * Update status (Kitchen view)
     * PATCH /api/orders/:id/status
     */
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ success: false, error: { message: 'An error occurred' } });
            }

            const order = await OrderService.updateOrderStatus(req.user.restaurant_id, id, status);

            res.status(200).json({
                success: true,
                message: `Order status updated to ${status}`,
                data: order
            });
        } catch (error) {
            logger.error('Error updating status', { error: { message: 'An error occurred' } });
            next(error);
        }
    }
}

module.exports = new OrderController();
