# Dev tinder APIs

<!-- auth router -->
- POST /signup
- POST /login
- POST /logout

<!-- Profile router -->
- GET  /profile/view
- PATCH /profile/edit
- PATCH /profile/password

<!-- Connection Router -->
- POST /request/send/:status/:userId
- POST /request/review/:status/:requestedId

<!-- User router -->
- GET /user/request/recieved
- GET /user/connections
- GET /user/feed



status -- ignore, intereseted, accepted, rejected.