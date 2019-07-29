# Adapative Bitrate Streaming

## Setup 

### Apache Web Server

#### Linux 
install apache2

`apt-get install apache2`

start server

`sudo service start apache2`

test that the server is working properly by entering `localhost:80` in the browser and it should show the [apache default webpage](http://server.ispa.cnr.it/).

As **Dash.js** sends data to port `8333`, we can change the port by the following commands:

- change directory to apache2 configuration folder

`vim /etc/apache2/ports.conf`

- change `Listen 80` to `Listen 8333`
- restart the server 

`sudo service restart apache2`

- test that the server is working properly by entering `localhost:8333` in the browser and it should show the [apache default webpage](http://server.ispa.cnr.it/).

- test that the server is also working properly by entering `loccalhost:8333/myindex_[algo]` where `algo` can be `BB, BOLA, fastMPC, FESTIVE, FIXED, RB, RL, robustMPC`. 