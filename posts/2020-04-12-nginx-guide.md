---
title: 初识 nginx
date: 2020-04-12T10:38:34
tags:
  - nginx
---

## nginx 是什么

nginx 是一个 HTTP 及反向代理服务器，一个邮箱服务器，以及一个通用 TCP/UDP 代理服务器

## nginx 基础知识

nginx 启动后会存在一个主进程（master process）与多个工作进程（worker process）

- 主进程 解析配置文件，维护工作进程
- 工作进程 处理实际请求

nginx 使用基于事件的模型以及 OS 无关的机制在工作进程间高效分发请求。

工作进程的数量取决于配置文件，既可以固定数量，又可以依据可用 CPU 核心数自动调整。

可通过 `ps -ax | grep nginx` 获取所有运行中的 nginx 进程

nginx 及其模块的工作方式同样取决于配置文件。默认情况下，配置文件为 `nginx.conf`，位于 `/etc/nginx`、`/usr/local/etc/nginx` 或 `/usr/local/nginx/conf` 文件夹下

### 启动、停止与重载配置

安装完成后可通过直接执行 `nginx` 命令启动 nginx 服务器。可通过 

> nginx -s *signal*

控制已启动的 nginx 服务器。共计有：

- `nginx -s stop`
  快速停止 nginx 服务器

- `nginx -s quit`
  待工作进程处理完当前请求后停止服务器，若通过 `kill -s QUIT 1628`（`1628` 为主进程 ID），则效果与该命令一致

- `nginx -s reload`
  让 nginx 服务器重载配置。过程如下
  - 主进程验证新配置语法是否有效并尝试应用新配置
  - 验证通过，主进程使用新配置启动新工作进程并要求旧工作进程停止。旧工作进程首先停止接受新的连接请求，并待当前请求完成后停止
  - 验证不通过，则主进程回滚维持原配置运行

- `nginx -s reopen`
  重新打开日志文件

另见：[控制 nginx](http://nginx.org/en/docs/control.html)

### 配置文件结构

nginx 由模块组成，而模块受配置文件中的指令控制。指令分两种

- 简单指令（simple directive） => 名称 + 空格` ` + 参数 + 结束分号`;`
- 块指令（block directive） => 名称 + `{` + 其它命令（instructions） + `}`，若块指令的 `{}` 内包含其它指令（directive），则该块指令又被称为上下文（context），例如 [events](http://nginx.org/en/docs/ngx_core_module.html#events)、[http](http://nginx.org/en/docs/http/ngx_http_core_module.html#http)、[server](http://nginx.org/en/docs/http/ngx_http_core_module.html#server) 和 [location](http://nginx.org/en/docs/http/ngx_http_core_module.html#location)

若配置文件中的某个指令不属于任何上下文，则它属于 main 上下文（[main context](http://nginx.org/en/docs/ngx_core_module.html)）。[`events`](http://nginx.org/en/docs/ngx_core_module.html#events) 与 [`http`](http://nginx.org/en/docs/http/ngx_http_core_module.html#http) 指令位于 main 上下文，[`server`](http://nginx.org/en/docs/http/ngx_http_core_module.html#server) 位于 [`http`](http://nginx.org/en/docs/http/ngx_http_core_module.html#http) 上下文，[`location`](http://nginx.org/en/docs/http/ngx_http_core_module.html#location) 位于 [`server`](http://nginx.org/en/docs/http/ngx_http_core_module.html#server) 上下文

使用 `#` 对单行进行注释

### 提供静态内容

实现依据请求，从不同的本地文件夹：`/data/www`（一般用于放置 HTML 文件） 与 `data/images`（一般用于放置图片） 提供文件的功能，需要在配置文件的 http 块的 server 块内配置两个 location 块

默认的配置文件中已经包含了多个 `server` 块的例子，期中绝大部分已经注释，注释掉其它部分，开始一个新的 `server` 配置

```nginx
http {
    server {
    }
}
```

通常，配置文件中会包含多个 `server` 块，他们通过监听的 `port` 不同以及不同的 [server names](http://nginx.org/en/docs/beginners_guide.html) 区别。一旦 nginx 确定请求由某个 server 处理，它会将请求头部的 URI 与 `server` 块内 `location` 指令的参数比对。

将下面的 `location` 块添加到 `server`

```nginx
location / {
    root /data/www;
}
```

该 `location` 块设置了 `/` 前缀，该前缀会与请求的 URL 进行比较。对于匹配的请求，请求的 URL 会被添加到 `root` 指令标明的路径中，此处即添加到 `/data/www`，构成请求文件在本地系统中的路径。

如果有多个匹配的 `location` 块，nginx 会选择拥有最长匹配前缀的 `location`。上述的 `location` 块提供了最短的前缀，长度仅为一，因此只在其它 `location` 块都不匹配时，该块才会被使用。

接着，添加第二个 `location` 块

```nginx
location /images/ {
    root /data;
}
```

该块会匹配以 `/images/` 打头的请求，最终形成的路径为 `/data/images/`

`server` 块的最终配置如下

```nginx
server {
    location / {
        root /data/www;
    }

    location /images/ {
        root /data;
    }
}
```

目前的 server 已经是一个可工作的配置，其监听标准的 `80` 端口并可以在本地机器上通过 `http://localhost/` 访问。对于以 `/images/` 开头的 URI，该服务器会发送 `/data/images` 文件夹下的文件。如 `http://localhost/images/example.png` 的请求会使 nginx 发送 `/data/images/example.png` 文件作为响应。若该文件不存在，nginx 会返回 404 错误的响应。非 `/images/` 开头的请求会匹配到 `/data/www` 文件夹，例如 `http://localhost/some/example.html` 请求会响应 `/data/www/some/example.html` 文件

为应用新配置，若 nginx 未启动，则启动 nginx，若 nginx 已启动，则使用下面命令

```sh
nginx -s reload
```

> 若出现错误，可以在 `/usr/local/nginx/logs` 或 `/var/log/nginx` 文件夹的 `access.log` 和 `error.log` 文件中查看原因



## 参见

- [关于 nginx](http://nginx.org/en/)
- [初学者指南](http://nginx.org/en/docs/beginners_guide.html)