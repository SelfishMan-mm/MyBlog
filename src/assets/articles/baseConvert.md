***
title : '进制转换'
date : '2025-3-27 14:45:00'
categories :
  - C++
tags :
  - C++
***

## 进制转换
关键：基数  位权

### k进制转十进制
K进制转十进制是将一个以 k 为基数的数字表示转换为十进制数的过程，其中 k 是一个大于等于2的整数（即二进制、三进制等）。在这个过程中，每一位的权值都是 k 的幂，最终将所有位的数值加起来得
到十进制数。
举例 345(八进制) 转 十进制
基数3 4 5
位权 8^n
结果3*8^2 + 4*8^1 + 5*8^0 = 229
因此k进制转十进制过程模拟如下
假设一个k进制数为 `d[n-1]d[n-2]...d[1]d[0]`，其十进制值为：

```
decimal_value = d[n-1]*k^(n-1) + d[n-2]*k^(n-2) + ... + d[1]*k^1 + d[0]*k^0
```
### 代码实现
```cpp
#include <iostream>
#include <string>
#include <cmath>
using namespace std;

int calc(char c) {
    if (c >= 'A') {  // 如果字符是字母(大于’9’)
        return 10 + c - 'A'; // 转换为对应的数字值(A = 10, B = 11.....) 依据ASCII码
    }
    return c - '0'; // 如果是数字字符，直接转换为对应的数字
}

int change(int k, string s) {
    int ans = 0;
    for (int i = 0; i < s.size(); i++) {
        ans = ans * k + calc(s[i]); // 基于进制k进行累加
    }
    return ans; // 返回转换后的十进制
}

int main() {
    int k;
    string s;
    cout << "请输入进制k和k进制数：" << endl;
    cin >> k >> s;
    int result = change(k, s);
    cout << "转换后的十进制数为：" << result << endl;
    return 0;
}
```
