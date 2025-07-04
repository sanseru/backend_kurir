# Express API Backend Template

This is a backend API built with Express.js and Sequelize ORM with a robust role-based authentication system.

## Description

This project provides a flexible backend API template with user authentication, role-based access control, and permission management. It uses JWT for authentication and includes models for Users, Roles, and Permissions with many-to-many relationships.

## Features

- User registration and authentication
- JWT-based authorization
- Role-based access control
- Permission management
- MySQL database with Sequelize ORM
- API documentation with JSDoc comments
- Ready-to-use middleware for route protection

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL server
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sanseru/express_api_template.git
cd express_api_template
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following content:
```
DB_NAME=expressapi
DB_USERNAME=root
DB_PASSWORD=your_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret_key
```

4. Run database migrations:
```bash
npx sequelize-cli db:migrate
```

5. Seed the database with initial data:
```bash
npx sequelize-cli db:seed:all
```

6. Start the server:
```bash
npm start
```

## Database Structure

The application uses the following main models:
- `User`: Manages user accounts
- `Role`: Defines roles like Admin, Manager, Employee
- `Permission`: Defines granular permissions for actions
- `RolePermission`: Junction table connecting roles to permissions
- `UserRole`: Junction table connecting users to roles

## API Routes

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `POST /api/auth/logout` - Logout current user

### Roles
- `GET /api/roles` - Get all roles (requires Admin or Manager role)
- `GET /api/roles/:id` - Get role by ID (requires authentication)
- `POST /api/roles` - Create new role (requires Admin role)
- `PUT /api/roles/:id` - Update role (requires Admin role)
- `DELETE /api/roles/:id` - Delete role (requires Admin role)

## Default Accounts

After seeding the database, you can use the following default account:
- Email: `admin@example.com`
- Password: `admin123`
- Role: Admin

## Development

### Folder Structure
```
/backendapi
  /config        - Database and app configuration
  /controllers   - API route handlers
  /middleware    - Express middlewares
  /migrations    - Sequelize migrations
  /models        - Sequelize data models
  /routes        - Express routes
  /seeders       - Database seeds
  server.js      - Main application entry point
```

### Adding New Models

To create a new model and its migration:
```bash
npx sequelize-cli model:generate --name YourModel --attributes attribute1:string,attribute2:integer
```

### Creating New Seeds

To create a new seeder:
```bash
npx sequelize-cli seed:generate --name your-seeder-name
```

### Adding New Routes

To add new routes to your API:

1. Create a new controller in the `/controllers` directory
# Creating a Controller Example

Here's an example of how to create a new controller for a products feature in your Express API:

```javascript
const { Product } = require('../models');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({ 
      success: true, 
      data: products 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Admin only)
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      stock
    });

    return res.status(201).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: error.errors.map(e => e.message) 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (Admin only)
 */
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      stock: stock || product.stock
    });

    return res.status(200).json({ 
      success: true, 
      data: product 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin only)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    await product.destroy();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
```

This controller follows RESTful principles with CRUD operations for a product resource. It includes proper error handling and follows the response format consistent with your existing API structure. Each function is also documented with JSDoc comments explaining the route, HTTP method, and access level.

2. Create a new route file in the `/routes` directory
3. Register your route in index.js

```javascript
// Example: Add product routes
const productRoutes = require('./product');
router.use('/products', productRoutes);
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.