# 快速幂算法详解

## 算法简介

快速幂算法是一种在 O(log n) 时间复杂度内计算 a^b mod c 的高效算法。相比于朴素的 O(n) 算法，快速幂通过二进制位运算大大提升了计算效率。

## 算法原理

快速幂的核心思想是将指数 b 用二进制表示，然后利用以下性质：

- a^b = a^(b1*2^0 + b2*2^1 + ... + bk*2^(k-1))
- 其中 bi 是 b 的二进制表示中第 i 位的值（0 或 1）

### 举例说明

计算 3^10：
- 10 的二进制表示为 1010
- 3^10 = 3^(2^1 + 2^3) = 3^2 * 3^8

通过这种方式，我们只需要计算 3^1, 3^2, 3^4, 3^8，然后根据二进制位选择相应的项相乘。

## 代码实现

### 基础版本

```cpp
typedef long long ll;

ll fast_power(ll a, ll b, ll c) {
    ll ans = 1;
    a %= c;  // 预处理，防止溢出
    
    while (b > 0) {
        if (b & 1) {  // 如果当前位为1
            ans = (ans * a) % c;
        }
        a = (a * a) % c;  // 底数平方
        b >>= 1;  // 指数右移一位
    }
    
    return ans;
}
```

### 递归版本

```cpp
ll fast_power_recursive(ll a, ll b, ll c) {
    if (b == 0) return 1;
    
    ll half = fast_power_recursive(a, b / 2, c);
    half = (half * half) % c;
    
    if (b & 1) {
        half = (half * a) % c;
    }
    
    return half;
}
```

## 算法分析

### 时间复杂度
- **O(log b)** - 因为每次迭代都将指数 b 除以 2

### 空间复杂度
- 迭代版本：**O(1)**
- 递归版本：**O(log b)** - 递归调用栈的深度

## 应用场景

1. **模运算计算** - 计算大数的幂次模运算
2. **RSA 加密算法** - 公钥加密中的核心运算
3. **数论问题** - 费马小定理、欧拉定理的应用
4. **矩阵快速幂** - 求解线性递推关系

## 扩展应用

### 矩阵快速幂

```cpp
struct Matrix {
    ll mat[2][2];
    
    Matrix operator*(const Matrix& other) const {
        Matrix result;
        for (int i = 0; i < 2; i++) {
            for (int j = 0; j < 2; j++) {
                result.mat[i][j] = 0;
                for (int k = 0; k < 2; k++) {
                    result.mat[i][j] += mat[i][k] * other.mat[k][j];
                }
            }
        }
        return result;
    }
};

Matrix matrix_power(Matrix base, ll n) {
    Matrix result;
    // 初始化为单位矩阵
    result.mat[0][0] = result.mat[1][1] = 1;
    result.mat[0][1] = result.mat[1][0] = 0;
    
    while (n > 0) {
        if (n & 1) {
            result = result * base;
        }
        base = base * base;
        n >>= 1;
    }
    
    return result;
}
```

## 常见错误与注意事项

1. **溢出问题** - 在乘法运算前要先取模
2. **边界条件** - 处理 b = 0 的情况
3. **负数处理** - 确保底数 a 为正数

## 练习题目

1. 计算 2^1000 mod 1000000007
2. 使用矩阵快速幂求斐波那契数列第 n 项
3. 实现快速幂求逆元

快速幂算法是算法竞赛和实际开发中的重要工具，掌握其原理和实现对于解决相关问题具有重要意义。