# Tic-Tac-Toe by `GONZALO CAPILLA PAREDES`
## Deployment
As everything is containerized and condensed into a `docker-compose.yml`. 
### Requirements
- To have a functioning version of `Docker`

### Steps
The steps to deploy would be the following:
  1. Have `sudo` permissions over the directory were you want to launch the game 

  2. Download the code from the repo from branch `main`:

  ```
   git clone https://github.com/GONZALOCAPILLAPAREDES/Tic-Tac-Toe.git
  ```
  3. Create images and start container. As the are no previous images from none of the containers it would be enough with:
  
  ```
    docker-compose up
  ```

  4. Then in the running logs shown after the `docker-compose up` or by doing `docker logs react-app1`, we need to look for the following:
<img width="302" alt="image" src="https://github.com/GONZALOCAPILLAPAREDES/Tic-Tac-Toe/assets/36472409/2484f7e4-f698-4e66-8bc1-d4f95af8c1de">

  5. Copy the Network address: `http://192.168.48.3:8083/`, open a web browser and paste it:

<img width="631" alt="image" src="https://github.com/GONZALOCAPILLAPAREDES/Tic-Tac-Toe/assets/36472409/13a5987f-5670-4579-80a3-c3b261487149">



## Components
### WEB-SERVICE
This what we commonly know as Back-end. It is basically a Python Flask application that serve three different routes and keep this information in a MongoDB instance. The different routes are:

#### 1. `POST /move`
   body: 

  ```
{
   "matchId": <The match's ID>,
   "playerId": "X" | "O", # The acting player.
    "square": { # The target square to mark.
            "x": <x>,
            "y": <y>
     }
}
  ```

- **Success Status Code**: 200

#### 2. `GET /status?matchId=<matchId>`

- **Query parameters**: matchId
- **Success Status Code**: 200

#### 3. `POST /create`

- **Success Status Code**: 200
- **Success Json Response**:
```
{
   "matchId": <The new match's ID>
}
``` 

### MONGO-DB

In order to implement the DB based persistence, it has been decided to use `MongoDB`, as we won´t need JOIN SQL operations and performance seems to be better for our case as it scales easily and operations are perfom quicker. This information is taken from:

https://www.integrate.io/blog/mongodb-vs-mysql/
https://intellipaat.com/blog/mongodb-vs-sql/#:~:text=In%20comparison%20to%20the%20SQL,of%20data%2C%20however%20MongoDB%20does.

Also, using a different mongo document for each `matchId`, seems to be a clear way of managing matches. The aspect of one of this documents is:

```
{ 
"_id" : "qdNwV6HAFxCyga7p5q5iiJSoHcOvzwKi", 
"board" : [ [ -1, -1, -1 ], [ -1, -1, -1 ], [ -1, -1, -1 ] ], 
"turn" : "X", 
"current_result" : { 
  "status" : "on-going", 
  "winner" : "" 
  } 
}

```
- `_id`: is the string to identify each document and match, when retrieved we call it `matchId`
- `board`: the representation of the tictactoe board following the coordinates mentioned in the technical assesment. 
- `turn`: which user turn is
- `current_result`: JSON to show the overall state of the game, if is still in play and in case is finished, who won.
- `status`: value can be `finished` or `on-going`
- `winner`: player `X` or `O` or `""` if no one won. 

#### Checking information
If we wanted to check and see all the documents generated into the `matches` collection, we would only need to (after the first match at least):

  1. `$ mongo`
  2.  `use tictactoe`
  3.  `db.matches.find()` will show all the entries for the `matches` collection. 

### REACT-APP
A pretty simple front-end for the TicTacToe Game. It is designed to forbid actions against the game rules and following SOLID principles. Every match is kept on the DB. 

As a future improvement, some refactorization for the `Game` component is necessary. 


