require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb+srv://ahmadraza_db_user:kkDDsfTtvDqoWbWjb@unity.qmlmvsq.mongodb.net/Unity?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => { console.log('Connected ✅'); process.exit(0); })
  .catch(err => { console.error('Error ❌', err); process.exit(1); });
