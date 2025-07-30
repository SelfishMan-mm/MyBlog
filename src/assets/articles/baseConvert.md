# 进制转换算法详解

## 算法概述

进制转换是计算机科学中的基础概念，涉及不同数制之间的相互转换。常见的进制包括二进制、八进制、十进制和十六进制。

## 基础概念

### 进制的定义

- **基数**: 进制的底数，表示该进制中可用的数字个数
- **位权**: 每一位数字所代表的权值，等于基数的幂次

### 常见进制

| 进制 | 基数 | 数字范围 | 示例 |
|------|------|----------|------|
| 二进制 | 2 | 0-1 | 1010₂ |
| 八进制 | 8 | 0-7 | 1234₈ |
| 十进制 | 10 | 0-9 | 1234₁₀ |
| 十六进制 | 16 | 0-9,A-F | 1A2B₁₆ |

## K进制转十进制

### 算法原理

K进制转十进制使用**位权展开法**：

对于K进制数 `d[n-1]d[n-2]...d[1]d[0]`，其十进制值为：
```
decimal_value = d[n-1]×k^(n-1) + d[n-2]×k^(n-2) + ... + d[1]×k^1 + d[0]×k^0
```

### 示例计算

将八进制数 345₈ 转换为十进制：
- 3×8² + 4×8¹ + 5×8⁰
- = 3×64 + 4×8 + 5×1
- = 192 + 32 + 5
- = 229₁₀

### 代码实现

```cpp
#include <iostream>
#include <string>
using namespace std;

// 字符转数字
int charToDigit(char c) {
    if (c >= '0' && c <= '9') {
        return c - '0';
    }
    if (c >= 'A' && c <= 'Z') {
        return 10 + c - 'A';
    }
    if (c >= 'a' && c <= 'z') {
        return 10 + c - 'a';
    }
    return -1; // 无效字符
}

// K进制转十进制
long long kToDecimal(int k, const string& s) {
    long long result = 0;
    long long base = 1;
    
    // 从右到左处理每一位
    for (int i = s.length() - 1; i >= 0; i--) {
        int digit = charToDigit(s[i]);
        if (digit >= k || digit < 0) {
            cout << "错误：无效的" << k << "进制数字" << endl;
            return -1;
        }
        result += digit * base;
        base *= k;
    }
    
    return result;
}

// 优化版本：使用秦九韶算法（霍纳法则）
long long kToDecimalOptimized(int k, const string& s) {
    long long result = 0;
    
    for (char c : s) {
        int digit = charToDigit(c);
        if (digit >= k || digit < 0) {
            cout << "错误：无效的" << k << "进制数字" << endl;
            return -1;
        }
        result = result * k + digit;
    }
    
    return result;
}
```

## 十进制转K进制

### 算法原理

十进制转K进制使用**短除法**：
1. 将十进制数不断除以K，记录余数
2. 余数序列的逆序就是K进制表示

### 示例计算

将十进制数 229 转换为八进制：
```
229 ÷ 8 = 28 ... 5
28 ÷ 8 = 3 ... 4
3 ÷ 8 = 0 ... 3
```
读取余数序列：3, 4, 5，所以 229₁₀ = 345₈

### 代码实现

```cpp
// 数字转字符
char digitToChar(int digit) {
    if (digit < 10) {
        return '0' + digit;
    }
    return 'A' + digit - 10;
}

// 十进制转K进制
string decimalToK(long long decimal, int k) {
    if (decimal == 0) return "0";
    
    string result = "";
    bool isNegative = decimal < 0;
    decimal = abs(decimal);
    
    while (decimal > 0) {
        int remainder = decimal % k;
        result = digitToChar(remainder) + result;
        decimal /= k;
    }
    
    if (isNegative) {
        result = "-" + result;
    }
    
    return result;
}

// 递归版本
string decimalToKRecursive(long long decimal, int k) {
    if (decimal == 0) return "";
    
    return decimalToKRecursive(decimal / k, k) + digitToChar(decimal % k);
}
```

## 完整示例程序

```cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

class BaseConverter {
private:
    int charToDigit(char c) {
        if (c >= '0' && c <= '9') return c - '0';
        if (c >= 'A' && c <= 'Z') return 10 + c - 'A';
        if (c >= 'a' && c <= 'z') return 10 + c - 'a';
        return -1;
    }
    
    char digitToChar(int digit) {
        if (digit < 10) return '0' + digit;
        return 'A' + digit - 10;
    }

public:
    // K进制转十进制
    long long toDecimal(const string& number, int fromBase) {
        long long result = 0;
        
        for (char c : number) {
            int digit = charToDigit(c);
            if (digit >= fromBase || digit < 0) {
                throw invalid_argument("无效的进制数字");
            }
            result = result * fromBase + digit;
        }
        
        return result;
    }
    
    // 十进制转K进制
    string fromDecimal(long long decimal, int toBase) {
        if (decimal == 0) return "0";
        
        string result = "";
        bool isNegative = decimal < 0;
        decimal = abs(decimal);
        
        while (decimal > 0) {
            result = digitToChar(decimal % toBase) + result;
            decimal /= toBase;
        }
        
        return isNegative ? "-" + result : result;
    }
    
    // 任意进制转换
    string convert(const string& number, int fromBase, int toBase) {
        long long decimal = toDecimal(number, fromBase);
        return fromDecimal(decimal, toBase);
    }
};

int main() {
    BaseConverter converter;
    
    try {
        // 测试用例
        cout << "二进制 1010 转十进制: " 
             << converter.toDecimal("1010", 2) << endl;
        
        cout << "十进制 10 转二进制: " 
             << converter.fromDecimal(10, 2) << endl;
        
        cout << "十六进制 FF 转十进制: " 
             << converter.toDecimal("FF", 16) << endl;
        
        cout << "八进制 345 转十六进制: " 
             << converter.convert("345", 8, 16) << endl;
        
    } catch (const exception& e) {
        cout << "错误: " << e.what() << endl;
    }
    
    return 0;
}
```

## 算法复杂度分析

### 时间复杂度
- **K进制转十进制**: O(n)，其中n是数字的位数
- **十进制转K进制**: O(log_k(decimal))

### 空间复杂度
- **O(log_k(decimal))** - 存储结果字符串所需的空间

## 应用场景

1. **计算机系统** - CPU指令、内存地址表示
2. **网络编程** - IP地址、MAC地址转换
3. **密码学** - 数据编码和解码
4. **数据压缩** - 不同进制的数据表示
5. **算法竞赛** - 进制转换相关题目

## 常见错误与注意事项

1. **字符处理** - 正确处理大小写字母
2. **边界检查** - 验证输入数字是否在有效范围内
3. **溢出处理** - 大数转换时的溢出问题
4. **负数处理** - 正确处理负数的进制转换

## 扩展知识

### 浮点数进制转换

```cpp
string decimalFractionToK(double fraction, int k, int precision = 10) {
    string result = "0.";
    
    for (int i = 0; i < precision && fraction > 0; i++) {
        fraction *= k;
        int digit = (int)fraction;
        result += digitToChar(digit);
        fraction -= digit;
    }
    
    return result;
}
```

进制转换是计算机科学的基础，掌握其原理和实现方法对于理解计算机内部工作机制具有重要意义。