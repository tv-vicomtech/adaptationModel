# adaptationModel

A methodology to generate adaptation models for multi-device media services

## Deployment

It is an application developed in Angular. 

Install nodejs v>6.9.x and npm v>3.x.x

```bash
sudo apt-get install nodejs
sudo apt-get install npm
```
It also uses a python script to calculate the needed combinatoria.
Install python and other dependencies:

```bash
sudo apt-get install python2.7
sudo apt-get install python-pip
sudo pip install flask
sudo pip install flask-cors
```

Download source:

```bash
git clone https://github.com/tv-vicomtech/adaptationModel.git
```
Install dependecies:

```bash
cd adaptationModel/config-app
sudo npm install
```
Initialize server:

```bash
sudo npm start
```

Start combinatoria:

```bash
sudo python combinatorial.py
```

##Frontend

Once everything is initialized the application will be available at http://ip:4200
