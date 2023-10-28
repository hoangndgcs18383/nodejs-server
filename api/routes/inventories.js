const express = require('express');
const routes = express.Router();
const checkAuth = require('../middleware/check-auth')

const InventoryController = require('../controllers/inventories')


//Get All : /inventories
routes.get('/', checkAuth, InventoryController.inventories_get_all);
//Post : /inventories
routes.post('/', checkAuth, InventoryController.create_inventory_account);
//Get UserId : /inventoryId/{inventoryId}
routes.get('/:inventoryId', checkAuth, InventoryController.find_inventory_account);
//Patch UserId : /inventoryId/{inventoryId}
routes.patch('/:inventoryId', checkAuth, InventoryController.update_inventory_account);
//Delete UserId : /inventoryId/{inventoryId}
routes.delete('/:inventoryId', checkAuth, InventoryController.delete_inventory_account);

module.exports = routes;