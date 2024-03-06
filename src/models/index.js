import { Sequelize } from 'sequelize'
import { dbConfig } from '../config/index.js'
import userModel from './user.model.js'
import tokenModel from './token.model.js'
import productModel from "./product.model.js";
import categoryModel from "./category.model.js";

let sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        dialect: dbConfig.dialect,
        host: dbConfig.HOST,
        pool: dbConfig.pool,
        operatorsAliases: 0,
        ssl: true
    }
)

const db = {}

// adding sequelize to db object
db.Sequelize = Sequelize
db.sequelize = sequelize

// -- models -- //
const { User } = userModel(sequelize, Sequelize)
const { Token } = tokenModel(sequelize, Sequelize)
const { Product } = productModel(sequelize, Sequelize)
const { Category } = categoryModel(sequelize, Sequelize)

// models associations
// User to Token
User.hasMany(Token, { foreignKey: 'user_id', as: 'tokens' })
Token.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

// adding models to db object
Object.assign(db, { User, Token, Product, Category })

export default db
