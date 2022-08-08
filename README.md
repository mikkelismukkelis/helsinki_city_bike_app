# Helsinki City Bike App

## Description

This is pre-assignment project for Solita Dev Academy application.

Simple full stack web application to view and add data of Helsinki city bikes usage and stations. Full specification for project assignment can be found [HERE](https://github.com/solita/dev-academy-2022-fall-exercise).

## Technology used

Programming languages used:

- Typescript
- SQL
- HTML and CSS

Backend is mainly express framework app running on node.js runtime.

Frontend is react application with Material UI framework.

SQLite was selected as database mainly because portability. This way requirements for having installed any database engine on dev machine can be ruled out. Also .env is not needed at development phrase. From this approach it would be really easy to transform app to use any of mainstream relational databases (for example ms sql server) in production.

## Instructions

#### To run app in local machine in develoment mode follow below instructions.

1. Open terminal, go to folder where you want to copy repository and clone repository to your machine: `git clone https://github.com/mikkelismukkelis/helsinki_city_bike_app.git`

2. Install depencies, in terminal

   - First go to folder <em>..\helsinki_city_bike_app\backend</em> and install depencies for backend with command: `npm install`
   - Then go to folder <em>..\helsinki_city_bike_app\frontend</em> and install depencies for frontend with command:: `npm install`

3. Download below csv files and place those into <em>..\helsinki_city_bike_app\backend\src\data_import</em> -folder.

   - https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv
   - https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv
   - https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv

   - https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv

4. Start development mode: Go to <em>..\helsinki_city_bike_app\backend</em> -folder in terminal and run command `npm run dev`

   - This starts both backend and frontend in same terminal
   - Important: When starting first time, database creation and data import is done automatically (see below paragraph <em>Automatic data import</em>). This could take couple of minutes to complete. Please look at terminal, this kind of new rows stops appearing when import is fully done: <em> [nodemon] files triggering change check: db.sqlite</em>

5. Have fun :)

#### Separate processes for server and client

Server and client can of course be running on seperate terminals, this way you can for example restart either one without restarting both. For this open two terminals. With other go to backend folder and with other to frontend.

Run server in backend folder: `npm run server`

Run client in frontend folder: `npm start`

#### Automatic data import

Data of application is held in SQLite database.

DB file is located in root of backend: <em>...\backend\db.sqlite</em>. When app is started first time, server creates database automatically and creates tables.

After DB is created, then server checks <em>..\data_import</em> -folder for csv files and imports data of those to database. When import of file is succesful, server moves csv file to <em>..\data_import\imported</em> -folder. So after everything goes well <em>..\data_import</em> -folder does not contain any .csv files.

So next times when server is restarted, it just checks import folder for csv files (founds none, nothing to import) and uses old database file with old data.

#### Database recreation

If database is needed to recreate, then just delete file <em>...\backend\db.sqlite</em> and move csv files to <em>..\data_import</em> -folder and restart server

## TODOS

App fullfills most of requirements of assignment. Here are some of things that should be done to improve application.

- Real pagination: This app uses "fake" pagination. It just retrieves big junks of data and material UI table takes care of pagination. If done in good manner, pagination should be done in co-operation of UI and backend: part of data should be retrieved from database only when "next" is clicked or list is scrolled near to end or so.

- Feedback to user: Now some feedback to user is done just via alerts, these should be replaced with nicer components, for example some toasters or so.

- Add station coordinates: Couldn't find any subsriction free service for geocoding addresses. I think that this should be done in a way that user just types address and when submit is clicked, lat and long should be queried from geocode service in background and after retrieving those, data is written to database. (at the moment, some dummy values are hardcoded).

- Styling: someone with more visual eye (designer?) should take a look and tell how to style app.

- Language support: Now in data there was some data in three languages (Fin, Eng, Swe). This should be taken care somehow, is there language selection on UI or so...

- More statistics: We could use some reporting library or tool to show data in interesting formats. Maybe embed some powerbi reports or so.

- Data loaders when adding data to database

- ...
