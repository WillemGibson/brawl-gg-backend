# brawl-gg-backend

## Routes

### User

    Endpoint name : Get All Users
    Request Type: GET
    address: http://brawls.io/user/all
    Authorization required: Admin user JWT Authurization

    ------------------------------------------------------------------------

    Endpoint name : Get One User
    Request Type: GET
    address: 
    http://brawls.io/user/
    Authorization header required: JWT Created by User
    

    -------------------------------------------------------------------------

    Endpoint name : Create User
    Request type: POST
    address: https://brawls.io/user/:id
    Authorization header required: None
    Sample JSON:
    {
    "username": "Ben",
    "email": "ben@email.com.au",
    "password": "Coderacademy1!",
    "profile picture": "image",
    }

    -------------------------------------------------------------------------

    
    Endpoint name : Update User
    Request type: PATCH
    address: http://brawls.io/user/
    Authorization required: JWT Created by User
    Sample JSON:
    {
    "name": "Jimmy",
    "email": "jimmy@email.com.au",
    "password": "Coderacademy1!",
    "profile picture": "image",
    }

    Optional inputs = ["name", "email", "password", "profile picture"]

    ----------------------------------------------------------------------

    Endpoint name : Delete User
    Request type: Delete
    address: 
    http://brawls.io/user/
    Authorization required: JWT Created by User

## Schemas

user {
    username,
    email,
    password,
    profile image,
    isAdmin (An Admin can only be created by another admin)
}

chats {
    message,
    userId,
    TournamentId,
    CreatedAt
}

tournament {
    tournamentName,
    author,
    users[],
    chats
}

## Dependancies

- cors
- dotenv
- express
- google-auth-library
- googleapis
- mongoose
- nodemailer
- socket.io
- jsonwebtoken