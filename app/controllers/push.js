const webPush = require('web-push');
const Push = require('../models/Push');

exports.subscribe = (req, res) => {
    const endpoint = req.body;

    const push = new Push({
        endpoint: endpoint.endpoint,
        keys: {
            p256dh: endpoint.keys.p256dh,
            auth: endpoint.keys.auth
        }
    });

    push.save((err, push) => {
        const payload = JSON.stringify({
            title: 'Welcome',
            body: 'Thank you for enabling push notifications',
            icon: '/android-chrome-192x192.png'
        });

        const options = {
            TTL: 86400,
        };

        const subscription = {
            endpoint: endpoint.endpoint,
            keys: {
                p256dh: endpoint.keys.p256dh,
                auth: endpoint.keys.auth
            }
        };

        webPush.sendNotification(
            subscription,
            payload,
            options
        ).then(function () {
            console.log("Send welcome push notification");
        }).catch(err => {
            console.error("Unable to send welcome push notification", err);
        });

        res.status(200).send('subscribe');
    });
};

exports.unsubscribe = (req, res) => {
    const endpoint = req.body.endpoint;

    Push.findOneAndRemove({endpoint: endpoint}, function (err, data) {
        if (err) {
            console.error('error with unsubscribe', error);
            res.status(500).send('unsubscription not possible');
        }
        console.log('unsubscribed');
        res.status(200).send('unsubscribe');
    });
};

exports.addMessage = (req, res) => {
    Push.find().then((clients) => {
        const options = {
            TTL: 86400,
        };

        const payload = JSON.stringify({
            title: 'New message from User',
            body: req.body.text,
        });

        clients.forEach(client => {
            const subscription = {
                endpoint: client.endpoint,
                keys: client.keys,
            };

            webPush.sendNotification(
                subscription,
                payload,
                options,
            ).then(function () {
                console.log('Send welcome push notification');
            }).catch(err => {
                console.error('Unable to send welcome push notification', err);
            });
        });

        res.json(clients);
    });
};
