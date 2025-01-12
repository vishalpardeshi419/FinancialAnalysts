const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { graphqlHTTP } = require('express-graphql');
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/database');
const schema = require('./graphql/schema');

const PORT = 5500;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log('Sync error: ' + err));

app.listen(PORT, () =>{
    console.log("Server Is Live", {PORT});
})

