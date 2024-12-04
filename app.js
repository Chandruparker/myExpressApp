// const express = require('express');
// const bodyParser = require('body-parser');
// const authRoutes = require('./routes/authRoutes');
// const crudRoutes = require('./routes/crudRoutes');
// var cors = require('cors')
// const app = express();
// const PORT = 3000;
// app.use(cors())

// // Middleware
// app.use(bodyParser.json());

// // Routes
// app.use('/auth', authRoutes);
// app.use('/api', crudRoutes);

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const crudRoutes = require('./routes/crudRoutes');
const productRoutes = require('./routes/products')
var cors = require('cors')
const connectDB = require('./db');

const app = express();
connectDB()
app.use(bodyParser.json());
app.use(cors())

app.use('/auth', authRoutes);
app.use('/api', crudRoutes);
app.use('/api/products', productRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

