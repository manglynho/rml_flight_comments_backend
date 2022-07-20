# Flight App Documentation

### 1. This project cointains two separate apps for frontend and backend:

[Backend on GitHub] https://github.com/manglynho/rml_flight_comments_backend

[Frontend on GitHub] https://github.com/manglynho/rml_flight_comments_frontend

-In both cases after cloning from github or unzipping run:
>npm install
-Start each project with command:
>npm start

Backend already contains a frontend build and it's ready for separated work. 

### 1.1 Folder and files Structure
The folder structure is function related. For that reason, folders and files are organized according their function (controller, models, request, test ...)
For a larger system it's recommendable using a feature aproach (i.e: comments, flights, users ... )

### 2. Database
The project uses mongoDB. I already setup two databases for production and test on cloud DB. 
Im sharing the **.env** with connection data (not via Github), but you can use your own setup. 
If you use your own db setup, remember that users and flights must be harcoded into production DB at first.

### 3. Requests and Postman Collection
In folder (./requests/ ) there is a Postman Collection to test api endpoints.
Also I wrote requests files that can be used to test the api. 
You can run those using VsCode or copy the info to Postman.

### 4. Tests
Test suite for Comments are stored in the tests folder and contain jest tests and data for main requirements and validation.

Trigger tests with command:
>npm run test

Frontend has a test suite implemented with Cypress that you can start with the command: 
>npm run cypress:open

### 5. Also there is a CD/CI based setup on Heroku Cloud Platform. 
So any changes commited to the backend repo will be deployed automaticaly on the heroku app created.

[Flight Comments App on Heroku]
