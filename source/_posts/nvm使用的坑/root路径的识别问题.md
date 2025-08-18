---
title: root路径的识别问题
date: 2025-04-12
tags: ['nvm', '坑']
author: QuHou
excerpt: 使用nvm root path重新设置根路径
---


# 问题描述:
如果window的用户名是中文或其他非英文字符的话,nvm可能会识别不出来,这时候进行nvm的一系列命令很可能会报错

# 解决方案
明白了问题原因就可以用以下代码来解决
``` shell
nvm root C:\\Users\\屈侯\\AppData\\Roaming\\nvm
```