let serviceWorkerRegistration;

import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
    setup() {
        const newComment = ref('');
        const notificationEnabled = ref(false);
        const messages = ref([
            {
                authorImage: '/avatar.svg',
                text: 'We invite you at our office for visit',
            },
            {
                authorImage: '/avatar.svg',
                text: 'It\'s like dream come true thank you so much',
                owned: true,
            },
        ]);

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
                notificationEnabled.value = !(subscription === null);
            });
        }).catch(function (error) {
            console.error('Service Worker Error', error);
        });

        function sendComment() {
            if (!newComment.value) {
                return;
            }

            fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: newComment.value,
                })
            });

            messages.value.push({
                authorImage: '/avatar.svg',
                text: newComment.value,
                owned: true,
            });

            newComment.value = '';
        }

        function requestSubscribePermission() {
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
                        subscribeUser();
                    }
                });
            } else {
                subscribeUser();
            }
        }

        function subscribeUser() {
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
        }

        function unsubscribeUser() {
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
        }

        function toggle() {
            if (notificationEnabled.value) {
                requestSubscribePermission();
            } else {
                unsubscribeUser();
            }
        }

        return { newComment, notificationEnabled, messages, toggle, sendComment };
    },
}).mount('#app');

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
