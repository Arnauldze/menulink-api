/**
 * Seed route - Pour peupler la BD en production
 * À utiliser UNIQUEMENT en développement ou pour setup initial
 */

const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const Menu = require('../models/Menu');
const Category = require('../models/Category');
const Dish = require('../models/Dish');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * @route   POST /api/seed
 * @desc    Populate database with test data
 * @access  Public (⚠️ À sécuriser en production!)
 */
router.post('/', async (req, res) => {
  try {
    logger.info('Starting database seed...');

    // Clear existing data
    await Table.deleteMany({});
    await Menu.deleteMany({});
    await Category.deleteMany({});
    await Dish.deleteMany({});
    await User.deleteMany({});
    logger.info('Cleared existing data');

    // Create a gestionnaire user
    const gestionnaire = new User({
      name: 'Admin Gestionnaire',
      email: 'gestionnaire@restaurant.com',
      password_hash: 'hashed_password_here',
      role: 'MANAGER',
    });
    await gestionnaire.save();

    // Create tables
    const tables = [];
    for (let i = 1; i <= 5; i++) {
      const table = new Table({
        table_number: i,
        qr_code: `table_${i}_${Date.now()}`,
        active: true,
      });
      await table.save();
      tables.push(table);
    }

    // Create menu
    const menu = new Menu({
      name: 'Menu Principal',
      manager_id: gestionnaire._id,
      is_active: true,
    });
    await menu.save();

    // Create categories
    const categories = [];
    const categoryNames = ['Entrées', 'Plats Principaux', 'Desserts', 'Boissons'];
    for (const name of categoryNames) {
      const category = new Category({
        menu_id: menu._id,
        name: name,
        display_order: categoryNames.indexOf(name),
      });
      await category.save();
      categories.push(category);
    }

    // Create dishes - Mix Cuisine Camerounaise et Moderne
    const dishesData = [
      // Entrées - Camerounaises
      { name: 'Beignets Haricots', description: 'Beignets de haricots épicés (Accra)', price: 500, category_id: categories[0]._id },
      { name: 'Soya', description: 'Brochettes de bœuf marinées', price: 1000, category_id: categories[0]._id },
      { name: 'Poisson Braisé', description: 'Poisson frais grillé aux épices', price: 2500, category_id: categories[0]._id },
      { name: 'Bâtons de Manioc', description: 'Bâtons de manioc frits croustillants', price: 800, category_id: categories[0]._id },
      { name: 'Plantains Frits', description: 'Plantains mûrs frits dorés', price: 700, category_id: categories[0]._id },
      
      // Entrées - Modernes
      { name: 'Salade César', description: 'Salade romaine, poulet grillé, parmesan, croûtons', price: 2500, category_id: categories[0]._id },
      { name: 'Soupe du Jour', description: 'Soupe maison préparée quotidiennement', price: 1500, category_id: categories[0]._id },
      { name: 'Ailes de Poulet BBQ', description: '6 ailes de poulet sauce barbecue', price: 2000, category_id: categories[0]._id },
      { name: 'Calamars Frits', description: 'Anneaux de calamars panés avec sauce tartare', price: 3000, category_id: categories[0]._id },
      { name: 'Nachos Supreme', description: 'Nachos, fromage fondu, guacamole, crème', price: 2500, category_id: categories[0]._id },
      
      // Plats Principaux - Camerounais
      { name: 'Ndolé', description: 'Feuilles de ndolé aux arachides avec viande', price: 3000, category_id: categories[1]._id },
      { name: 'Eru', description: 'Légumes eru avec viande fumée et crevettes', price: 3500, category_id: categories[1]._id },
      { name: 'Koki', description: 'Gâteau de haricots cuit à la vapeur', price: 1500, category_id: categories[1]._id },
      { name: 'Poulet DG', description: 'Poulet Directeur Général avec plantains et légumes', price: 4000, category_id: categories[1]._id },
      { name: 'Sauce Arachide', description: 'Sauce d\'arachide avec viande et plantains', price: 2500, category_id: categories[1]._id },
      { name: 'Kondre', description: 'Plantains bouillis avec sauce tomate épicée', price: 2000, category_id: categories[1]._id },
      { name: 'Okok', description: 'Feuilles d\'okok avec crevettes et viande fumée', price: 3500, category_id: categories[1]._id },
      { name: 'Kati Kati', description: 'Poulet grillé mariné aux épices locales', price: 3500, category_id: categories[1]._id },
      { name: 'Poisson Sauce Gombo', description: 'Poisson frais en sauce gombo', price: 3000, category_id: categories[1]._id },
      { name: 'Sangha', description: 'Maïs pilé avec sauce jaune', price: 2000, category_id: categories[1]._id },
      
      // Plats Principaux - Modernes
      { name: 'Burger Classique', description: 'Steak haché, fromage, salade, tomate, oignons, frites', price: 3500, category_id: categories[1]._id },
      { name: 'Burger Poulet Crispy', description: 'Poulet pané croustillant, sauce mayo, frites', price: 3200, category_id: categories[1]._id },
      { name: 'Pizza Margherita', description: 'Sauce tomate, mozzarella, basilic frais', price: 4000, category_id: categories[1]._id },
      { name: 'Pizza 4 Fromages', description: 'Mozzarella, gorgonzola, parmesan, chèvre', price: 4500, category_id: categories[1]._id },
      { name: 'Pizza Pepperoni', description: 'Sauce tomate, mozzarella, pepperoni', price: 4200, category_id: categories[1]._id },
      { name: 'Pâtes Carbonara', description: 'Pâtes crémeuses, lardons, parmesan', price: 3000, category_id: categories[1]._id },
      { name: 'Pâtes Bolognaise', description: 'Pâtes sauce viande mijotée', price: 2800, category_id: categories[1]._id },
      { name: 'Steak Frites', description: 'Entrecôte grillée 250g avec frites maison', price: 5000, category_id: categories[1]._id },
      { name: 'Poulet Rôti', description: 'Demi-poulet rôti, frites et salade', price: 3500, category_id: categories[1]._id },
      { name: 'Poisson Grillé', description: 'Filet de poisson grillé, riz et légumes', price: 4000, category_id: categories[1]._id },
      { name: 'Tacos Poulet', description: '3 tacos au poulet, guacamole, fromage', price: 2500, category_id: categories[1]._id },
      { name: 'Shawarma Poulet', description: 'Wrap poulet mariné, sauce blanche, frites', price: 2000, category_id: categories[1]._id },
      { name: 'Shawarma Viande', description: 'Wrap viande marinée, sauce blanche, frites', price: 2200, category_id: categories[1]._id },
      
      // Desserts - Camerounais
      { name: 'Beignets Banane', description: 'Beignets de banane plantain sucrés', price: 500, category_id: categories[2]._id },
      { name: 'Puff Puff', description: 'Beignets sucrés moelleux', price: 300, category_id: categories[2]._id },
      { name: 'Fruits de Saison', description: 'Assortiment de fruits tropicaux frais', price: 1000, category_id: categories[2]._id },
      { name: 'Beignets Maïs', description: 'Beignets de maïs sucrés', price: 400, category_id: categories[2]._id },
      
      // Desserts - Modernes
      { name: 'Tiramisu', description: 'Dessert italien au café et mascarpone', price: 2000, category_id: categories[2]._id },
      { name: 'Crème Brûlée', description: 'Crème vanille caramélisée', price: 2200, category_id: categories[2]._id },
      { name: 'Fondant au Chocolat', description: 'Gâteau chocolat coulant, glace vanille', price: 2500, category_id: categories[2]._id },
      { name: 'Cheesecake', description: 'Gâteau au fromage, coulis fruits rouges', price: 2300, category_id: categories[2]._id },
      { name: 'Tarte Citron', description: 'Tarte au citron meringuée', price: 2000, category_id: categories[2]._id },
      { name: 'Glace 3 Boules', description: 'Vanille, chocolat, fraise', price: 1500, category_id: categories[2]._id },
      { name: 'Salade de Fruits', description: 'Fruits frais de saison', price: 1200, category_id: categories[2]._id },
      
      // Boissons - Locales
      { name: 'Jus de Bissap', description: 'Jus d\'hibiscus frais', price: 500, category_id: categories[3]._id },
      { name: 'Jus de Gingembre', description: 'Jus de gingembre épicé', price: 500, category_id: categories[3]._id },
      { name: 'Jus de Mangue', description: 'Jus de mangue naturel', price: 700, category_id: categories[3]._id },
      { name: 'Jus de Corossol', description: 'Jus de corossol frais', price: 800, category_id: categories[3]._id },
      { name: 'Jus d\'Ananas', description: 'Jus d\'ananas naturel', price: 600, category_id: categories[3]._id },
      { name: '33 Export', description: 'Bière locale 65cl', price: 600, category_id: categories[3]._id },
      { name: 'Beaufort', description: 'Bière locale 65cl', price: 600, category_id: categories[3]._id },
      { name: 'Castel', description: 'Bière 65cl', price: 700, category_id: categories[3]._id },
      { name: 'Top Grenadine', description: 'Boisson gazeuse locale', price: 400, category_id: categories[3]._id },
      { name: 'Top Orange', description: 'Boisson gazeuse orange', price: 400, category_id: categories[3]._id },
      
      // Boissons - Modernes
      { name: 'Coca Cola', description: 'Coca Cola 33cl', price: 500, category_id: categories[3]._id },
      { name: 'Coca Cola 1.5L', description: 'Coca Cola grande bouteille', price: 1000, category_id: categories[3]._id },
      { name: 'Fanta Orange', description: 'Fanta 33cl', price: 500, category_id: categories[3]._id },
      { name: 'Sprite', description: 'Sprite 33cl', price: 500, category_id: categories[3]._id },
      { name: 'Schweppes Tonic', description: 'Schweppes 33cl', price: 600, category_id: categories[3]._id },
      { name: 'Eau Minérale', description: 'Eau minérale 50cl', price: 300, category_id: categories[3]._id },
      { name: 'Eau Minérale 1.5L', description: 'Eau minérale grande bouteille', price: 500, category_id: categories[3]._id },
      { name: 'Eau Gazeuse', description: 'Eau gazeuse 50cl', price: 500, category_id: categories[3]._id },
      { name: 'Jus d\'Orange Pressé', description: 'Jus d\'orange frais pressé', price: 1000, category_id: categories[3]._id },
      { name: 'Smoothie Fruits', description: 'Smoothie fruits mixés', price: 1500, category_id: categories[3]._id },
      { name: 'Milkshake Vanille', description: 'Milkshake glace vanille', price: 1500, category_id: categories[3]._id },
      { name: 'Milkshake Chocolat', description: 'Milkshake glace chocolat', price: 1500, category_id: categories[3]._id },
      { name: 'Milkshake Fraise', description: 'Milkshake glace fraise', price: 1500, category_id: categories[3]._id },
      { name: 'Café Espresso', description: 'Café espresso italien', price: 800, category_id: categories[3]._id },
      { name: 'Café Américain', description: 'Café allongé', price: 1000, category_id: categories[3]._id },
      { name: 'Cappuccino', description: 'Café cappuccino mousseux', price: 1200, category_id: categories[3]._id },
      { name: 'Thé Chaud', description: 'Thé noir ou vert', price: 700, category_id: categories[3]._id },
      { name: 'Thé Glacé', description: 'Thé glacé citron', price: 800, category_id: categories[3]._id },
    ];

    const dishes = [];
    for (const dishData of dishesData) {
      const dish = new Dish({
        name: dishData.name,
        description: dishData.description,
        price: dishData.price,
        category_id: dishData.category_id,
        is_available: true,
      });
      await dish.save();
      dishes.push(dish);
    }

    logger.info('Database seeded successfully!');

    res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        tables: tables.length,
        menus: 1,
        categories: categories.length,
        dishes: dishes.length,
        users: 1,
        qr_codes: tables.map(t => ({
          table: t.table_number,
          qr_code: t.qr_code
        }))
      }
    });

  } catch (error) {
    logger.error('Error seeding database', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'SEED_ERROR',
        message: 'Failed to seed database',
        details: error.message
      }
    });
  }
});

/**
 * @route   GET /api/seed/status
 * @desc    Check if database has data
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const counts = {
      tables: await Table.countDocuments(),
      menus: await Menu.countDocuments(),
      categories: await Category.countDocuments(),
      dishes: await Dish.countDocuments(),
      users: await User.countDocuments(),
    };

    const isEmpty = Object.values(counts).every(count => count === 0);

    res.status(200).json({
      success: true,
      data: {
        isEmpty,
        counts,
        message: isEmpty ? 'Database is empty. Run POST /api/seed to populate.' : 'Database has data.'
      }
    });

  } catch (error) {
    logger.error('Error checking seed status', { error: error.message });
    res.status(500).json({
      success: false,
      error: {
        code: 'STATUS_ERROR',
        message: 'Failed to check database status',
        details: error.message
      }
    });
  }
});

module.exports = router;
