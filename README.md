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

To run app in local machine in develoment mode follow below instructions.

1. Open terminal, go to folder where you want to copy repository and clone repository to your machine: `git clone https://github.com/mikkelismukkelis/helsinki_city_bike_app.git`

2. Install depencies, in terminal

   - First go to folder <em>..\helsinki_city_bike_app\backend</em> and install depencies for backend with command: `npm install`
   - Then go to folder <em>..\helsinki_city_bike_app\frontend</em> and install depencies for frontend with command:: `npm install`

3. Download
