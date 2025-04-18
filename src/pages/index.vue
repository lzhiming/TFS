<template>
    <div>
    <div id="container">
        
    </div>

    <div>
        <span style="color:#1d4ed8">{{tickerName}}</span> (600519)日线 ,输入股票代码查询近半年日线
        </div>
    <div class="btn-box">
        <input type="text" class="stock-query-input" v-model="ticker" />
        <button @click="refreshInfo" class="stock-query-btn">查询</button>
    </div>

    <span style="color: #ccc; font-size: .8rem;">
         使用Nuxt 服务端渲染全栈开发，前端vue3，后端node，数据来源tsanghi.com
    </span>

    </div>
</template>

<script setup>
import axios from 'axios';
import { Chart } from '@antv/g2';
import { onMounted, ref } from 'vue';

const { data: info } = useAsyncData('sticks-list', async () => {
    try {
        const response = await axios.get('https://tsanghi.com/api/fin/stock/XSHG/daily?token=273f9fb332a8473cb9238c2c6e519e82&&start_date=2024-09-26&ticker=600519')
        
        return response.data
    } catch (err) {
        console.error('获取数据失败:', err)
        // 可以返回默认值或抛出错误
        return [] // 示例：返回空数组作为fallback
    }
});

function randerChart(data){
  const chart = new Chart({
    container: 'container',
    autoFit: true,
  });

  chart
    .data(data)
    .encode('x', 'time')
    .encode('color', (d) => {
      const trend = Math.sign(d.start - d.end);
      return trend > 0 ? '下跌' : trend === 0 ? '不变' : '上涨';
    })
    // .scale('x', {
    //   compare: (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    // })
    .scale('color', {
      domain: ['下跌', '不变', '上涨'],
      range: ['#4daf4a', '#999999', '#e41a1c'],
    });

  chart
    .link()
    .encode('y', ['min', 'max'])
    .tooltip({
      title: 'time',
      items: [
        { field: 'start', name: '开盘价' },
        { field: 'end', name: '收盘价' },
        { field: 'min', name: '最低价' },
        { field: 'max', name: '最高价' },
      ],
    });

  chart
    .interval()
    .encode('y', ['start', 'end'])
    .style('fillOpacity', 1)
    .style('stroke', (d) => {
      if (d.start === d.end) return '#999999';
    })
    .axis('y', {
      title: false,
    })
    .tooltip({
      title: 'time',
      items: [
        { field: 'start', name: '开盘价' },
        { field: 'end', name: '收盘价' },
        { field: 'min', name: '最低价' },
        { field: 'max', name: '最高价' },
      ],
    });

  chart.render();
}

let ticker = ref('600519')
let tickerName = ref('贵州茅台')
function refreshInfo(){
    axios.get(`/api/info?ticker=${ticker.value}`).then(res => {
        tickerName.value = res.data.data[0].name
    })
    axios.get(`/api/hello?ticker=${ticker.value}`).then(res => {
            res.data.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

            let fetchData = res.data.data.map(val => {
            let chartData = {
                time: val.date,
                start: val.open,
                max: val.high,
                min: val.low,
                end: val.close,
                volumn: val.volumn,
                money: val.amount,
            }
        return chartData
        })
        randerChart(fetchData)
    })
}

onMounted(() => {
  info.value.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  let fetchData = info.value.data.map(val => {
    let chartData = {
      time: val.date,
      start: val.open,
      max: val.high,
      min: val.low,
      end: val.close,
      volumn: val.volumn,
      money: val.amount,
    }
    return chartData
  })
  randerChart(fetchData)
})


</script>

<style>
.btn-box{
    display: flex;
    gap: 1rem;
}
.stock-query-btn {
  /* 基础样式 */
  padding: 12px 24px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #e0f2fe;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  /* 科技感渐变背景 */
  background: linear-gradient(135deg, 
    #3b82f6 0%, 
    #2563eb 50%, 
    #1d4ed8 100%);
  
  /* 边框和形状 */
  border: none;
  border-radius: 6px;
  box-shadow: 
    0 4px 15px rgba(59, 130, 246, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 0 10px rgba(59, 130, 246, 0.6) inset;
  
  /* 光标和过渡效果 */
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  /* 科技感细节 - 光条效果 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(224, 242, 254, 0.8), transparent);
    transition: 0.5s;
  }
  
  /* 悬停效果 */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 20px rgba(59, 130, 246, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.2) inset,
      0 0 15px rgba(59, 130, 246, 0.8) inset;
    
    &::before {
      left: 100%;
    }
  }
  
  /* 点击效果 */
  &:active {
    transform: translateY(0);
    box-shadow: 
      0 2px 10px rgba(59, 130, 246, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset,
      0 0 5px rgba(59, 130, 246, 0.8) inset;
  }
  
  /* 添加股票图标（可选） */
  &::after {
    content: '📈';
    margin-left: 8px;
    filter: brightness(1.2);
  }
}
.stock-query-input {
  /* 基础样式 */
  width: 300px;
  padding: 14px 20px;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
  font-size: 16px;
  color: #e0f2fe;
  background-color: rgba(30, 41, 59, 0.8);
  
  /* 边框设计 */
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  outline: none;
  
  /* 光效阴影 */
  box-shadow: 
    0 0 10px rgba(59, 130, 246, 0.2) inset,
    0 0 15px rgba(59, 130, 246, 0.1);
  
  /* 过渡动画 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 占位文字样式 */
  &::placeholder {
    color: rgba(200, 225, 255, 0.6);
    letter-spacing: 0.5px;
  }
  
  /* 聚焦效果 */
  &:focus {
    border-color: rgba(59, 130, 246, 0.8);
    background-color: rgba(30, 41, 59, 0.9);
    box-shadow: 
      0 0 15px rgba(59, 130, 246, 0.4) inset,
      0 0 20px rgba(59, 130, 246, 0.2);
    
    /* 底部光条动画 */
    &::after {
      transform: scaleX(1);
    }
  }
  
  /* 底部动态光条（伪元素） */
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent, 
      #3b82f6, 
      #60a5fa, 
      transparent);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.4s ease;
  }
  
  /* 输入文字特效 */
  &:focus, &:valid {
    text-shadow: 0 0 5px rgba(224, 242, 254, 0.3);
  }
  
  /* 可选：添加股票图标前缀 */
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v16"/><path d="M18 8v10"/><path d="M2 12h20"/><path d="M6 12l4-4 4 4 4-4 4 4"/></svg>');
  background-repeat: no-repeat;
  background-position: 15px center;
  padding-left: 45px;
}
</style>
