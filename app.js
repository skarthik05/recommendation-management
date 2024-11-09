const express = require('express');
const app = express();
const collectionsRoutes = require('./routes/collectionsRoutes');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

app.use(express.json());

app.use('/api', collectionsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
