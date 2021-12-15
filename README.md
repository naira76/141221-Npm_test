To start the server do the following items
1. run ```npm install``` command on project folder path
2. setup the following ```.env``` variables of db configuration which is postgres db and port as well (optional)

``` DB_USER =
    DB_PASS =
    DB_NAME = 
    DB_HOST = 
    DB_PORT = 
    PORT = 3000
```

3. Run the ```db.sql``` script in db
4. Run the server application using ```pm2 start process.json``` command
5. To do unit test run the command ```npm test``` in project folder path
6. To test the api use the following curl
```
curl --location --request POST 'http://localhost:3000/bmi' \
--header 'Content-Type: application/json' \
--data-raw '[
    {
        "Gender": "Male",
        "HeightCm": 171,
        "WeightKg": 96
    }
]'
```
