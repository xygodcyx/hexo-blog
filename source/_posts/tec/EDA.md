---
title: EDA
tags:
  - 'EDA'
  - '硬件'
categories:
  - '技术'
date: 2025-09-12 17:11:52
---

写在前面：

因笔者为初学者，所以在阅读本笔记之前你要有本文会出现以下致命错误的心理准备：概念解释错误、操作错误、专业术语使用错误等低级错误

但笔者会秉承着对信息的尊重，尽可能的减少上述错误以增大本文的可参考性和可学习性

以上，共勉

---

## 1.1 安装Quartus

先下载[官网的版本](https://www.intel.com/content/www/us/en/software-kit/711791/intel-quartus-ii-web-edition-design-software-version-13-0sp1-for-windows.html?utm_source=chatgpt.com)

然后用网上的[破解器](/assets/EDA/Quartus_13.0_SP1_x64_hack.rar)选择dll文件，进行生成许可证操作，生成完的许可证里的XXXXXX要用tools/license setup里的NIC(ID)替换，然后选择这个许可证文件即可

![20250912171443.png](/assets/EDA/20250912171443.png)

## 2.1 Quartus的Hello World

接着创建新项目测试软件的可用性：

点击左上角的 File / New：

![20250912171842.png](/assets/EDA/20250912171842.png)

点击New Quartus || Project，随后依据引导进行创建即可

接着还是点击 New ，这次创建Design Files /  Verilog HDL File，复制以下代码：

``` c
// 文件名：main.v
// 一个简单的测试模块，LED 闪烁

module main (
    input  wire clk,     // 时钟信号
    output reg  led      // LED 输出
);

    // 定义一个计数器
    reg [23:0] counter;

    always @(posedge clk) begin
        counter <= counter + 1;   // 每个时钟加一
        if (counter == 24'd0)     // 溢出时翻转 LED
            led <= ~led;
    end

endmodule

```

接着在Files侧边栏里将这个文件设置为顶层文件

![20250912172742.png](/assets/EDA/20250912172742.png)

然后按照同样的步骤创建一个测试文件tb_main.v，内容为：

``` c
// 文件名：tb_main.v
// Testbench 用来仿真 main 模块，不需要输入输出端口

`timescale 1ns/1ps  // 时间单位：1ns，精度：1ps

module tb_main;

    // 测试信号
    reg clk;         // 时钟
    wire led;        // 输出 LED

    // 实例化待测试的模块 (DUT)
    main uut (
        .clk(clk),
        .led(led)
    );

    // 产生时钟：周期 20ns => 50MHz
    initial begin
        clk = 0;
        forever #10 clk = ~clk;   // 每 10ns 翻转一次
    end

    // 仿真时长控制
    initial begin
        // 运行 2毫秒 (2,000,000 ns)，再结束
        #2000000 $stop;
    end

endmodule

```

这个文件不用设置成顶层文件

然后配置模拟器，点击Assignments / Settings：

![20250912173121.png](/assets/EDA/20250912173121.png)

点击EDA Tool Settings / Simulation, 选择Tool name为ModelSim-Altera, 选择Format for output netlist为Verilog HDL

![20250912173305.png](/assets/EDA/20250912173305.png)

然后点击Project / Add/Remove Files in Project将tb_main.v添加进去

接着就可以点击Tools / Run Simulation Tool / RTL Simulation进行模拟了

能正常运行就说明软件可以正常工作，可以进行下一步了

## 3.1 画第一个电路板

很好，准备工作已经全部完成了，接下来我们创建第一个真正的项目吧~

首先按照 [2.1 Quartus的Hello World](/tec/EDA/#2-1Quartus的Hello-World) 的方法点开创建项目的对话框：

![20250918231140.png](/assets/EDA/20250918231140.png)

按照以下截图的配置进行创建，注意项目路径：存放在一个方便查找的位置，填好项目名后最好在存放路径后面手动添加同名的目录名，因为Quartus不会自动为项目创建一个新目录，所以最好指定一个空的目录存放项目文件，然后复制这个项目路径

![20250918225602.png](/assets/EDA/20250918225602.png)

把刚刚的复制的路径Add进Files里面

![20250918231331.png](/assets/EDA/20250918231331.png)

设备参数按照如下设置进行配置

![20250918231414.png](/assets/EDA/20250918231414.png)

EDA工具设置

![20250918231540.png](/assets/EDA/20250918231540.png)

最后Next

![20250918231602.png](/assets/EDA/20250918231602.png)

然后创建一个Block Diagram/Schematic File

![20250918231623.png](/assets/EDA/20250918231623.png)

双击空白画布打开对话框输入74138点击ok添加初始开发板：

![20250918231720.png](/assets/EDA/20250918231720.png)

接着点击画布任意处放置该开发板
![20250918231818.png](/assets/EDA/20250918231818.png)

接着按照同样的方法添加三个INPUT（分别命名为A、B和C）、两个NAND4、两个OUTPUT（分别命名为CC和S）以及VCC和GND，其中VCC需要对其右键点击Flip Vertical将其垂直翻转使得接线口位于上方

![20250918231944.png](/assets/EDA/20250918231944.png)

最好使用图示箭头所指的线条，按照如下接线方式连接各个组件：

![20250918232459.png](/assets/EDA/20250918232459.png)

注意：连接所有组件后，只允许出现图示的两个实心点，其中G2BN连接到GND----G2AN、inst4第四接线口连接到Y7N----inst3第四接线口，若出现非预期的实心点，请右键实心点将其删除

接着点击开始Start Compile开始编译

![20250918233006.png](/assets/EDA/20250918233006.png)

若未出现报错则说明绘图成功,否则请检查接线是否正确、实心点位置以及数量是否正确

![20250918233253.png](/assets/EDA/20250918233253.png)
