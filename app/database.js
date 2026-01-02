const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://default:secret@database:27017/main');
mongoose.connection.on('error', (e) => {
    console.error(e);
    process.exit();
});
