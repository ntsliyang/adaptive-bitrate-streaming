# 论如何在windows下复现杨神的代码  

## Windows系统Apache下载和安装
>https://blog.csdn.net/weixin_43738701/article/details/86607148  
>https://blog.csdn.net/liyang4534/article/details/78036591  
首先确保安装了VC14,如果安装时出现报错433，可以在配置文件里把端口号改成442或444

## win10下chromedriver下载及安装--以及selenium的配置  
>https://blog.csdn.net/Booboochen/article/details/80531155  
把下载的压缩文件解压到C:\Program Files (x86)\Google\Chrome\Application（每一个都不要少），之后最好重启一下电脑，还不行的话，就把这个文件拷贝到本地的python路径下
如果selenium报错：  
```
pip install selenium
```
  
## 其他注意事项  
- 需要把apache24中httpd.conf配置文件中默认的主页改为我们的pensieve_master的路径，然后更改run_vedio.py中url改为:
```
url = 'http://localhost:8080/video_server/dash.js/samples/dash-if-reference-player/index.html'
```

## 如何开启我们吊炸天的model  
- 1.使用cmd打开apache服务器（进入bin目录下）
```
net start apache2.4
```
- 2.打开rl_server_no_training  
- 3.打开real_exp/run_video.py,即可自动弹出网页

### 最后补充一句：
### 太强了！！！
## 太强了！！！
# 太强了！！！
