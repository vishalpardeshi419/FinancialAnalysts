const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const http = require('http');
const socketIo = require('socket.io');
const { graphqlHTTP } = require('express-graphql');

const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');
const sequelize = require('./config/database');
const schema = require('./graphql/schema');

const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require("jsonwebtoken");
const User = require('./models/user');

const PORT = 5500;

dotenv.config();

const app = express();
const server = http.createServer(app); // Use `server` for both HTTP and WebSocket

app.use(cors());
app.use(express.json());

// Socket.IO setup with proper CORS
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3500',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
});

global.io = io;

// Attach Socket.IO event listeners
io.on('connection', (socket) => {
  
  // Example Socket.IO event listeners
  socket.on('createPlan', (newPlan) => {
    io.emit('planCreated', newPlan); // Broadcast to all clients
  });

  socket.on('updatePlan', (updatedPlan) => {
    io.emit('planUpdated', updatedPlan); // Broadcast to all clients
  });

  socket.on('deletePlan', (deletedPlanId) => {
    io.emit('planDeleted', { id: deletedPlanId }); // Broadcast to all clients
  });
  
  // Listen for client disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


// Middleware

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// GraphQL and REST Routes
app.use('/api/auth', authRoutes);
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));
app.use('/api', planRoutes); // Ensure planRoutes is configured to handle `/api/plans`

// Sequelize Sync
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log('Sync error: ' + err));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5500/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { oauth_user_id: profile.id } });
    if (!user) {
      user = await User.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        oauth_user_id: profile.id,
        oauth_provider: 'google',
      });
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const payload = {
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.redirect(`http://localhost:3500?token=${token}`);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});


