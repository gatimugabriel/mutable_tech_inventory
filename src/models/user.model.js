import { genSalt, hash, compare } from 'bcrypt';

export default (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userName: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.ENUM('admin', 'editor'),
            defaultValue: 'editor',
        }
    }, {
        freezeTableName: true,
        timestamps: true,
        hooks: {
            // -- hash password before saving user
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await genSalt(10);
                    user.password = await hash(user.password, salt);
                }
            }
        }
    })

    // --  matchPassword prototype method
    User.prototype.matchPassword = async function (inputPassword) {
        return await compare(inputPassword, this.password);
    };

    return { User }
}