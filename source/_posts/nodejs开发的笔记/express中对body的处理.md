---
title: express中对body的处理
date: 2025-04-03
tags: ['nodes','express']
author: QuHou
excerpt: 
---


需要加上这句话才能让express支持body参数

```nodejs
app.use(express.json())
```

