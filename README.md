### Webobservatory

#### Summary
[Screencast Webobservatory](https://youtu.be/2s6tHyAz6p0)

<br>
##### What is Webobservatory?
It's a website where you can upload your images of the night sky, in the three galleries. You can also add all the info about your observatory (or other equipment used) in the about page, and blog about your experiences in the blog. You also have a weather page, where you can add your location to Clear Outside and YR, for live weather updates. Besides this you can edit all the content "in place". No need for a edit interface, or to edit content in the database. The edit options are pretty basic, but you can customize the site name, the header an tagline, toggle pages on and off, and add your own pictures for the page descriptions on the homepage. You can add, delete or edit About, Weather and Blog articles, with the option to add paragraphs, images to paragraphs, and position the images left or right, or toggle images on and off if you are not sure if you want to keep them. The DSO, Planetary and Special galleries work in a similar way. You can upload the full image or upload a preview. You can at any point update the preview, the full size image or both. You can also add a summary of the image, and add multiple paragraphs in the "read on" section. Webobservatory also supports authentication to the back end using sha256 tokens, and AES-256 encryption.

##### What is it not?
What is it not? This in not a matured app used by a multitude of users over a longer time period. This means that all the kinks are not ironed out, and all the features one might want is not implemented yet. When writing text in the app, all html is sanitized, so you can not add hyperlinks "pre" tags, or any other html syntax. I Will hopefully implement the choice to add pre formatted data, hyperlinks and more, but I'm not sure when. The authentication to the back end with handshake and AES encryption is implemented by me using the node-forge library. https://www.npmjs.com/package/node-forge It should not be trivial to hack, but if you feel the security aspect is very important, you should set up express to use ssl "https".

<br>
#### Attributions
* This project have gotten a lot off help by going trough tutorials on Scotch.io. Especially [Setting Up a MEAN Stack Single Page Application](https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application), and [Build a RESTful API using Node and Express4](https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4)
* The beautiful layout is a customized version of [HTML5 UP's](https://html5up.net/) [Solid State](https://html5up.net/solid-state).

<br>
#### Install Webobservatory
* The install script is made for Ubuntu 16.04 and newer, for Ubuntu < 16.04 change the mongodb repo acording to [Install MongoDB Community Edition](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition) i.e change xenial, trusty, precise.
* For Ubuntu < 15.04 "Upstart" is not supported and the mongodb.service and webobservatory.service will not work. Init scripts should be made to enable mongo and webobservatory to run on start.
* It should pe possible to run Webobservatory on all systems that support MongoDB and NodeJS. Have a look in the /install.sh script and make necessary changes.
```
mkdir ~/Projects
cd ~/Projects
git clone https://github.com/magnue/webobservatory.git
cd webobservatory

# Do NOT use 'sudo ./install' You will be prompted for password when it's needed
./install
```

<br>
#### Update
```
cd ~/Projects/webobservatory/
git pull; sudo su -s /bin/bash -c "/usr/bin/forever restartall" www-data
```

<br>
#### Start and enable (start on boot) services
```
sudo systemctl start mongodb
sudo systemctl enable mongodb

sudo systemctl start webobservatory
sudo systemctl enable webobservatory
```

<br>
#### Sart mongodb and webobservatory manually
```
sudo su -s /bin/bash -c "/usr/bin/mongod --quiet --config /etc/mongod.conf &" mongodb
sudo su -s /bin/bash -c "NODE_ENV=production /usr/bin/forever -c /usr/bin/node /srv/webobservatory/server.js &" www-data
```

<br>
#### Get info about the forever process (logfile loc, uptime, etc)
```
sudo su -s /bin/bash -c "/usr/bin/forever list" www-data
```

<br>
#### Dump and Restore database
```
mongodump --gzip --archive="webobservatory.archive.gz" --db=test
mongorestore --gzip --archive="webobservatory.archive.gz" --db=test

// On first start, you must import the defalut DB. Do this after starting mongodb
mongorestore --gzip --archive="default_db.archive.gz" --db=test
```

<br>
#### Approve new users (editors and admins)
When mongodb is started type 'mongo' in the terminal, you then get the mongodb console
```
use test
db.logins.update({login_user_email : "user@domain.com"}, { $set : {login_user_approved : true}}, true, true);

// Optionally set user as administrator
db.logins.update({login_user_email : "user@domain.com"}, { $set : {login_user_is_admin : true}}, true, true);
```

<br>
#### Delete users
You shoul probably do this to the default user, after creating a new administrator (just to be sure)
```
use test
db.logins.remove({login_user_email : "user@domain.com"});

// For the default user
db.logins.remove({login_user_email : "user@webobservatory.test});
```
One more reason not to use the default user is that "author" is saved to the db when creating and editing atricles, and gallery entries.
If you use the default user, all articles will display Created by: user, Last edited by: use, aso, when the frontend for authors is implemented.
