const homeController = require('./controllers/home');
const pushController = require('./controllers/push');

module.exports = function (app) {
    app.get('/', homeController.index);
    app.post('/api/messages', pushController.addMessage);
    app.post('/api/subscribe', pushController.subscribe);
    app.post('/api/unsubscribe', pushController.unsubscribe);
};
