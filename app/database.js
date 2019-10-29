const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://default:secret@database:27017/main', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('error', () => {
    console.log('MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
});
