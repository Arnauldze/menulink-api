const Order = require('../models/Order');
const Dish = require('../models/Dish');
const Session = require('../models/ClientSession');
const Table = require('../models/Table');
const logger = require('../utils/logger');

class OrderService {
    /**
     * Create a new order
     */
    async createOrder(sessionId, items, note = '') {
        try {
            // 1. Verify session
            const session = await Session.findOne({ session_id: sessionId });
            if (!session) {
                throw new Error('Invalid or expired session');
            }

            // 2. Format items and calculate total price
            const orderItems = [];
            let calculatedTotal = 0;

            for (const item of items) {
                const dish = await Dish.findById(item.dish_id);

                if (!dish) {
                    throw new Error(`Dish with ID ${item.dish_id} not found`);
                }

                if (!dish.is_available) {
                    throw new Error(`Dish "${dish.name}" is currently unavailable`);
                }

                let itemTotal = dish.price * item.quantity;
                const formattedExtras = [];

                if (item.selected_extras && item.selected_extras.length > 0) {
                    for (const extra of item.selected_extras) {
                        // Verify the extra exists for this dish to prevent price tampering
                        const validExtra = dish.extras.find(e => e.name === extra.name);
                        if (!validExtra) {
                            throw new Error(`Extra "${extra.name}" is not valid for dish "${dish.name}"`);
                        }
                        itemTotal += validExtra.price * item.quantity;
                        formattedExtras.push({ name: validExtra.name, price: validExtra.price });
                    }
                }

                calculatedTotal += itemTotal;

                orderItems.push({
                    dish_id: dish._id,
                    name: dish.name,
                    quantity: item.quantity,
                    price: dish.price,
                    selected_extras: formattedExtras,
                    comment: item.comment || ''
                });
            }

            // 3. Create Order
            const order = new Order({
                restaurant_id: session.restaurant_id,
                table_id: session.table_id,
                session_id: sessionId,
                items: orderItems,
                total_price: calculatedTotal,
                note: note,
                status: 'PENDING'
            });

            await order.save();
            logger.info('Order created', { orderId: order._id, tableId: session.table_id, total: calculatedTotal });

            return order;
        } catch (error) {
            logger.error('Error creating order', { error: error.message });
            throw error;
        }
    }

    /**
     * Get order by ID
     */
    async getOrderById(orderId) {
        try {
            const order = await Order.findById(orderId)
                .populate('table_id')
                .populate('items.dish_id');

            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        } catch (error) {
            logger.error('Error getting order', { error: error.message });
            throw error;
        }
    }

    /**
     * Get orders by session
     */
    async getOrdersBySession(sessionId) {
        try {
            const orders = await Order.find({ session_id: sessionId })
                .sort({ createdAt: -1 });
            return orders;
        } catch (error) {
            logger.error('Error getting session orders', { error: error.message });
            throw error;
        }
    }

    /**
     * Get orders for the kitchen/admin view (Only for a specific restaurant)
     */
    async getRestaurantOrders(restaurantId) {
        try {
            // Get all orders that are not PAID or CANCELLED for this restaurant
            const orders = await Order.find({
                restaurant_id: restaurantId,
                status: { $nin: ['PAID', 'CANCELLED'] }
            })
                .populate('table_id', 'table_number')
                .sort({ createdAt: -1 });
            return orders;
        } catch (error) {
            logger.error('Error getting restaurant orders', { error: error.message });
            throw error;
        }
    }

    /**
     * Update order status
     */
    async updateOrderStatus(restaurantId, orderId, status) {
        try {
            const allowedStatuses = ['PENDING', 'PREPARING', 'READY', 'SERVED', 'PAID', 'CANCELLED'];
            if (!allowedStatuses.includes(status)) {
                throw new Error(`Invalid status: ${status}`);
            }

            const order = await Order.findOneAndUpdate(
                { _id: orderId, restaurant_id: restaurantId },
                { status },
                { new: true }
            );

            if (!order) {
                throw new Error('Order not found');
            }

            logger.info('Order status updated', { orderId, status });
            return order;
        } catch (error) {
            logger.error('Error updating order status', { error: error.message });
            throw error;
        }
    }
}

module.exports = new OrderService();
