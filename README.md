# brawl-gg-backend

## JWT AUTHORIZATIONS

### USER JWT

    Created when the user logins into the web app. refreshed on every route hit by the user. has an expire of 30mins.
    decodedData : {
        userId: "mongoose OBJECT",
        username: "string",
        password: "string",
        isAdmin: boolean
    }

### JOIN GAME JWT

    Created when a user creates a tournament and saved to the data base, is never refreshed. no expiry time.
    decodedData : {
        torunamentId: "mongoose OBJECT",
        password: "string",
    }

## Routes

### Login

    Endpoint name : User Login
    Request type: POST
    address: https://brawl-gg-backend.onrender.com/login
    Authorization header required: None required
    Sample JSON:
    {
    "email": "ben@email.com.au",
    "password": "Coderacademy1!",
    }

    -------------------------------------------------------------------------

    Endpoint name : User Check email for password to be reset
    Request type: POST
    address: https://brawl-gg-backend.onrender.com/login/password-reset
    Authorization header required: None required
    Sample JSON:
    {
    "email": "ben@email.com.au"
    }

    -------------------------------------------------------------------------

    Endpoint name : Check users recovery passcode
    Request type: POST
    address: https://brawl-gg-backend.onrender.com/login/check-passcode
    Authorization header required: None required
    Sample JSON:
    {
    "recoveryId": "Mongoose Object ID",
    "passcode": "123456",
    }

    -------------------------------------------------------------------------

    Endpoint name : Set new password for the user
    Request type: POST
    address: https://brawl-gg-backend.onrender.com/login/new-password
    Authorization header required: None required
    Sample JSON:
    {
    "email": "ben@email.com.au",
    "passcode": "123456",
    "newPassword": "A1Coder!"
    }

    -------------------------------------------------------------------------

### User

    Endpoint name : Get All Users
    Request Type: GET
    address: https://brawl-gg-backend.onrender.com/user/all
    Authorization required: Admin user JWT Authurization

    ------------------------------------------------------------------------

    Endpoint name : Get One User
    Request Type: GET
    address:
    https://brawl-gg-backend.onrender.com/user/:email
    Authorization header required: JWT Created by User


    -------------------------------------------------------------------------

    Endpoint name : Create User
    Request type: POST
    address: https://brawl-gg-backend.onrender.com/user
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
    address: https://brawl-gg-backend.onrender.com/user
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
    https://brawl-gg-backend.onrender.com/user
    Authorization required: JWT Created by User

### Tournaments

    Endpoint name : Get All Torunaments
    Request Type: GET
    address: https://brawl-gg-backend.onrender.com/tournament/all
    Authorization required: Admin user JWT Authurization

    ------------------------------------------------------------------------

    Endpoint name : Get All tournaments by one user
    Request Type: GET
    address:
    https://brawl-gg-backend.onrender.com/all/:id
    Authorization header required: JWT Created by User


    -------------------------------------------------------------------------

    Endpoint name : Get One tournament
    Request Type: GET
    address:
    https://brawl-gg-backend.onrender.com/tournament/:id
    Authorization header required: JWT Created by User


    -------------------------------------------------------------------------

    Endpoint name : Join a tournament
    Request type: GET
    address: https://brawl-gg-backend.onrender.com/tournament/join/:token
    Authorization header required: Password and tournament id verification JWT

    -------------------------------------------------------------------------

    Endpoint name : Create tournament
    Request type: POST
    address: https://brawl-gg-backend.onrender.com/tournament
    Authorization header required: Any JWT
    Sample JSON:
    {
    tournamentName: "String",
    author: "mongoose OBJECT",
    Game: "String",
    "gameType": "string",
    "Description": "string",
    "minimum players": int,
    "maximum players": int,
    "player stats": ["mongoose OBJECT", "mongoose OBJECT"],
    "password": "string,
    "joinLink": "string",
    "users": ["mongoose OBJECT", "mongoose OBJECT"],
    "chats": ["mongoose OBJECT"],
    }

    -------------------------------------------------------------------------

    Endpoint name : Update Tournamet
    Request type: PATCH
    address: https://brawl-gg-backend.onrender.com/tournament/:id
    Authorization required: JWT User that created tournament
    Sample JSON:
    {
    "tournamentName": "String",
    'author': "mongoose OBJECT",
    "game": "String",
    "gameType": "string",
    "description": "string",
    "minimum players": int,
    "maximum players": int,
    "player stats": ["mongoose OBJECT", "mongoose OBJECT"],
    "password": "string",
    "joinLink": "string",
    "users": ["mongoose OBJECT", "mongoose OBJECT"],
    "chats": ["mongoose OBJECT"]
    }

    Optional inputs = ["tournamentName", "author", "game", "gameType", "description", "min player", "max player", "player stats", "password", "users", "chats"]

    ----------------------------------------------------------------------

    Endpoint name : Delete Tournament
    Request type: Delete
    address: https://brawl-gg-backend.onrender.com/tournament/:id
    Authorization required: JWT User that created tournament

## Schemas

user {
username,
email,
password,
profile image,
tournaments,
isAdmin (An Admin can only be created by another admin)
}

userPasswordRecovery {
userEmail,
passcode,
createdAt,
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
Game,
gameType,
Description,
minimum players,
maximum players,
player stats[{}, {}],
password,
joinLink,
users[],
chats[],
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
- bcryptjs
