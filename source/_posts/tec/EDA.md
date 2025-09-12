---
title: EDA
tags:
  - 'EDA'
  - '硬件'
categories:
  - '技术'
date: 2025-09-12 17:11:52
---


## 安装Quartus和配置模拟器

先下载[官网的版本](https://www.intel.com/content/www/us/en/software-kit/711791/intel-quartus-ii-web-edition-design-software-version-13-0sp1-for-windows.html?utm_source=chatgpt.com)

然后用网上的破解器选择dll文件生成许可证，许可证里的XXXXXX要用tools/license setup里的NIC(ID)替换，然后选择这个许可证文件即可

![20250912171443.png](/assets/EDA/20250912171443.png)

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
