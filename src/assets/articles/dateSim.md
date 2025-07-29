***
title : '日期模拟'
date : '2025-3-27 14:45:00'
categories :
  - C++
tags :
  - C++
***
## 日期模拟
核心是遍历起始日期到结束日期
另外一个是处理闰年需满足两个条件
1.是400的倍数
2.是四的倍数但不是100的倍数

## 例题
```cpp
#include <iostream>
#include <cstdio> 
using namespace std;
 
typedef long long LL;
const int maxn = 100 + 100;
int ans;
int days[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
int bihua[10] = {13, 1, 2, 3, 5, 4, 4, 2, 2, 2};
 
int cal(int x, int dig) {
    int ret = 0;
    for (int i = 0; i < dig; ++i) {
        ret += bihua[x % 10];
        x /= 10;
    }
    return ret;
}
 
int main() {
    for (int year = 2000; year <= 2024; ++year) {
        if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
            days[2] = 29;
        } else {
            days[2] = 28;
        }
        int maxMonth = (year == 2024 ? 4 : 12);
        for (int month = 1; month <= maxMonth; ++month) {
            int maxDay = (year == 2024 && month == 4 ? 13 : days[month]);
            for (int day = 1; day <= maxDay; ++day) {
                if (cal(year, 4) + cal(month, 2) + cal(day, 2) > 50) {
                    ++ans;
                } 
            }
        }
    }
    cout << ans << endl;
    return 0;
}
```
