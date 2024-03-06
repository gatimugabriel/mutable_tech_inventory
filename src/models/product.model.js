export default (sequelize, Sequelize) => {
    const Product = sequelize.define("products", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sku: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        barcode: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        productName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        productDescription: {
            type: Sequelize.STRING,
        },
        pricePerUnit: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        category_id: {
            type: Sequelize.INTEGER,
            references: {
                model: "categories",
                key: "id",
            }
        },
        reOrderPoint: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 50
        },
        inStock: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 500
        },
        maximumStock: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 500
        },
    }, {
        freezeTableName: true,
        timestamps: true,
    })

    return {Product}
}
