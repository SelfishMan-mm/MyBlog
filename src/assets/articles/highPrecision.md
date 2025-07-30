# 高精度算法实现与应用

## 算法概述

高精度算法用于处理超出基本数据类型表示范围的大整数运算。当数字位数超过 long long 的表示范围（约19位）时，需要使用高精度算法来进行精确计算。

## 基础数据结构

### 数组表示法

使用数组存储大整数，通常采用**逆序存储**（低位在前，高位在后）：

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

class BigInteger {
private:
    vector<int> digits;  // 存储数字，digits[0]是个位
    bool negative;       // 符号位
    
public:
    // 构造函数
    BigInteger() : negative(false) {
        digits.push_back(0);
    }
    
    BigInteger(long long num) : negative(num < 0) {
        num = abs(num);
        if (num == 0) {
            digits.push_back(0);
        } else {
            while (num > 0) {
                digits.push_back(num % 10);
                num /= 10;
            }
        }
    }
    
    BigInteger(const string& str) {
        int start = 0;
        negative = false;
        
        if (str[0] == '-') {
            negative = true;
            start = 1;
        } else if (str[0] == '+') {
            start = 1;
        }
        
        for (int i = str.length() - 1; i >= start; i--) {
            digits.push_back(str[i] - '0');
        }
        
        removeLeadingZeros();
    }
    
    // 移除前导零
    void removeLeadingZeros() {
        while (digits.size() > 1 && digits.back() == 0) {
            digits.pop_back();
        }
        if (digits.size() == 1 && digits[0] == 0) {
            negative = false;
        }
    }
};
```

## 高精度加法

### 算法思路

1. 对齐两个数的位数
2. 从低位到高位逐位相加
3. 处理进位
4. 处理符号

```cpp
BigInteger add(const BigInteger& other) const {
    // 如果符号不同，转换为减法
    if (negative != other.negative) {
        if (negative) {
            BigInteger temp = *this;
            temp.negative = false;
            return other.subtract(temp);
        } else {
            BigInteger temp = other;
            temp.negative = false;
            return subtract(temp);
        }
    }
    
    BigInteger result;
    result.digits.clear();
    result.negative = negative;
    
    int carry = 0;
    int maxLen = max(digits.size(), other.digits.size());
    
    for (int i = 0; i < maxLen || carry; i++) {
        int sum = carry;
        
        if (i < digits.size()) {
            sum += digits[i];
        }
        if (i < other.digits.size()) {
            sum += other.digits[i];
        }
        
        result.digits.push_back(sum % 10);
        carry = sum / 10;
    }
    
    return result;
}

// 重载 + 运算符
BigInteger operator+(const BigInteger& other) const {
    return add(other);
}
```

## 高精度减法

### 算法思路

1. 比较两数大小，确保被减数不小于减数
2. 从低位到高位逐位相减
3. 处理借位
4. 处理符号和前导零

```cpp
// 比较绝对值大小
int compareAbs(const BigInteger& other) const {
    if (digits.size() != other.digits.size()) {
        return digits.size() < other.digits.size() ? -1 : 1;
    }
    
    for (int i = digits.size() - 1; i >= 0; i--) {
        if (digits[i] != other.digits[i]) {
            return digits[i] < other.digits[i] ? -1 : 1;
        }
    }
    
    return 0;
}

BigInteger subtract(const BigInteger& other) const {
    // 如果符号不同，转换为加法
    if (negative != other.negative) {
        BigInteger temp = other;
        temp.negative = !temp.negative;
        return add(temp);
    }
    
    // 确保被减数的绝对值不小于减数
    if (compareAbs(other) < 0) {
        BigInteger result = other.subtract(*this);
        result.negative = !result.negative;
        return result;
    }
    
    BigInteger result;
    result.digits.clear();
    result.negative = negative;
    
    int borrow = 0;
    
    for (int i = 0; i < digits.size(); i++) {
        int diff = digits[i] - borrow;
        
        if (i < other.digits.size()) {
            diff -= other.digits[i];
        }
        
        if (diff < 0) {
            diff += 10;
            borrow = 1;
        } else {
            borrow = 0;
        }
        
        result.digits.push_back(diff);
    }
    
    result.removeLeadingZeros();
    return result;
}

// 重载 - 运算符
BigInteger operator-(const BigInteger& other) const {
    return subtract(other);
}
```

## 高精度乘法

### 普通乘法算法

```cpp
BigInteger multiply(const BigInteger& other) const {
    BigInteger result;
    result.digits.assign(digits.size() + other.digits.size(), 0);
    result.negative = negative != other.negative;
    
    for (int i = 0; i < digits.size(); i++) {
        int carry = 0;
        for (int j = 0; j < other.digits.size() || carry; j++) {
            long long prod = result.digits[i + j] + carry;
            
            if (j < other.digits.size()) {
                prod += (long long)digits[i] * other.digits[j];
            }
            
            result.digits[i + j] = prod % 10;
            carry = prod / 10;
        }
    }
    
    result.removeLeadingZeros();
    return result;
}

// 重载 * 运算符
BigInteger operator*(const BigInteger& other) const {
    return multiply(other);
}
```

### Karatsuba 快速乘法

对于超大数的乘法，可以使用 Karatsuba 算法将时间复杂度从 O(n²) 降低到 O(n^log₂3) ≈ O(n^1.585)：

```cpp
BigInteger karatsuba(const BigInteger& other) const {
    // 基础情况：小数直接相乘
    if (digits.size() <= 32 || other.digits.size() <= 32) {
        return multiply(other);
    }
    
    int n = max(digits.size(), other.digits.size());
    int half = n / 2;
    
    // 分割数字
    BigInteger low1, high1, low2, high2;
    
    // 分割第一个数
    for (int i = 0; i < min(half, (int)digits.size()); i++) {
        low1.digits.push_back(digits[i]);
    }
    for (int i = half; i < digits.size(); i++) {
        high1.digits.push_back(digits[i]);
    }
    
    // 分割第二个数
    for (int i = 0; i < min(half, (int)other.digits.size()); i++) {
        low2.digits.push_back(other.digits[i]);
    }
    for (int i = half; i < other.digits.size(); i++) {
        high2.digits.push_back(other.digits[i]);
    }
    
    // 递归计算
    BigInteger z0 = low1.karatsuba(low2);
    BigInteger z2 = high1.karatsuba(high2);
    BigInteger z1 = (low1 + high1).karatsuba(low2 + high2) - z0 - z2;
    
    // 组合结果
    BigInteger result = z2.shiftLeft(2 * half) + z1.shiftLeft(half) + z0;
    result.negative = negative != other.negative;
    
    return result;
}
```

## 高精度除法

### 长除法算法

```cpp
pair<BigInteger, BigInteger> divideAndRemainder(const BigInteger& divisor) const {
    if (divisor.isZero()) {
        throw invalid_argument("除数不能为零");
    }
    
    BigInteger dividend = *this;
    dividend.negative = false;
    BigInteger div = divisor;
    div.negative = false;
    
    if (dividend.compareAbs(div) < 0) {
        return {BigInteger(0), *this};
    }
    
    BigInteger quotient;
    BigInteger remainder;
    
    for (int i = digits.size() - 1; i >= 0; i--) {
        remainder = remainder.shiftLeft(1) + BigInteger(digits[i]);
        
        int count = 0;
        while (remainder.compareAbs(div) >= 0) {
            remainder = remainder - div;
            count++;
        }
        
        quotient.digits.insert(quotient.digits.begin(), count);
    }
    
    quotient.negative = negative != divisor.negative;
    remainder.negative = negative;
    
    quotient.removeLeadingZeros();
    remainder.removeLeadingZeros();
    
    return {quotient, remainder};
}

// 重载 / 和 % 运算符
BigInteger operator/(const BigInteger& other) const {
    return divideAndRemainder(other).first;
}

BigInteger operator%(const BigInteger& other) const {
    return divideAndRemainder(other).second;
}
```

## 辅助函数

```cpp
// 左移（相当于乘以10^n）
BigInteger shiftLeft(int n) const {
    BigInteger result = *this;
    for (int i = 0; i < n; i++) {
        result.digits.insert(result.digits.begin(), 0);
    }
    return result;
}

// 判断是否为零
bool isZero() const {
    return digits.size() == 1 && digits[0] == 0;
}

// 转换为字符串
string toString() const {
    string result = "";
    if (negative && !isZero()) {
        result += "-";
    }
    
    for (int i = digits.size() - 1; i >= 0; i--) {
        result += (char)('0' + digits[i]);
    }
    
    return result;
}

// 重载输出运算符
friend ostream& operator<<(ostream& os, const BigInteger& num) {
    os << num.toString();
    return os;
}
```

## 完整使用示例

```cpp
int main() {
    // 创建大整数
    BigInteger a("123456789012345678901234567890");
    BigInteger b("987654321098765432109876543210");
    
    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
    
    // 基本运算
    cout << "a + b = " << a + b << endl;
    cout << "a - b = " << a - b << endl;
    cout << "a * b = " << a * b << endl;
    cout << "b / a = " << b / a << endl;
    cout << "b % a = " << b % a << endl;
    
    // 阶乘计算示例
    BigInteger factorial(1);
    for (int i = 1; i <= 100; i++) {
        factorial = factorial * BigInteger(i);
    }
    cout << "100! = " << factorial << endl;
    
    return 0;
}
```

## 性能优化技巧

1. **基数优化** - 使用更大的基数（如10000）减少数组长度
2. **内存管理** - 预分配足够的空间避免频繁扩容
3. **算法选择** - 根据数据规模选择合适的算法
4. **并行计算** - 对于超大规模计算可以考虑并行化

## 应用场景

1. **密码学** - RSA加密算法中的大数运算
2. **数学计算** - 高精度数值计算
3. **算法竞赛** - 大数运算题目
4. **科学计算** - 需要极高精度的计算场景

高精度算法是处理大数运算的重要工具，掌握其实现原理和优化技巧对于解决相关问题具有重要意义。