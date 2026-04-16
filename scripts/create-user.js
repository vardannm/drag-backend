const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const [name, login, password] = process.argv.slice(2);

if (!name || !login || !password) {
  console.error('Usage: node scripts/create-user.js "Name" "login" "password"');
  process.exit(1);
}

async function createUser() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in environment');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const existingUser = await User.findOne({ login });
  if (existingUser) {
    throw new Error(`User with login "${login}" already exists`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, login, password: hashedPassword });
  await user.save();

  console.log(`User created: ${user.login}`);
}

createUser()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
