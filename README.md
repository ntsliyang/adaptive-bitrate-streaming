# Quality-aware Media Streaming Optimization (based on [Pensieve](https://github.com/hongzimao/pensieve))

## Table of Contents
- [Quality-aware Media Streaming Optimization (based on Pensieve)](#quality-aware-media-streaming-optimization-based-on-pensieve)
	- [Table of Contents](#table-of-contents)
	- [Objectives](#objectives)
	- [Setup](#setup)
	- [Apache Server](#apache-server)
		- [Linux](#linux)
			- [Installation & Basic Setup](#installation--basic-setup)
			- [Change Port Number](#change-port-number)
		- [Windows](#windows)
			- [Installation & Basic Setup](#installation--basic-setup-1)
		- [Mac](#mac)
			- [Installation & Basic Setup](#installation--basic-setup-2)
			- [Change Port Number](#change-port-number-1)
	- [Chromedriver & Selenium](#chromedriver--selenium)
		- [Linux](#linux-1)
		- [Windows](#windows-1)
		- [Mac](#mac-1)
	- [Real-world experiments](#real-world-experiments)
	- [Addition of 9-level quality video](#addition-of-9-level-quality-video)
	- [Changes compared to original pensieve](#changes-compared-to-original-pensieve)
	- [Dependency](#dependency)
- [Reference](#reference)

## Objectives 
-  Recreate the [real-world experiments](https://github.com/hongzimao/pensieve#real-world-experiments) 
-  Customize the adaptation algorithms for different needs (smooth, balanced, high-quality)
-  Optimize the current ABR algorithm (based on RL) so that it could be applied in live streaming environment (desired ABR algorithm could enable the video to have smooth playback while retaining a much smaller buffer level than playback environment)
- Gather a much larger dataset

## Setup

## Apache Server

### Linux

#### Installation & Basic Setup
- update package local index
```
sudo apt update
```
- install apache2 
```
sudo apt install apache2
```
- start server
```
sudo service start apache2
```
- test that the server is working properly by entering `localhost:80` in the browser and it should show the [apache default webpage](http://server.ispa.cnr.it/).

#### Change Port Number
- use [vim](https://www.vim.org/) to open `ports.conf`
```
vim /etc/apache2/ports.conf
```
- Change `Listen 80` to `Listen [port number]`
- restart the server
```
sudo service restart apache2
```
- test that the server is working properly by entering `localhost:[port number]` in the browser and it should show the [apache default webpage](http://server.ispa.cnr.it/).


### Windows

#### Installation & Basic Setup
- download [Apache Lounge](http://www.apachelounge.com/download/)
- download [Apache Haus](https://www.apachehaus.com/cgi-bin/download.plx) and unzip the file under specific disk location

### Mac

#### Installation & Basic Setup
- stop running (older) Apache server and remove it
```
sudo apachectl stop
sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist
```
- install [httpd](https://httpd.apache.org/) via [Homebrew](https://brew.sh/) 
```
brew install httpd
```
- start server 
```
sudo brew services start httpd
```
- test that the server is working properly by entering `localhost:8080` in the browser and it should show the [apache default webpage](http://server.ispa.cnr.it/).

#### Change Port Number
- use [vim](https://www.vim.org/) to open `httpd.conf`
```
vim /etc/apache2/httpd.conf
```
- change `Listen 8080` to `Listen [port number]`
- test that the server is working properly by entering `localhost:[port number]` in the browser and it should show the [apache default webpage](http://server.ispa.cnr.it/).

## Chromedriver & Selenium

- **make sure that Google Chrome is already installed before doing installation and setup in the following.**

### Linux 
- As provided in [`setup.py`](https://github.com/hongzimao/pensieve/blob/master/setup.py#L14), 

### Windows 
- check Google Chrome [version](chrome://version)
- download corresponding [chromedriver](http://chromedriver.storage.googleapis.com/index.html) and put it under `abr_browser_dir/` 

### Mac

## Real-world experiments 
- set up the [server](#apache-server) 
- run the server according to specific algorithm under `rl_server/`
- launch reference client by `localhost:[port number]/dash.js/samples/dash-if-reference-player/index.html`

## Addition of 9-level quality video

## Changes compared to original pensieve
- As pensieve is originally written in [Python 2.7](https://www.python.org/download/releases/2.7.2/), the changes are mainly migrations to [Python 3.7](https://www.python.org/downloads/release/python-373/).  
  - add parantheses around `print` statements
  - all the write and read files commands are changed from `wb` (or `rb`) to `w` (or `r`)
  - all the `send_data` need to be encoded as `send_data.encode()`.
- Under `rl_server/`, programs used to build backend file for transfer of state information include
  - `dash_server_original.py`
  - `mpc_server.py`
  - `robust_mpc_server.py`
  - `rl_server_no_training.py`
  - `simple_server.py`
change the first two lines of `import` statements from 
```[python]
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
```
to 
```[python]
from http.server import BaseHTTPRequestHandler, HTTPServer
import socketserver
```


## Dependency
- Python 3.7
- Tensorflow 1.9

# Reference 
- pensieve (https://github.com/hongzimao/pensieve/)
- Ubuntu Apache Setup (https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-18-04-quickstart)
- Mac Apache Setup (https://tecadmin.net/install-apache-macos-homebrew/)
- Windows Apache Setup
  - Installation & Setup of VC14 and Apache Lounge (https://blog.csdn.net/liyang4534/article/details/78036591)
  - Installation & Setup of Apache Haus (https://blog.csdn.net/weixin_43738701/article/details/86607148)
- Installation & Setup of Chomedriver and Selenium on Windows (https://blog.csdn.net/Booboochen/article/details/80531155)