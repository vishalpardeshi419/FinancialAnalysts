const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');


const { graphqlHTTP } = require('express-graphql');

const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');

const sequelize = require('./config/database');
const schema = require('./graphql/schema');

const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const { BearerStrategy: MicrosoftStrategy } = require("passport-azure-ad");
const jwt = require("jsonwebtoken");

const User = require('./models/user');

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

app.use('/api', planRoutes);

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log('Sync error: ' + err));

// Middleware
app.use(cors({ origin: "http://localhost:5500", credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// User serialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5500/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in your Sequelize model
        let user = await User.findOne({ where: { oauth_user_id: profile.id } });
        
        const dummyDate = new Date('2023-01-01T00:00:00Z'); // Dummy date for testing
        const hashedPassword = "hashedPassword"; // The hashed password for regular signups
        
        const userData = {
          username: profile.displayName,
          email: profile.emails[0].value,
          current_plan: "dem",
          trial_end_date: dummyDate,
          role: "User",
          oauth_user_id: profile.id,
          oauth_provider: 'google',
          createdAt: dummyDate,  // Dummy date for testing
          updatedAt: dummyDate,  // Dummy date for testing
        };
        
        // Add password only for regular signup (not OAuth)
        if (!user) {
          userData.password = hashedPassword; // Only add the password for new users, not for OAuth
        }

        // If user doesn't exist, create a new user record using Sequelize ORM
        if (!user) {
          user = await User.create(userData);
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);


// Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {

    const payload = {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`http://localhost:3500?token=${token}`);
  }
);

app.listen(PORT, () =>{
    console.log("Server Is Live", {PORT});
})

