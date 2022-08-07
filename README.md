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

4. Start development mode: Go to <em>..\helsinki_city_bike_app\backend</em> folder in terminal and run command `npm run dev`

   - This starts both backend and frontend
   - Important: When starting first time, database creation and data import is done automatically (see below paragraph <em>Automatic data import</em>). This could take couple of minutes to complete. Please look at terminal, this kind of new rows stops appearing when import is fully done: <em> [nodemon] files triggering change check: db.sqlite</em>

5. Have fun :)

#### Automatic data import

Data of application is held in SQLite database.

DB file is located in root of backend: <em>...\backend\db.sqlite</em>. When app is started first time, server creates database automatically and creates tables.

After DB is created, then server checks import folder for csv files and imports data of those to database. When import of file is succesful, server moves csv file to <em>..\data_import\imported</em> -folder. So after everything goes well
