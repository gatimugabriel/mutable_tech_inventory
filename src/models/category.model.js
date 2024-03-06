export default (sequelize, Sequelize) => {
    const Category = sequelize.define("categories", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            categoryName: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
            }
        }
, {
        freezeTableName: true,
        timestamps: true,
    })

    return { Category }
}
