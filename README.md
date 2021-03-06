### Webobservatory

#### Summary
[Screencast Webobservatory (full video ~ 8 min 30 sec)](https://youtu.be/2s6tHyAz6p0)


[Screencast Webobservatory (part two 'editing' ~ 5 min)](https://youtu.be/2s6tHyAz6p0?t=3m31s)


##### What is Webobservatory?
It's a personal website where you can upload your images of the night sky, in the three galleries. You can also add all the info about your observatory (or other equipment used) in the about page, and blog about your experiences in the blog. You also have a weather page, where you can add your location to Clear Outside and YR, for live weather updates. Besides this you can edit all the content "in place". No need for a edit interface, or to edit content in the database. The edit options are ~~pretty basic~~ evolving, but you can customize the site name, the header an tagline, toggle pages on and off, and add your own pictures for the page descriptions on the homepage. You can add, delete or edit About, Weather and Blog articles, with the option to add paragraphs, images to paragraphs, position the images left or right or toggle images on and off if you are not sure if you want to keep them. The DSO, Planetary and Special galleries work in a similar way. You can upload the full image or upload a preview. You can at any point update the preview, the full size image or both. You can also add a summary of the image, and add multiple paragraphs in the "read on" section. Webobservatory also supports authentication to the back end using sha256 tokens, and AES-256 encryption.

##### What is it not?
This is not a matured app used by a multitude of users over a longer time period. This means that all the kinks are not ironed out, and all the features one might want is not implemented yet. When writing text in the app, all html is sanitized, ~~so you can not add hyperlinks "pre" tags, or any other html syntax. I Will hopefully implement the choice to add pre formatted data, hyperlinks and more, but I'm not sure when.~~ The authentication to the back end with handshake and AES encryption is implemented by me using the node-forge library. https://www.npmjs.com/package/node-forge It should not be trivial to hack, but if you feel the security aspect is very important, you should set up express to use ssl "https".


#### Attributions
* This project have gotten a lot off help by going trough tutorials on Scotch.io. Especially [Setting Up a MEAN Stack Single Page Application](https://scotch.io/tutorials/setting-up-a-mean-stack-single-page-application), and [Build a RESTful API using Node and Express4](https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4)
* The beautiful layout is a customized version of [HTML5 UP's](https://html5up.net/) [Solid State](https://html5up.net/solid-state).


#### Install Webobservatory
* The install script is made for Ubuntu 16.04 and newer, for Ubuntu < 16.04 change the mongodb repo acording to [Install MongoDB Community Edition](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition) i.e change xenial, trusty, precise.
* For Ubuntu < 15.04 "Upstart" is not supported and the mongodb.service and webobservatory.service will not work. Init scripts have been made to enable mongodb and webobservatory to run on start.
* It should be possible to run Webobservatory on all systems that support MongoDB and NodeJS. Have a look in the /install.sh script and make necessary changes.
```
mkdir ~/Projects
cd ~/Projects
git clone https://github.com/magnue/webobservatory.git
cd webobservatory

# Do NOT use 'sudo ./install.sh' You will be prompted for password when it's needed
./install.sh

# For Ubuntu < 15.04 run the install inits script.
sudo ./install-inits.sh
```


#### Update
```
cd ~/Projects/webobservatory/
git pull; sudo su -s /bin/bash -c "/usr/bin/forever restartall" www-data
```


#### Start and enable (start on boot) services, Ubuntu 15.04 and up
```
sudo systemctl start mongodb
sudo systemctl enable mongodb

sudo systemctl start webobservatory
sudo systemctl enable webobservatory
```


#### Start and enable (start on boot) services, Ubuntu Older than 15.04
```
sudo service mongodb start
sudo update-rc.d mongodb defaults

sudo service webobservatory start
sudo update-rc.d webobservatory defaults
```



#### Sart mongodb and webobservatory manually
```
sudo su -s /bin/bash -c "/usr/bin/mongod --quiet --config /etc/mongod.conf &" mongodb
sudo su -s /bin/bash -c "NODE_ENV=production /usr/bin/forever -c /usr/bin/node /srv/webobservatory/server.js &" www-data
```


#### Get info about the forever process (logfile location, uptime, etc)
```
sudo su -s /bin/bash -c "/usr/bin/forever list" www-data
```


#### Dump, Restore (optional), and get database ready for first run (mandatory)
```
mongodump --gzip --archive="webobservatory.archive.gz" --db=test
mongorestore --gzip --archive="webobservatory.archive.gz" --db=test

// On first start, you must import the defalut DB. Do this after starting mongodb
mongorestore --gzip --archive="default_db.archive.gz" --db=test
```

#### Default user
There is a default user set up for convenience.
This user is active and admin.
```
user@webobservatory.test
passwd Web123
```

#### Approve new users (editors and admins)
When mongodb is started type 'mongo' in the terminal, you then get the mongodb console
```
use test
db.logins.update({login_user_email : "user@domain.com"}, { $set : {login_user_approved : true}}, true, true);

// Optionally set user as administrator
db.logins.update({login_user_email : "user@domain.com"}, { $set : {login_user_is_admin : true}}, true, true);
```


#### Delete users
You should probably do this to the default user, after creating a new administrator (just to be sure)
```
use test
db.logins.remove({login_user_email : "user@domain.com"});

// For the default user
db.logins.remove({login_user_email : "user@webobservatory.test});
```
One more reason not to use the default user is that "author" is saved to the db when creating and editing atricles, and gallery entries.
If you use the default user, all articles will display Created by: user, Last edited by: user, aso.


#### Add Google Analytics (this is strictly optional).
Rename public/js/analytics.default, and add your tracking id.
```
cd ~/Projects/webobservatory/public/js/
cp analytics.default analytics.js
vi analytics.js
```


#### Edit with rich content.
As of now some of the basic ritch html content is availible.
Simply att the TagCode markup when editing.
As Html is still sabnitized the pre tag does not allways work as expected.
When editing add the `[tc:pre][/tc:pre]` tags first, and paste content in the middle.
```
[tc:bold]Bold[/tc:bold]
[tc:italic]Italic[/tc:italic]
[tc:del]Striketrough[/tc:del]
[tc:u]Underlined[/tc:u]
[tc:sup]Super text[/tc:sup]
[tc:sub]Sub text[/tc:sub]
[tc:code]00011110011[/tc:code]
[tc:pre]foreach (var e in items) { e.iterations++ };[/tc:pre]
[tc:highlight]Highlighted[/tc:highlight]
[tc:hyperlink ref="https://github.com/magnue/webobservatory"][tc:span]This repository[/tc:span][/tc:hyperlink]
[tc:youtube youid="2s6tHyAz6p0"][/tc:youtube]
```

