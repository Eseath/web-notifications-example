'use strict';

let serviceWorkerRegistration;

new Vue({
    el: '#app',

    data: () => ({
        newComment: '',
        notificationEnabled: false,
        messages: [
            {
                authorImage: '/avatar.svg',
                text: 'We invite you at our office for visit',
            },
            {
                authorImage: '/avatar.svg',
                text: 'It\'s like dream come true thank you so much',
                owned: true,
            },
        ],
    }),

    methods: {
        sendComment() {
            if (!this.newComment) {
                return;
            }

            fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: this.newComment,
                })
            });

            this.messages.push({
                authorImage: '/avatar.svg',
                text: this.newComment,
                owned: true,
            });

            this.newComment = '';
        },

        requestSubscribePermission() {
            if (!('Notification' in window)) {
                alert('This browser does not support desktop notification');
                return;
            }

            if (Notification.permission === 'denied') {
                alert('Denied');
                return;
            }

            if (Notification.permission !== 'granted') {
                Notification.requestPermission().then(permission => {
                    if (permission !== 'granted') {
                        this.subscribeUser();
                    }
                });
            } else {
                this.subscribeUser();
            }
        },

        subscribeUser() {
            serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array(appServerKey)
            })
                .then(function(subscription) {
                    fetch('/api/subscribe',{
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(subscription)
                    }).then(response => response).then(function(text) {
                        console.log('User is subscribed.');
                    }).catch(function(error) {
                        console.error('error fetching subscribe', error);
                    });
                }).catch(function(err) {
                console.log('Failed to subscribe the user: ', err);
            });
        },

        unsubscribeUser() {
            serviceWorkerRegistration.pushManager.getSubscription()
                .then(function(subscription) {
                    if (subscription) {
                        subscriptionData = {
                            endpoint: subscription.endpoint
                        };

                        fetch('/api/unsubscribe',{
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(subscriptionData)
                        })
                            .then(function(response) {
                                return response;
                            })
                            .then(function(text) {
                                //
                            })
                            .catch(function(error) {
                                console.error('error fetching subscribe', error);
                            });

                        return subscription.unsubscribe();
                    }
                });
        },

        toggle() {
            if (this.notificationEnabled) {
                this.requestSubscribePermission();
            } else {
                this.unsubscribeUser();
            }
        },
    },

    created() {
        navigator.serviceWorker.addEventListener('message', event => {
            if (document.hasFocus()) {
                this.messages.push({
                    text: event.data.body,
                });
            } else {
                new Notification(event.data.title, {
                    body: event.data.body,
                    icon: '/avatar.svg',
                });
            }
        });

        navigator.serviceWorker.register('sw.js').then((sw) => {
            serviceWorkerRegistration = sw;
            serviceWorkerRegistration.pushManager.getSubscription().then((subscription) => {
                this.notificationEnabled = !(subscription === null);
            });
        }).catch(function (error) {
            console.error('Service Worker Error', error);
        });
    },
});

const appServerKey = 'BB5Fla8q_6TqXc66UiYgSuQOUxWRS5o9SXmiwnUGF77jXLi7YZ535BBmZmB5Z_aMe3kXCRvLNqntmGyE-9wP0_A';

let subscriptionData = false;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
