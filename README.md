# Web Notifications Example

This demo shows how to send notifications from back-end to web browser clients using [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) and [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/notification).

## Configuration

You need to set keys in the `.env`.

`GCM_KEY` – it's a server key.

## Where to get the keys?

1. Go to https://console.firebase.google.com/;
2. Create a project;
3. Add web application;
4. Go to Settings / Cloud Messaging / Web Configuration
5. Create a key pair

## Launching

```bash
$ npm i
$ docker-compose up -d
```

## How to see it in action?

1. Open home page in two browsers / devices.
2. Click to checkbox on the page to enable notification in the first browser.
3. Send a message in the chat in the second browser.
