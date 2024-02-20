<template>
    <br>
    <div>
      <el-button type="info" @click="back">返回</el-button>
      <el-button type="primary" @click="saveDataToXml" class="button_xml">保存设定到XML</el-button>
      <el-button type="success" @click="fetchDataFromXml" class="button_xml">从XML获取设定</el-button>
      <el-button v-if="connect === true" type="warning" @click="stopMQTT" class="button_xml">暂停MQTT</el-button>
      <el-button v-else-if="connect === false" type="success" @click="initMQTT" class="button_xml">连接MQTT</el-button>
    </div>
    <br>
    <div ref="liquidChart" style="height: 300px;"></div>
    <div ref="tempChart" style="height: 300px;"></div> 
  </template>
  
  <script>
  import axios from 'axios';
  import Paho from "paho-mqtt";
  import * as echarts from 'echarts';
  
  export default {
    data() {
      return {
        tempOption: '',
        liquidOption: '',
        liquidX: ['罐1', '罐2', '罐3', '罐4', '罐5', '罐6','罐7'],
        liquidY: [],
        tempX: [],
        tempY: [],
        connect: null,
        mqttClient: null,
      };
    },
    created() {
      this.initMQTT();
    },
    watch: {
      tempY: {
        handler() {
          this.renderChart('temp');
        },
        deep: true,
      },
      liquidY: {
        handler() {
          this.renderChart('liquid');
        },
        deep: true,
      }
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
                        data: [],
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
                      data: [],
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
                    data: [],
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
                { name: '罐1', type: 'line', data: [] },
                { name: '罐2', type: 'line', data: [] },
                { name: '罐3', type: 'line', data: [] },
                { name: '罐4', type: 'line', data: [] },
                { name: '罐5', type: 'line', data: [] },
                { name: '罐6', type: 'line', data: [] },
                { name: '罐7', type: 'line', data: [] },
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
        axios.post('http://localhost:5000/saveToXml/realtime', combinedOptions)
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
        axios.get('http://localhost:5000/getDataFromXml/realtime')
          .then(response => {
            const parser = require('xml2js').Parser({ explicitArray: false });
            parser.parseString(response.data, (err, result) => {
              if (err) {
                console.error('Error parsing XML:', err);
                return;
              }

              this.liquidOption = result.root.LiquidOption;
              this.tempOption = result.root.TempOption;
              
              console.log('LiquidOption :', this.liquidOption);
              console.log('TempOption :', this.tempOption);
              
              this.$alert('成功获取！', '成功', {
                confirmButtonText: '确定',
                type: 'info',
                showClose: false,
                })
            });
          })
          .catch(error => {
            console.error('Error fetching XML data:', error);
            this.$alert('获取失败，请检查配置是否错误！', '失败', {
                confirmButtonText: '确定',
                type: 'warning',
                showClose: false,
                })
          });
      },
      initMQTT() {
        const randomPart = Math.random().toString(36).substr(2, 8); // Generate a random string
        const uniqueClientId = `mqttx_${randomPart}`;
        this.mqttClient = new Paho.Client(
          "wss://r0f98a82.ala.us-east-1.emqxsl.com:8084/mqtt", uniqueClientId
        );
        this.mqttClient.onConnectionLost = (responseObject) => {
          console.log("Connection lost: " + responseObject.errorMessage);
        };
        this.mqttClient.onMessageArrived = (message) => {
          const topic = message.destinationName;
          console.log("Message Received: " + message.payloadString);
          console.log("From Topic: " + message.destinationName);
          if (topic.endsWith("/othertemper/data")) {
            this.handleMessage(message.payloadString, topic);
          } else if (topic.endsWith("/otherliquid/data")){
            this.handleMessage(message.payloadString, topic);
          }
        };
        const topics = [];
        const tempTopic = `KS19507/othertemper/data`;
        const liquidTopic = `KS19507/otherliquid/data`;
        topics.push(tempTopic, liquidTopic);
        console.log("Topics: ", topics);

        const options = {
          useSSL: false,
          userName: 'TestKH',
          password: 'TestKH',
          onSuccess: () => {
            console.log('Connected to MQTT broker(Testing Use)');
            topics.forEach(topic => {
              this.mqttClient.subscribe(topic, { qos: 0 });
            });
            this.connect = true;
            this.intervalId = setInterval(() => {
              this.publishDataToTopic();
            }, 10000);
          },
          onFailure: (error) => {
            console.log('MQTT connection error:', error.errorMessage);
            this.reconnect();
          },
        };
        this.mqttClient.connect(options);
      },
      stopMQTT() {
        clearInterval(this.intervalId);
        this.mqttClient.disconnect();
        this.connect = false;

      },
      publishDataToTopic() {
        // Check if the MQTT client is connected before publishing
        const currentTime = new Date().toLocaleString();
        if (this.mqttClient.isConnected()) {
          const tempTopic = "KS19507/othertemper/data";
          const tempData = {
            time: currentTime,
            温度记录: {
              temp1: this.getRandomNumber(250, 270), temp2: this.getRandomNumber(250, 270),
              temp3: this.getRandomNumber(250, 270), temp4: this.getRandomNumber(250, 270),
              temp5: this.getRandomNumber(250, 270), temp6: this.getRandomNumber(60, 70),
              temp7: this.getRandomNumber(140, 150),
            },
            MeId: "KS19507",
          };
          const liquidTopic = "KS19507/otherliquid/data";
          const liquidData = {
            time: currentTime,
            液位记录: {
              TL1: this.getRandomNumber(7, 12), TL2: this.getRandomNumber(5, 10),
              TL3: this.getRandomNumber(7, 12), TL4: this.getRandomNumber(5, 10),
              TL5: this.getRandomNumber(5, 10), TL6: this.getRandomNumber(20, 30),
              TL7: this.getRandomNumber(10, 15),
            },
            MeId: "KS19507",
          };
          const tempMessage = new Paho.Message(JSON.stringify(tempData));
          tempMessage.destinationName = tempTopic;
          const liquidMessage = new Paho.Message(JSON.stringify(liquidData));
          liquidMessage.destinationName = liquidTopic;
          this.mqttClient.send(tempMessage); 
          this.mqttClient.send(liquidMessage); 
          console.log("Published JSON data:", tempData);
          console.log("Published JSON data:", liquidData);
        } else {
          console.error("MQTT client is not connected.");
        }
      },
      getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      handleMessage(message, topic) {
        const isTemperature = topic.endsWith("/othertemper/data");
        const isLiquid = topic.endsWith("/otherliquid/data");
        if (isTemperature || isLiquid) {
          const jsonData = JSON.parse(message);
          this.machineID = jsonData.MeId;
          const data = {
            time: jsonData.time,
            machineId: jsonData.MeId,
          };
          if (isTemperature) {
            data.temp1 = jsonData.温度记录.temp1;
            data.temp2 = jsonData.温度记录.temp2;
            data.temp3 = jsonData.温度记录.temp3;
            data.temp4 = jsonData.温度记录.temp4;
            data.temp5 = jsonData.温度记录.temp5;
            data.temp6 = jsonData.温度记录.temp6;
            data.temp7 = jsonData.温度记录.temp7;
            this.tempX.push(jsonData.time);
            this.tempY.push([
              jsonData.温度记录.temp1, jsonData.温度记录.temp2, jsonData.温度记录.temp3, 
              jsonData.温度记录.temp4, jsonData.温度记录.temp5, jsonData.温度记录.temp6,
              jsonData.温度记录.temp7
            ]);
          } else if (isLiquid) {
            data.liquidlevel1 = jsonData.液位记录.TL1; 
            data.liquidlevel2 = jsonData.液位记录.TL2; 
            data.liquidlevel3 = jsonData.液位记录.TL3; 
            data.liquidlevel4 = jsonData.液位记录.TL4; 
            data.liquidlevel5 = jsonData.液位记录.TL5; 
            data.liquidlevel6 = jsonData.液位记录.TL6; 
            data.liquidlevel7 = jsonData.液位记录.TL7;
            if (Array.isArray(this.liquidY) && this.liquidY.length !== 0) {
              this.liquidY.splice(0, this.liquidY.length);
            }
            this.liquidY.push([
              jsonData.液位记录.TL1, jsonData.液位记录.TL2, jsonData.液位记录.TL3, 
              jsonData.液位记录.TL4, jsonData.液位记录.TL5, jsonData.液位记录.TL6,
              jsonData.液位记录.TL7
            ]);
          }
        }
      },
      renderChart(type) {
        switch (type){
          case 'temp':
            if(this.tempOption !== '') { 
              this.renderTempChart();
            } 
            break;
          case 'liquid':
            if(this.liquidOption !== '') { 
              this.renderLiquidChart(); 
            } 
            break;
        }
      },
      renderLiquidChart() {
        if(echarts.getInstanceByDom(this.$refs.liquidChart)){
          echarts.getInstanceByDom(this.$refs.liquidChart).dispose();
        }
          this.liquidOption.xAxis.data = this.liquidX;
          this.liquidOption.series.data = this.liquidY[0];
          const liquidChart = echarts.init(this.$refs.liquidChart);
          const liquidChartOptions = this.liquidOption;
          liquidChart.setOption(liquidChartOptions);
      },
      renderTempChart(){
        if(echarts.getInstanceByDom(this.$refs.tempChart)){
          echarts.getInstanceByDom(this.$refs.tempChart).dispose();
        }
          const TempX = [], TempY1 = [], TempY2 = [], TempY3 = [], TempY4 = [], TempY5 = [], TempY6 = [], TempY7 = [];
          for (let i = 0; i < this.tempY.length; i++) {
            TempX.push(this.tempX[i]);
            TempY1.push(this.tempY[i][0]);
            TempY2.push(this.tempY[i][1]);
            TempY3.push(this.tempY[i][2]);
            TempY4.push(this.tempY[i][3]);
            TempY5.push(this.tempY[i][4]);
            TempY6.push(this.tempY[i][5]);
            TempY7.push(this.tempY[i][6]);
          }
          this.tempOption.xAxis.data = TempX;
          const TempYArrays = [TempY1, TempY2, TempY3, TempY4, TempY5, TempY6, TempY7]
          for (let j = 0; j < TempYArrays.length; j++) {
            this.tempOption.series[j].data = TempYArrays[j];
          }
          const tempChart = echarts.init(this.$refs.tempChart);
          const tempChartOptions = this.tempOption;
          tempChart.setOption(tempChartOptions);
      },
      back(){
        this.stopMQTT();
        this.$router.push('/select');
      }
    },
  };
  </script>
  
  <style scoped>
  @import '../css/TestXML.css';
  </style>