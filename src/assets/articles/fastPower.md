***
title : '快速幂'
date : '2025-4-10 16:10:00'
categories :
  - C++
tags :
  - C++
***

## 代码实现
```cpp
typedef long long ll;
ll fast_power(ll a,ll b,ll c){
    ll ans = 1;
    a%=c;
    while(b){
        if(b & 1){
            ans = (ans * a)%c;
        }
        a = (a*a)%c;
        b >>= 1;
    }
    return ans;
}
```
