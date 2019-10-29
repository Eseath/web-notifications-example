const webPush = require('web-push');

webPush.setGCMAPIKey(process.env.GCM_KEY);
webPush.setVapidDetails(
    process.env.EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);
