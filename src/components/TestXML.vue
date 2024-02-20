<template>
    <br>
    <div>
      <el-button type="info" @click="$router.push('/select')">返回</el-button>
      <el-button type="primary" @click="saveDataToXml" class="button_xml">保存数据到XML</el-button>
      <el-button type="success" @click="fetchDataFromXml" class="button_xml">从XML获取数据</el-button>
      <el-button type="warning" @click="Reset" class="button_xml">清空所有视觉图</el-button>
    </div>
    <br>
    <div ref="liquidChart" style="height: 300px;"></div>
    <div ref="tempChart" style="height: 300px;"></div>
  </template>
  
  <script>
  import axios from 'axios';
  import * as echarts from 'echarts';
  
  export default {
    data() {
      return {
        tempOption: '',
        liquidOption: '',
      };
    },
    methods: {
      saveDataToXml() {
        const LiquidOption = {
                    title: {
                        text: 'Liquid Level',
                        left: 'center',
                    },
                    grid: {
                        left: '5%',      // Left padding
                        right: '5%',     // Right padding
                        containLabel: true, // Ensure that labels (axis names, legends) are contained within the grid
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: 'shadow' //apply shadow effect when hover
                        }
                    },
                    xAxis: {
                        type: "category",
                        data: ['罐1', '罐2', '罐3', '罐4', '罐5', '罐6','罐7'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        type: "value",
                        axisLabel: {
                        formatter: "{value} %",
                        },
                        max: 100,
                    },
                    series: [
                    { 
                      name: 'liquid level', 
                      type: 'bar',  
                      barWidth: '30%', 
                      showBackground: true, 
                      data: [16,9,24,10,21,30,10],
                    },
                    ],
        };
        const TempOption = {
                title: {
                    text: 'Temperature',
                    left: 'center',
                },
                legend: {  
                    top: '10%',     
                },
                grid: {
                    left: '5%',      // Left padding
                    right: '5%',     // Right padding
                    top: '30%',
                    containLabel: true, // Ensure that labels (axis names, legends) are contained within the grid
                },
                tooltip: {
                    trigger: "axis",
                },
                xAxis: {
                    type: "category",
                    data: ['30秒', '1分钟', '1分30秒', '2分钟', '2分30秒', '3分钟', '3分30秒', '4分钟'],
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                yAxis: {
                    type: "value",
                    nameLocation: 'start',
                    axisLabel: {
                    formatter: "{value} °C",
                    },
                },
                series: [
                { name: '罐1', type: 'line', data: [243, 242, 242, 242, 243, 242, 242, 243] },
                { name: '罐2', type: 'line', data: [243, 242, 242, 242, 243, 242, 242, 242] },
                { name: '罐3', type: 'line', data: [245, 246, 245, 245, 245, 245, 246, 245] },
                { name: '罐4', type: 'line', data: [243, 242, 242, 242, 243, 242, 242, 243] },
                { name: '罐5', type: 'line', data: [244, 244, 244, 245, 244, 244, 244, 245] },
                { name: '罐6', type: 'line', data: [66, 67, 68, 67, 67, 68, 68, 68] },
                { name: '罐7', type: 'line', data: [150, 151, 151, 151, 152, 152, 151, 152] },
                ],
                dataZoom: [
                {
                    type: 'slider',
                    start: 0,
                    end: 100,
                },
                {
                    type: 'inside',
                    start: 0,
                    end: 100,
                },
            ],
        };
        const combinedOptions = { LiquidOption, TempOption };
        axios.post('http://localhost:5000/saveToXml/fixed', combinedOptions)
          .then(response => {
            console.log('Data saved to XML:', response.data);
            this.$alert('成功保存！', '成功', {
                confirmButtonText: '确定',
                type: 'info',
                showClose: false,
                })
          })
          .catch(error => {
            console.error('Error saving data:', error);
            this.$alert('保存失败，请检查配置是否错误！', '失败', {
                confirmButtonText: '确定',
                type: 'warning',
                showClose: false,
                })
          });
      },
      fetchDataFromXml() {
        axios.get('http://localhost:5000/getDataFromXml/fixed')
          .then(response => {
            const parser = require('xml2js').Parser({ explicitArray: false });
            parser.parseString(response.data, (err, result) => {
              if (err) {
                console.error('Error parsing XML:', err);
                return;
              }

              this.liquidOption = result.root.LiquidOption;
              this.tempOption = result.root.TempOption;

              console.log('LiquidOption (parsed):', this.liquidOption);
              console.log('TempOption (parsed):', this.tempOption);
              this.initializeECharts();
              
              // Further processing of LiquidOption and TempOption as needed
            });
          })
          .catch(error => {
            console.error('Error fetching XML data:', error);
          });
      },
      initializeECharts() {
        const liquidChart = echarts.init(this.$refs.liquidChart);
        const liquidChartOptions = this.liquidOption;
        liquidChart.setOption(liquidChartOptions);

        const tempChart = echarts.init(this.$refs.tempChart);
        const tempChartOptions = this.tempOption;
        tempChart.setOption(tempChartOptions);
      },
      Reset() {
        if(echarts.getInstanceByDom(this.$refs.liquidChart)){
          echarts.getInstanceByDom(this.$refs.liquidChart).dispose();
        }
        if(echarts.getInstanceByDom(this.$refs.tempChart)){
          echarts.getInstanceByDom(this.$refs.tempChart).dispose();
        }
      }
    },
  };
  </script>
  
  <style scoped>
  @import '../css/TestXML.css';
  </style>