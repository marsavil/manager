# manager
Back end to handle users, referrals and sales

The referral enters personal data when hitting a landing page link given by an affiliate user and this data is stored in the DB.
Later the Admin or the managers get in touch with the referral and, after the sale is done, the referral is stored as an affiliate user.

To run this back end a .env file is needed and it may include the following entries

DB_USER=  "your postgres user name"

DB_PASSWORD=  "your postgres password"

DB_HOST=localhost:5432 "(or the one configured in your postgres software"

DB_NAME=  "the name you'd like to give to your DB"

EMAIL= "an email you create for this project"

EMAIL_PSSWRD=  "applications password generated in the email account"  

PASSWORD=  "the password chosen for the admin user that wil be stored in the DB the first time the server is run"

JWT_KEY=  "a secret word to create json web tokens"

SERVER=http://localhost:3001/

CLIENT_HOST=http://localhost:3000/

ROUNDS= "the salt to be used to hash the password. if specified as a number then a salt will be generated with the specified number of rounds and used
