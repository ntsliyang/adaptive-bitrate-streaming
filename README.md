# Quality-aware Media Streaming Optimization (based on [Pensieve](https://github.com/hongzimao/pensieve))

## Table of Contents
- [Quality-aware Media Streaming Optimization (based on Pensieve)](#quality-aware-media-streaming-optimization-based-on-pensieve)
	- [Table of Contents](#table-of-contents)
	- [Objectives](#objectives)
	- [Setup](#setup)
	- [Apache Server](#apache-server)
		- [Linux](#linux)
		- [Windows](#windows)
		- [Mac](#mac)

## Objectives 
-  Recreate the [real-world experiments](https://github.com/hongzimao/pensieve#real-world-experiments) 
-  Customize the adaptation algorithms for different needs (smooth, balanced, high-quality)
-  Optimize the current ABR algorithm (based on RL) so that it could be applied in live streaming environment (desired ABR algorithm could enable the video to have smooth playback while retaining a much smaller buffer level than playback environment)
- Gather a much larger dataset

## Setup

## Apache Server

### Linux
install apache2


start server

```
sudo service start apache2
```

test that the server is working properly by entering `localhost:80` in the browser and it should show the [apache default webpage](http://server.ispa.cnr.it/).

As **Dash.js** sends data to port `8333`, we can change the port by the following commands:

- change directory to apache2 configuration folder

```
vim /etc/apache2/ports.conf
```

- change `Listen 80` to `Listen 8333`
- restart the server 

```
sudo service restart apache2
```

- test that the server is working properly by entering `localhost:8333` in the browser and it should show the [apache default webpage](http://server.ispa.cnr.it/).

- test that the server is also working properly by entering `loccalhost:8333/myindex_[algo]` where `algo` can be `BB, BOLA, fastMPC, FESTIVE, FIXED, RB, RL, robustMPC`. 


### Windows

### Mac