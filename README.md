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
    http://brawls.io/user/:email
    Authorization header required: JWT Created by User
    

    -------------------------------------------------------------------------

    Endpoint name : Create User
    Request type: POST
    address: https://brawls.io/user/
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

### Tournaments

    Endpoint name : Get All Torunaments
    Request Type: GET
    address: http://brawls.io/tournament/all
    Authorization required: Admin user JWT Authurization

    ------------------------------------------------------------------------

    Endpoint name : Get All tournaments by one user
    Request Type: GET
    address: 
    http://brawls.io/tournament/all/:id
    Authorization header required: JWT Created by User
    

    -------------------------------------------------------------------------
    
    Endpoint name : Get One tournament
    Request Type: GET
    address: 
    http://brawls.io/tournament/:id
    Authorization header required: JWT Created by User
    

    -------------------------------------------------------------------------

    Endpoint name : Create tournament
    Request type: POST
    address: https://brawls.io/tournament/
    Authorization header required: Any JWT
    Sample JSON:
    {
    tournamentName: "String",
    author: "mongo Object",
    Game: "String",
    "gameType": "string",
    "Description": "string",
    "minimum players": int,
    "maximum players": int,
    "player stats": {},
    password: "string,
    "users": [],
    "chats": "mongo Object"
    }

    -------------------------------------------------------------------------

    
    Endpoint name : Update Tournamet
    Request type: PATCH
    address: http://brawls.io/tournament/:id
    Authorization required: JWT User that created tournament
    Sample JSON:
    {
    "tournamentName": "String",
    'author': "mongo Object",
    "game": "String",
    "gameType": "string",
    "description": "string",
    "minimum players": int,
    "maximum players": int,
    "player stats": {},
    "password": "string,
    "users": [],
    "chats": "mongo Object"
    }

    Optional inputs = ["tournamentName", "author", "game", "gameType", "description", "min player", "max player", "player stats", "password", "users", "chats"]

    ----------------------------------------------------------------------

    Endpoint name : Delete Tournament
    Request type: Delete
    address: http://brawls.io/tournament/:id
    Authorization required: JWT User that created tournament

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
    Game,
    gameType,
    Description,
    minimum players,
    maximum players,
    player stats,
    password,
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