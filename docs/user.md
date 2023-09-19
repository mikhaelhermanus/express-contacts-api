# User Api Spec

## Register User Api

Endpoint : POST /api/users
Request Body : 
```json
{
    "username" : "pzn",
    "password" : "rahasia",
    "name" : "Programer Zaman Now"
}
```

Response Body Success : 
```json
{
    "data":{
        "username" : "pzn",
        "name" : "Programmer Zaman Now"
    }
}
```

Response Body Error :
```json
{
    "errors" : "Username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body : 
```json
{
    "username" : "pzn",
    "password" : "rahasia",
}
```

Response Body success : 
```json
{
    "data" :{
        "token" :"unique-token"
    }
}
```

Response Body Error :
```json
{
    "errors" : "Username or password wrong"
}
```
## Update User API

Endpoint : PATCH /api/users/current

Headers :
- Authorization : token

Request Body :

```json
{
    "name" : "programmer Zaman Now lagi",// optional
    "password" : "new Password" // optional
     
}
```

Response Body Success :
```json
{
    "data" : {
        "username": "pzn",
        "name" : "Programmer Zaman Now Lagi"
    }
}
```

Response Body Error :
```json
{
   "errors": "Name length max 100"
}

```

## Get User API
Endpoint : GET /api/users/current
Headers :
- Authorization : token

Response Body Success:

```json
{
    "data" :{
        "username" : "pzn",
        "name" : "Programmer Zaman Now" 
    }
}
```

Response Body Error :
```
{
    "errors" : "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Response Body :

```json
{
    "data" : "Ok"
}
```

Response Body Error : 

```json
{
    "errors" : "Unauthorized"
}
```