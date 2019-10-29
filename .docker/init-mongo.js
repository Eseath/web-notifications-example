db.createUser({
    user: 'default',
    pwd: 'secret',
    roles: [
        {
            role: 'readWrite',
            db: 'main'
        }
    ]
})
