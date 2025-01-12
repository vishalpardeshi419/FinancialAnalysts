const { ClickHouse } = require('clickhouse');
require('dotenv').config();

const clickhouse = new ClickHouse({
  url: process.env.CLICKHOUSE_URL,
  port: process.env.CLICKHOUSE_PORT,
  protocol: 'http',
  user: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  database: process.env.CLICKHOUSE_DB,
});

module.exports = clickhouse;
