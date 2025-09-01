---
title: rust学习笔记
tags:
  - 'rust'
categories:
  - '技术'
date: 2025-08-21 14:59:15
---

一直想学习第二语言奈何一直没动力，前几天正好看到[博主讨论所谓的计算机”三大浪漫“](https://www.bilibili.com/video/BV1du4y1B7L6),其实之前也有尝试过实现编程语言，当然现在也正在进行中，在这位博主里了解到了[实现一个tcp协议](https://www.youtube.com/watch?v=bzja9fQWzdA)可能比三大浪漫更能提升个人水平，所以就想借这个机会用Rust去实现这个项目。如果较真的话，JS才应该算是我的第二语言，第一语言应该是C# ~~(话说不应该是C吗)~~ ，毕竟是通过学Unity才正式进入编程领域的，只是后面因为种种原因放弃了Unity转而专心学习JS。

如果不是零基础学rust的话，建议直接从官方项目入手: [minigrep](https://doc.rust-lang.org/book/ch12-00-an-io-project.html)，遇到不会的概念往前翻手册即可，直接跳过漫长枯燥的基础学习期。

---

<!-- more -->

## Hello World

无论之前学过几门语言、学的如何，所写的新语言的第一句代码应该像新生儿的第一句啼哭一样，永远是`hello world`。

``` rust
fn main(){
  println!("Hello World!");
}
```
