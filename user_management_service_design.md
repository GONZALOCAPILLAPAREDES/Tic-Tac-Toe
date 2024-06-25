## Users feature at high level
My envisioning for this would be a oAuth2.0 token authentication, based on JWT (Json Web Token). So each user would need to authenticate `User` + `Password` to obtain a temporary JWT. This way, the would only need to provide the token once to the game and the game would be in charge of
validating the signature´s validity. The validation would be done in the API as a middleware, before accessing the DB. With this, two players can probably play simultaneously. 

## Changes on API
The main change would be to include a middleware in charge of retrieving the publick key that validates the JWT signature, based on the encryption algorythm that we choose. This middleware will work with each API action. Usually this public key is obtained directly from the Oauth server, which is more secure than keping it on DB
or memory. This produces a consultation to the Oauth JWKS for each API request. And other option would be to retrieve the public key once and keep it on DB or some sort of protected Vault. Depeding on the demand, one or the other could be better. 

## DB changes
We can keep track of the users tokens associated with the matchId, so we can register who played what. This would need another collection to keep this kind of documents. 
Another option would be to add two new attributes to our existing documents, in order to keep the tokens. 

Both of them could be easy to implement, but further design analysis should be done. 

## Architectural design changes

Adding an oAuth server container, maybe a Vault server. If we would like to scalade our game, with the containerized approach it is pretty straight foward. 
