# 日期模拟算法实现

## 算法概述

日期模拟算法是处理日期计算问题的核心方法，主要用于解决日期范围遍历、日期差值计算、特定条件日期筛选等问题。

## 核心知识点

### 闰年判断

闰年的判断规则：
1. 能被400整除的年份是闰年
2. 能被4整除但不能被100整除的年份是闰年
3. 其他年份都不是闰年

```cpp
bool isLeapYear(int year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}
```

### 月份天数处理

```cpp
int days[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

int getDaysInMonth(int year, int month) {
    if (month == 2 && isLeapYear(year)) {
        return 29;
    }
    return days[month];
}
```

## 算法实现

### 基础日期遍历

```cpp
#include <iostream>
using namespace std;

int days[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

bool isLeapYear(int year) {
    return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
}

void traverseDateRange(int startYear, int endYear, int endMonth, int endDay) {
    for (int year = startYear; year <= endYear; year++) {
        // 更新二月天数
        if (isLeapYear(year)) {
            days[2] = 29;
        } else {
            days[2] = 28;
        }
        
        int maxMonth = (year == endYear) ? endMonth : 12;
        
        for (int month = 1; month <= maxMonth; month++) {
            int maxDay = (year == endYear && month == endMonth) ? endDay : days[month];
            
            for (int day = 1; day <= maxDay; day++) {
                // 处理当前日期 (year, month, day)
                processDate(year, month, day);
            }
        }
    }
}
```

## 实际应用案例

### 案例：计算笔画数总和超过50的日期

这是一个经典的日期模拟问题，需要计算2000年到2024年4月13日期间，年月日笔画数总和超过50的日期个数。

```cpp
#include <iostream>
#include <cstdio> 
using namespace std;

typedef long long LL;
int ans = 0;
int days[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
int bihua[10] = {13, 1, 2, 3, 5, 4, 4, 2, 2, 2}; // 0-9的笔画数

// 计算数字的笔画数总和
int calculateStrokes(int x, int digits) {
    int ret = 0;
    for (int i = 0; i < digits; ++i) {
        ret += bihua[x % 10];
        x /= 10;
    }
    return ret;
}

int main() {
    for (int year = 2000; year <= 2024; ++year) {
        // 判断是否为闰年
        if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
            days[2] = 29;
        } else {
            days[2] = 28;
        }
        
        int maxMonth = (year == 2024) ? 4 : 12;
        
        for (int month = 1; month <= maxMonth; ++month) {
            int maxDay = (year == 2024 && month == 4) ? 13 : days[month];
            
            for (int day = 1; day <= maxDay; ++day) {
                // 计算年月日的笔画数总和
                int totalStrokes = calculateStrokes(year, 4) + 
                                 calculateStrokes(month, 2) + 
                                 calculateStrokes(day, 2);
                
                if (totalStrokes > 50) {
                    ++ans;
                }
            }
        }
    }
    
    cout << ans << endl;
    return 0;
}
```

## 算法优化技巧

### 1. 预计算优化

对于重复计算的部分，可以预先计算并存储：

```cpp
// 预计算每个数字的笔画数
int strokesCache[10000];

void precompute() {
    for (int i = 0; i < 10000; i++) {
        strokesCache[i] = calculateStrokes(i, 4);
    }
}
```

### 2. 边界条件处理

```cpp
struct DateRange {
    int startYear, startMonth, startDay;
    int endYear, endMonth, endDay;
    
    bool isValidDate(int year, int month, int day) {
        if (year < startYear || year > endYear) return false;
        if (year == startYear && month < startMonth) return false;
        if (year == endYear && month > endMonth) return false;
        if (year == startYear && month == startMonth && day < startDay) return false;
        if (year == endYear && month == endMonth && day > endDay) return false;
        return true;
    }
};
```

## 常见应用场景

1. **日期范围统计** - 统计满足特定条件的日期个数
2. **工作日计算** - 计算两个日期间的工作日数量
3. **节假日处理** - 判断日期是否为节假日
4. **生日提醒** - 计算距离生日的天数
5. **项目工期** - 计算项目的实际工作日

## 时间复杂度分析

- **时间复杂度**: O(年数 × 12 × 31) = O(年数)
- **空间复杂度**: O(1) - 只使用常数额外空间

## 注意事项

1. **闰年处理** - 确保正确判断闰年
2. **月份边界** - 不同月份的天数不同
3. **年份边界** - 起始和结束年份的特殊处理
4. **数据类型** - 避免整数溢出问题

日期模拟算法虽然看似简单，但在实际应用中需要仔细处理各种边界条件和特殊情况，是编程竞赛和实际开发中的重要技能。