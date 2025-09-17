---
title: CPP学习笔记
tags:
  - 'C++'
categories:
  - '技术'
date: 2025-09-17 15:55:46
---

以实现植物大战僵尸为目标学习C++

---

## 类的使用

### 头文件应如何定义

是否要重写父类的定义的函数这一决策要在头文件里完成，.cpp只负责实现.h里定义的函数

`Plant.h`:

``` c
#pragma once

#include "Entity.h"

class Plant : public Entity
{
public:

 explicit Plant(const BaseData& baseData);
 void init(int plantType, int x, int y, int frameCount) override;
 void update() override;
 void updateAnim() override;
 void mainAttackTimer() override;
 void mainAttack() override;

};

```

所以Plant.cpp需要实现Entity定义的所有方法

但SunFlower并不需要，所以`SunFlower.h`可以写成：

``` c

#pragma once

#include "Plant.h"

class SunFlower :
 public Plant
{
public:
 SunFlower();
 void mainAttack() override;
};

```

这样一来，SunFlower.cpp只需要实现最终需要关心的mainAttack函数即可，其它植物也只需要实现自己的mainAttack，比如生产阳光、发射豌豆等等

### 调用函数时的父子关系

在类里写函数时，如果写mainAttack()，那么调用的就是自身的函数或子类的mainAttack，如果写Plant:mainAttack()，那永远只会调用自身的mainAttack

子类继承父类时，如果如果不想在实例化的时候传参数，可以直接在头文件里添加`无参构造函数声明`

`Entity.c`:

``` c

#pragma once

#include <string>
#include "AnimObject.h"

class Entity : public AnimObject
{
public:
 explicit Entity(const BaseData& baseData); // 说明要传入的参数，稍后可以直接在子类的cpp文件里传入
 void init(int plantType, int x, int y, int frameCount) override;
 void update() override;
 void updateAnim() override;
 void mainAttackTimer() override;
 void mainAttack() override;
};

```

`Sunshine.c`:

``` c
#pragma once
#include "Entity.h"
class Sunshine : public Entity
{
public:
    explicit Sunshine(const BaseData& baseData);
    Sunshine(); // 添加无参构造函数声明
    void mainAttack() override;
};
```
