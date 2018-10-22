# seh-database

To provide continual improvement activities, carrying out 4M and having data associated with it is vital. One of the 4M, Material is quite crucial in this process, being that the product has different specification which requires different material.

By default, a database does exist but its queries are limited and becomes a pain when needed to download as CSV & manipulate from Excel. When there is an update,  the cycle repeats again.

I came up with a web server to tackle the following issues:
• Separate database as internal control for my department analysis & prevent interfering with legacy database
• Fetch the data from the legacy database on daily basis
• Misinformation filling in the legacy database can be rectified
• Add material management which the legacy database is lacking

The stack I chose for my project are NodeJS, Express and Mongoose which is popular nowadays from MEAN, MERN or MEVN stack, except the front-end framework which I instead opt for jQuery AJAX for single page application (SPA).

The reason I chose Express is because it's most popular use for web application framework with NodeJS. I use NodeJS is because Node.js runs single-threaded, non-blocking, asynchronously programming, which is very memory efficient (W3schools). This makes it easier to develop without concerning which thread to work on and that most of my datas are just "API" calls with few datas that need to actually perform the entire CRUD operations, being majority of it as Update operations. In addition, it can be develop as a real-time communication data with socket for IOT use case, since Industry 4.0 is the talk nowadays. Non-SQL like MongoDB is used with mongoose being the ORM for it as the data is not really related to other process area.

■ How it works■ 
• Inform IT department to generate a CSV file with certain data needed for the area I'm in charge from the legacy database
• Inform IT department to make a scheduler to update that CSV file daily at a certain time
• My database will then use a cron module to pipe the data from CSV file into MongoDB through mongoose module that acts like an ORM
• Update operation can then be done on own database if misinformation is presented
• Allow operators to add in material information so that products processed under it can be linked with it (feature that is not available to the legacy database system, except tracking by hardcopy)
• Using MongoDB Compass GUI to build the necessary filter query by monthly basis and certain material specification
• Using MongoDB Compass GUI to build an aggregation pipeline to compute each product reject category percentage and total reject percentage by monthly basis and group by material specification

★Current status★ The first phase was a success and the next phase is to develop query filter with interactive dynamic chart for the front-end user.

Note: Due to data confidentially, any data related has been removed from the source code
