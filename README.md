# brawl-gg-backend

## Routes

## Schemas

user {
    username,
    email,
    password,
    profile image
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