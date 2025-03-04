const {Sequelize} = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: process.env.DB_DIALECT,
    }
);

sequelize
    .authenticate()
    .then(() => console.log('Database Connected'))
    .catch((error) => console.log("unable to Connect Database", error));

module.exports = sequelize;
