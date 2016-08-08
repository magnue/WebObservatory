#!/bin/bash
# Install MongoDB
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org

sudo cp mongodb.service /etc/systemd/system/mongodb.service
sudo chown root:root /etc/systemd/system/mongodb.service
sudo chmod 644 /etc/systemd/system/mongodb.service

sudo cp webobservatory.service /etc/systemd/system/webobservatory.service
sudo chown root:root /etc/systemd/system/webobservatory.service
sudo chmod 644 /etc/systemd/system/webobservatory.service

systemctl daemon-reload

# Install nodejs and dependencies
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get update
sudo apt-get install nodejs
sudo npm install -g bower
sudo npm install -g forever
sudo npm install -g requirejs
npm install merge
npm install node-forge
npm install almond
npm install compression
npm install
bower install

# Hackish fix. node-forge require almondy in node_modules/node-forge/node_modules/almondy
mkdir node_modules/node-forge/node_modules
cp -r node_modules/almond/ ./node_modules/node-forge/node_modules/

# Copy create and the forge.min.js to ./public/js/
r.js -o node_modules/node-forge/minify.js
cp node_modules/node-forge/js/forge.min.js ./public/js/

# Create directories
mkdir tmp
mkdir public/images/article-about
mkdir public/images/article-about/small
mkdir public/images/article-weather
mkdir public/images/article-weather/small
mkdir public/images/article-blog
mkdir public/images/article-blog/small
mkdir public/images/gallery-dso
mkdir public/images/gallery-dso/small
mkdir public/images/gallery-planetary
mkdir public/images/gallery-planetary/small
mkdir public/images/gallery-special
mkdir public/images/gallery-special/small
mkdir public/images/user-images
mkdir public/images/user-images/small

# Set user $USER and group www-data
sudo chown -R $USER:www-data tmp
find . -type d -exec sudo chown $USER:www-data public/images/ {} \;
sudo chown -R $USER:www-data ~/.npm

# Set permissions
sudo chmod -R 774 tmp
find . -type d -exec sudo chmod 774 public/images/ {} \;
sudo chmod -R 774 ~/.npm

# Create /srv/webobservatory symlink
sudo mkdir /srv
if [ ! -d "/srv/webobservatory" ]; then
    sudo rm /srv/webobservatory
fi
sudo ln -s $(pwd) /srv/webobservatory

# Create /var/www if not exist
if [ ! -d "/var/www" ]; then
    sudo mkdir /var/www
    sudo mkdir /var/www/.forever
    sudo chown -R $USER:www-data /var/www
    sudo chmod -R 775 /var/www
fi

# Copy app/routes/routes_contact.default to untracked routes_contact.js
cp app/routes/routes_contact.default app/routes/routes_contact.js

# Enable MongoDB
echo ""
echo "To enable MongoDB on boot, run the enable command"
echo "sudo systemctl enable mongodb"
echo ""
# Start MongoDB
echo "To start MongoDB run"
echo "sudo systemctl start mongodb"
echo ""
# import defaut_db
echo "FIRST RUN 'IMPORTANT'"
echo "import the default_db, mongodb must be started"
echo "mongorestore --gzip --archive=default_db.archive.gz --db=test"
echo ""
# Enable Webobservatory as service
echo "To enable Webobservatory on boot run the enable command"
echo "sudo systemctl enable webobservatory"
echo ""
# Start Webobservatory as service
echo "To start Webobservatory run"
echo "sudo systemctl start webobservatory"
echo ""
# List forever process
echo "To list forever process running as service"
echo "sudo su -s /bin/bash -c \"/usr/bin/forever list\" www-data"
echo ""
