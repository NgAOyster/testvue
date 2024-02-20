<template>
    <el-container>
        <div class="content">
            <el-checkbox-group v-model="selectedOptions">
                <br />
                <el-checkbox 
                    label="数据系列堆叠" 
                    @change="handleStackChange"
                ></el-checkbox>
                <el-checkbox
                    label="集中显示数据"
                    :disabled="!selectedOptions.includes('数据系列堆叠')"
                ></el-checkbox>
                <el-checkbox
                    label="显示整体区块"
                    :disabled="!selectedOptions.includes('数据系列堆叠')"
                ></el-checkbox>
            </el-checkbox-group>
            <br>
            <div ref="lineChart" style="height: 600px; width: 95%;"></div>
        </div>
        <el-aside :width="'300px'" :style="{ position: 'static', zIndex: 'auto', right: '0', top: '0', minHeight: '100vh' }">
          <el-collapse :style="{ height: 'calc(100vh - 20px)', overflow: 'auto' }">
              <el-collapse-item title="样式设置" name="styleSettings">
                <br>
                <el-form :model="styleForm" label-width="120px">
                  <el-form-item label="折点类型">
                    <el-select v-model="styleForm.pointType" @change="updateChartStyle">
                      <el-option label="圆形" value="circle"></el-option>
                      <el-option label="矩形" value="rectangle"></el-option>
                      <el-option label="三角形" value="triangle"></el-option>
                      <el-option label="菱形" value="diamond"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="不透明度">
                    <el-slider v-model="styleForm.opacity" :min="0" :max="100" @change="updateChartStyle" style="padding-right: 10px;" ></el-slider>
                  </el-form-item>

                  <el-form-item label="线宽">
                    <el-input-number v-model="styleForm.lineWidth" :min="1" controls-position="right" @change="updateChartStyle"></el-input-number>
                  </el-form-item>

                  <el-form-item label="折点大小">
                    <el-input-number v-model="styleForm.pointSize" :min="1" controls-position="right" @change="updateChartStyle"></el-input-number>
                  </el-form-item>

                  <el-form-item label="平滑折线">
                    <el-checkbox v-model="styleForm.smoothLine" @change="updateChartStyle">是否平滑</el-checkbox>
                  </el-form-item>

                  <div class="seperator">
                    <span>内边距</span><hr>
                  </div>
                  <el-form-item label="上">
                    <el-input-number v-model="styleForm.grid.top" :min="0" controls-position="right" @change="updateChartStyle"></el-input-number>
                  </el-form-item>
                  <el-form-item label="下">
                    <el-input-number v-model="styleForm.grid.bottom" :min="0" controls-position="right" @change="updateChartStyle"></el-input-number>
                  </el-form-item>
                  <el-form-item label="左">
                    <el-input-number v-model="styleForm.grid.left" :min="0" controls-position="right" @change="updateChartStyle"></el-input-number>
                  </el-form-item>
                  <el-form-item label="右">
                    <el-input-number v-model="styleForm.grid.right" :min="0" controls-position="right" @change="updateChartStyle"></el-input-number>
                  </el-form-item>

                </el-form>
              </el-collapse-item>

              <el-collapse-item title="标题设置" name="titleSettings">
                <br>
                <el-form :model="titleForm" label-width="120px">
                  <el-form-item label="标题名">
                    <el-input v-model="titleForm.text" placeholder="请输入标题名" @change="updateChartTitle"></el-input>
                  </el-form-item>

                  <el-form-item label="文本颜色">
                    <el-color-picker v-model="titleForm.textColor" @change="updateChartTitle"></el-color-picker>
                  </el-form-item>

                  <el-form-item label="文本字号">
                    <el-input-number v-model="titleForm.textSize" :min="1" @change="updateChartTitle"></el-input-number>
                  </el-form-item>

                  <el-form-item label="斜体选择">
                    <el-switch v-model="titleForm.italic" @change="updateChartTitle"></el-switch>
                  </el-form-item>

                  <el-form-item label="粗体选择">
                    <el-switch v-model="titleForm.bold" @change="updateChartTitle"></el-switch>
                  </el-form-item>

                  <el-form-item label="文本位置">
                    <el-button-group>
                      <el-button :class="{ 'is-active': titleForm.textAlignment === 'left' }" @click="titleForm.textAlignment = 'left'; updateChartTitle();">
                        <i class="fa fa-align-left"></i>
                      </el-button>
                      <el-button :class="{ 'is-active': titleForm.textAlignment === 'center' }" @click="titleForm.textAlignment = 'center'; updateChartTitle();">
                        <i class="fa fa-align-center"></i>
                      </el-button>
                      <el-button :class="{ 'is-active': titleForm.textAlignment === 'right' }" @click="titleForm.textAlignment = 'right'; updateChartTitle();">
                        <i class="fa fa-align-right"></i>
                      </el-button>
                    </el-button-group>
                  </el-form-item>

                </el-form>
              </el-collapse-item>

              <el-collapse-item title="图例设置" name="legendSettings">
                <br>
                <el-form :model="legendForm" label-width="120px">
                  <el-form-item label="文本颜色">
                    <el-color-picker v-model="legendForm.textColor" @change="updateChartLegend"></el-color-picker>
                  </el-form-item>

                  <el-form-item label="文本字号">
                    <el-input-number v-model="legendForm.textSize" :min="1" @change="updateChartLegend"></el-input-number>
                  </el-form-item>

                  <el-form-item label="图例排列方向">
                    <el-button-group>
                      <el-button :class="{ 'is-active': legendForm.legendOrient === 'horizontal' }" @click="legendOrientChange('horizontal')"> 
                        <i class="fas fa-arrows-alt-h"></i> 
                      </el-button>
                      <el-button :class="{ 'is-active': legendForm.legendOrient === 'vertical' }" @click="legendOrientChange('vertical')">
                        <i class="fas fa-arrows-alt-v"></i> 
                      </el-button>
                    </el-button-group>
                  </el-form-item>

                  <el-form-item label="图例水平位置">
                    <el-button-group>
                      <el-button :class="{ 'is-active': legendForm.legendPositionHor === 'left' }" @click="legendForm.legendPositionHor = 'left'; updateChartLegend();">
                        <i class="fa fa-align-left"></i>
                      </el-button>
                      <el-button :class="{ 'is-active': legendForm.legendPositionHor === 'center' }" @click="legendForm.legendPositionHor = 'center'; updateChartLegend();" :disabled="legendForm.legendOrient === 'vertical'">
                        <i class="fa fa-align-center"></i>
                      </el-button>
                      <el-button :class="{ 'is-active': legendForm.legendPositionHor === 'right' }" @click="legendForm.legendPositionHor = 'right'; updateChartLegend();">
                        <i class="fa fa-align-right"></i>
                      </el-button>
                    </el-button-group>
                  </el-form-item>

                  <el-form-item label="图例垂直位置">
                    <el-button-group>
                      <el-button :class="{ 'is-active': legendForm.legendPositionVer === 'top' }" @click="legendForm.legendPositionVer = 'top'; updateChartLegend();">
                        <i class="fas fa-arrow-up"></i>
                      </el-button>
                      <el-button :class="{ 'is-active': legendForm.legendPositionVer === 'middle' }" @click="legendForm.legendPositionVer = 'middle'; updateChartLegend();" :disabled="legendForm.legendOrient === 'horizontal'">
                        <i class="fas fa-arrows-alt-v"></i>
                      </el-button>
                      <el-button :class="{ 'is-active': legendForm.legendPositionVer === 'bottom' }" @click="legendForm.legendPositionVer = 'bottom'; updateChartLegend();">
                        <i class="fas fa-arrow-down"></i>
                      </el-button>
                    </el-button-group>
                  </el-form-item>

                </el-form>
              </el-collapse-item>

              <el-collapse-item title="标签设置" name="labelSettings"> 
                <br>
                <el-form :model="labelForm" label-width="120px"> 
                  <el-form-item label="文本颜色">
                    <el-color-picker v-model="labelForm.textColor" @change="updateChartLabel"></el-color-picker>
                  </el-form-item>

                  <el-form-item label="文本字号">
                    <el-input-number v-model="labelForm.textSize" :min="1" @change="updateChartLabel"></el-input-number>
                  </el-form-item>

                  <el-form-item label="单位后缀">
                    <el-input v-model="labelForm.formatter" @change="updateChartLabel"></el-input>
                  </el-form-item>

                </el-form>
              </el-collapse-item>

              <el-collapse-item title="提示设置" name="tooltipSettings"> 
                <br>
                <el-form :model="tooltipForm" label-width="120px"> 
                  <el-form-item label="背景颜色">
                    <el-color-picker v-model="tooltipForm.backgroundColor" @change="updateChartTooltip"></el-color-picker>
                  </el-form-item>
                  
                  <el-form-item label="文本颜色">
                    <el-color-picker v-model="tooltipForm.textColor" @change="updateChartTooltip"></el-color-picker>
                  </el-form-item>

                  <el-form-item label="文本字号">
                    <el-input-number v-model="tooltipForm.textSize" :min="1" @change="updateChartTooltip"></el-input-number>
                  </el-form-item>

                </el-form>
              </el-collapse-item>
              
              <el-collapse-item title="横轴设置" name="xAxisSettings"> 
                <br>
                  <el-form :model="xAxisConfig" label-width="120px">
                    <!-- 横轴位置 -->
                    <el-form-item label="横轴位置">
                      <el-button-group>
                        <el-button :class="{ 'is-active': xAxisConfig.position === 'top' }" @click="xAxisConfig.position = 'top'; updateChartxAxis();">
                          <i class="fas fa-arrow-up"></i>
                        </el-button>
                        <el-button :class="{ 'is-active': xAxisConfig.position === 'bottom' }" @click="xAxisConfig.position = 'bottom'; updateChartxAxis();">
                          <i class="fas fa-arrow-down"></i>
                        </el-button>
                      </el-button-group>
                    </el-form-item>

                    <div class="seperator">
                      <span>名称</span><hr>
                    </div>
                    
                    <!-- 横轴名称 -->
                    <el-form-item label="横轴名称">
                      <el-input v-model="xAxisConfig.name" @change="updateChartxAxis"></el-input>
                    </el-form-item>

                    <!-- 横轴名称样式 -->
                    <el-form-item label="名称文本颜色">
                      <el-color-picker v-model="xAxisConfig.nameTextStyle.color" @change="updateChartxAxis"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="名称文本字号">
                      <el-input-number v-model="xAxisConfig.nameTextStyle.fontSize" @change="updateChartxAxis"></el-input-number>
                    </el-form-item>

                    <el-form-item label="横轴名称位置">
                      <el-button-group>
                        <el-button :class="{ 'is-active': xAxisConfig.nameLocation === 'start' }" @click="xAxisConfig.nameLocation = 'start'; updateChartxAxis();">
                          <i class="fas fa-arrow-left"></i>
                        </el-button>
                        <el-button :class="{ 'is-active': xAxisConfig.nameLocation === 'middle' }" @click="xAxisConfig.nameLocation = 'middle'; updateChartxAxis();">
                          <i class="fas fa-arrows-alt-h"></i>
                        </el-button>
                        <el-button :class="{ 'is-active': xAxisConfig.nameLocation === 'end' }" @click="xAxisConfig.nameLocation = 'end'; updateChartxAxis();">
                          <i class="fas fa-arrow-right"></i>
                        </el-button>
                      </el-button-group>
                    </el-form-item>

                    <el-form-item label="名称与轴线间隔">
                      <el-input-number v-model="xAxisConfig.nameGap" @change="updateChartxAxis"></el-input-number>
                    </el-form-item>

                    <div class="seperator">
                      <span>刻度线与标签</span><hr>
                    </div>

                    <!-- 刻度线 -->
                    <el-form-item label="显示刻度线">
                      <el-checkbox v-model="xAxisConfig.axisTick.show" @change="updateChartxAxis"></el-checkbox>
                    </el-form-item>

                    <!-- 标签 -->
                    <el-form-item label="显示标签">
                      <el-checkbox v-model="xAxisConfig.axisLabel.show" @change="updateChartxAxis"></el-checkbox>
                    </el-form-item>
                    <!-- 如果显示标签，则允许调整以下选项 -->
                    <el-form-item label="标签文本颜色">
                      <el-color-picker v-model="xAxisConfig.axisLabel.textStyle.color" @change="updateChartxAxis" :disabled="!xAxisConfig.axisLabel.show"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="标签文本字号">
                      <el-input-number v-model="xAxisConfig.axisLabel.textStyle.fontSize" @change="updateChartxAxis" :disabled="!xAxisConfig.axisLabel.show"></el-input-number>
                    </el-form-item>
                    <el-form-item label="标签的旋转角度">
                      <el-input-number v-model="xAxisConfig.axisLabel.rotate" @change="updateChartxAxis" :disabled="!xAxisConfig.axisLabel.show"></el-input-number>
                    </el-form-item>

                    <div class="seperator">
                      <span>轴线与网格线</span><hr>
                    </div>

                    <!-- 轴线 -->
                    <el-form-item label="显示轴线">
                      <el-checkbox v-model="xAxisConfig.axisLine.show" @change="updateChartxAxis"></el-checkbox>
                    </el-form-item>

                    <!-- 网格线 -->
                    <el-form-item label="显示网格线">
                      <el-checkbox v-model="xAxisConfig.splitLine.show" @change="updateChartxAxis"></el-checkbox>
                    </el-form-item>
                    <!-- 如果显示网格线，则允许调整以下选项 -->
                    <el-form-item label="网格线颜色">
                      <el-color-picker v-model="xAxisConfig.splitLine.lineStyle.color" @change="updateChartxAxis" :disabled="!xAxisConfig.splitLine.show"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="网格线宽度">
                      <el-input-number  v-model="xAxisConfig.splitLine.lineStyle.width" @change="updateChartxAxis" :disabled="!xAxisConfig.splitLine.show"></el-input-number>
                    </el-form-item>

                </el-form>
              </el-collapse-item>

              <el-collapse-item title="纵轴设置" name="yAxisSettings">
                <br>
                  <el-form :model="yAxisConfig" label-width="120px">
                    <!-- 纵轴位置 -->
                    <el-form-item label="纵轴位置">
                      <el-button-group>
                        <el-button :class="{ 'is-active': yAxisConfig.position === 'left' }" @click="yAxisConfig.position = 'left'; updateChartyAxis();">
                          <i class="fas fa-arrow-left"></i>
                        </el-button>
                        <el-button :class="{ 'is-active': yAxisConfig.position === 'right' }" @click="yAxisConfig.position = 'right'; updateChartyAxis();">
                          <i class="fas fa-arrow-right"></i>
                        </el-button>
                      </el-button-group>
                    </el-form-item>

                    <div class="seperator">
                      <span>名称</span><hr>
                    </div>

                    <!-- 纵轴名称 -->
                    <el-form-item label="纵轴名称">
                      <el-input v-model="yAxisConfig.name" @change="updateChartyAxis"></el-input>
                    </el-form-item>

                    <!-- 纵轴名称样式 -->
                    <el-form-item label="名称文本颜色">
                      <el-color-picker v-model="yAxisConfig.nameTextStyle.color" @change="updateChartyAxis"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="名称文本字号">
                      <el-input-number v-model="yAxisConfig.nameTextStyle.fontSize" @change="updateChartyAxis"></el-input-number>
                    </el-form-item>

                    <el-form-item label="纵轴名称位置">
                      <el-button-group>
                        <el-button :class="{ 'is-active': yAxisConfig.nameLocation === 'start' }" @click="yAxisConfig.nameLocation = 'start'; updateChartyAxis();">
                          <i class="fas fa-arrow-down"></i>
                        </el-button>
                        <el-button :class="{ 'is-active': yAxisConfig.nameLocation === 'middle' }" @click="yAxisConfig.nameLocation = 'middle'; updateChartyAxis();">
                          <i class="fas fa-arrows-alt-v"></i>
                        </el-button>
                        <el-button :class="{ 'is-active': yAxisConfig.nameLocation === 'end' }" @click="yAxisConfig.nameLocation = 'end'; updateChartyAxis();">
                          <i class="fas fa-arrow-up"></i>
                        </el-button>
                      </el-button-group>
                    </el-form-item>

                    <el-form-item label="名称与轴线间隔">
                      <el-input-number v-model="yAxisConfig.nameGap" @change="updateChartyAxis"></el-input-number>
                    </el-form-item>
                    
                    <div class="seperator">
                      <span>刻度线与标签</span><hr>
                    </div>

                    <!-- 刻度线 -->
                    <el-form-item label="显示刻度线">
                      <el-checkbox v-model="yAxisConfig.axisTick.show" @change="updateChartyAxis"></el-checkbox>
                    </el-form-item>

                    <!-- 标签 -->
                    <el-form-item label="显示标签">
                      <el-checkbox v-model="yAxisConfig.axisLabel.show" @change="updateChartyAxis"></el-checkbox>
                    </el-form-item>
                    <!-- 如果显示标签，则允许调整以下选项 -->
                    <el-form-item label="标签文本颜色">
                      <el-color-picker v-model="yAxisConfig.axisLabel.textStyle.color" @change="updateChartyAxis" :disabled="!yAxisConfig.axisLabel.show"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="标签文本字号">
                      <el-input-number v-model="yAxisConfig.axisLabel.textStyle.fontSize" @change="updateChartyAxis" :disabled="!yAxisConfig.axisLabel.show"></el-input-number>
                    </el-form-item>
                    <el-form-item label="标签的旋转角度">
                      <el-input-number v-model="yAxisConfig.axisLabel.rotate" @change="updateChartyAxis" :disabled="!yAxisConfig.axisLabel.show"></el-input-number>
                    </el-form-item>
                    <el-form-item label="标签单位后缀">
                      <el-input v-model="yAxisConfig.axisLabel.formatter" @change="updateChartyAxis" :disabled="!yAxisConfig.axisLabel.show"></el-input>
                    </el-form-item>

                    <div class="seperator">
                      <span>轴线与网格线</span><hr>
                    </div>

                    <!-- 轴线 -->
                    <el-form-item label="显示轴线">
                      <el-checkbox v-model="yAxisConfig.axisLine.show" @change="updateChartyAxis"></el-checkbox>
                    </el-form-item>

                    <!-- 网格线 -->
                    <el-form-item label="显示网格线">
                      <el-checkbox v-model="yAxisConfig.splitLine.show" @change="updateChartyAxis"></el-checkbox>
                    </el-form-item>
                    <!-- 如果显示网格线，则允许调整以下选项 -->
                    <el-form-item label="网格线颜色">
                      <el-color-picker v-model="yAxisConfig.splitLine.lineStyle.color" @change="updateChartyAxis" :disabled="!yAxisConfig.splitLine.show"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="网格线宽度">
                      <el-input-number  v-model="yAxisConfig.splitLine.lineStyle.width" @change="updateChartyAxis" :disabled="!yAxisConfig.splitLine.show"></el-input-number>
                    </el-form-item>

                  </el-form>
              </el-collapse-item>

              <el-collapse-item title="高级设置" name="specialSettings">
                <br>
                <el-form label-width="120px">
                  <el-form-item label="保存图片">
                    <el-checkbox v-model="savePicture" @change="handleSavePicture"></el-checkbox>
                  </el-form-item>

                  <el-form-item label="显示轴值">
                    <el-checkbox v-model="showAxis" @change="handleDisplayAxis"></el-checkbox>
                  </el-form-item>

                  <el-form-item label="空值处理">
                      <el-radio-group v-model="nullHandle">
                        <el-radio label="remain">保持为空</el-radio>
                        <el-radio label="setZero">置为0</el-radio>
                        <el-radio label="hide">隐藏空值</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  
                  <el-form-item label="缩略轴范围">
                    <el-slider
                      v-model="valueRange"
                      :min="0"
                      :max="100"
                      range
                      :show-tooltip="true"
                      @change="handleSliderChange(valueRange)"
                      style="padding-right: 10px;"
                    ></el-slider>
                    <p>初始：{{ valueRange[0] }} <br> 结束：{{ valueRange[1] }}</p>
                  </el-form-item>
                </el-form>
              </el-collapse-item>

              <el-button class="button_select" type="info" size="large" @click="saveOptiontoXML">保存</el-button>
          </el-collapse>
        </el-aside>
        </el-container>
</template>

<script>
  import axios from 'axios';
  import * as echarts from 'echarts';
  
  export default {
    name: 'Setting_feature',
    data() {
      return {
        username: 'KwanHou',
        selectedSubMenu: '3',
        lineChartOption: null,
        //selectedOptions: ['保存图片功能', '显示XY轴数值', '缩略轴', '数据系列堆叠', '集中显示数据', '显示整体区块', '显示数据' ],
        selectedOptions: ['保存图片功能', '显示XY轴数值'],
        valueRange: [0,10],
        savePicture: false,
        showAxis: false,
        nullHandle: 'remain',
        styleForm: {
          pointType: 'circle', 
          opacity: 100,
          lineWidth: 1,
          pointSize: 3,
          smoothLine: true,
          grid: {
            top: 30,
            left: 5,
            right: 5,
            bottom: 5,
          },
        },
        titleForm: {
          text: '', 
          textColor: '#000000', 
          textSize: 20, 
          italic: false, 
          bold: true, 
          textAlignment: 'left' 
        },
        legendForm: {
          textColor: '#000000',
          textSize: 10,
          legendOrient: 'horizontal',
          legendPositionHor: 'center',
          legendPositionVer: 'top',
        },
        labelForm: {
          textColor: '#000000',
          textSize: 10,
          formatter: '',
        },
        tooltipForm: {
          backgroundColor: '#ffffff',
          textColor: '#000000', 
          textSize: 12, 
        },
        xAxisConfig: {
          position: 'bottom',
          name: '',
          nameTextStyle: {
            color: '#000000',
            fontSize: 12,
          },
          nameLocation: 'middle',
          nameGap: 25,
          axisTick: {
            show: true,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#000000',
              fontSize: 12,
            },
            rotate: 0,
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#E3E3E3',
              width: 1,
            },
          },
        },
        yAxisConfig: {
          position: 'left',
          name: '',
          nameTextStyle: {
            color: '#000000',
            fontSize: 12,
          },
          nameLocation: 'middle',
          nameGap: 25,
          axisTick: {
            show: true,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#000000',
              fontSize: 12,
            },
            rotate: 0,
            formatter:'',
          },
          axisLine: {
            show: true,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#E3E3E3',
              width: 1,
            },
          },

        },
      };
    },
    mounted(){
      this.getLineOption();
    },
    watch: {
      selectedOptions: {
        handler() {
            this.getLineOption();
        },
        deep: true,
      },
    },
    methods: {
      handleSubMenuSelect(index) {
        this.selectedSubMenu = index;
        switch (index) {
            case '3': this.getLineOption(); break;
        }
      },
      handleStackChange(checkedOption) {
        if (checkedOption && !this.selectedOptions.includes('数据系列堆叠')) {
            this.selectedOptions.push('数据系列堆叠');
        } else if (!checkedOption) {
            const index = this.selectedOptions.indexOf('数据系列堆叠');
            if (index > -1) {
                this.selectedOptions.splice(index, 1);
            }
            // Disable related options if 数据系列堆叠 is not selected
            this.disableRelatedOptions();
        }
      },
      disableRelatedOptions() {
        const relatedOptions = [
            '集中显示数据',
            '显示整体区块',
            '显示数据'
        ];

        for (const option of relatedOptions) {
            const index = this.selectedOptions.indexOf('数据系列堆叠');
            if (index === -1) {
                const disabledIndex = this.selectedOptions.indexOf(option);
                if (disabledIndex > -1) {
                    this.selectedOptions.splice(disabledIndex, 1);
                }
            }
        }
      },
      handleSavePicture(){
        this.lineChartOption.toolbox = this.savePicture ? { feature: { saveAsImage: {} } } : null;
        this.initializeLineCharts();
      },
      handleDisplayAxis(){
        this.lineChartOption.tooltip.axisPointer = this.showAxis ? { type: 'cross', label: { backgroundColor: '#6a7985' } } : null;
        this.initializeLineCharts();
      },
      handleSliderChange(range) {
        this.lineChartOption.dataZoom = [
          { type: 'inside', 
            start: range[0], 
            end: range[1] 
          }, 
          { 
            start: range[0], 
            end: range[1] 
          }
        ];
        echarts.getInstanceByDom(this.$refs.lineChart).setOption(this.lineChartOption);
      },
      updateChartStyle(){
        this.lineChartOption.grid = {
          left: this.styleForm.grid.left + '%',
          right: this.styleForm.grid.right + '%',
          top: this.styleForm.grid.top + '%',
          bottom: this.styleForm.grid.bottom + '%',
          containLabel: true,
        };
        for (let j = 0; j < this.lineChartOption.series.length; j++) {
          this.lineChartOption.series[j].symbol = this.styleForm.pointType;
          this.lineChartOption.series[j].lineStyle = { opacity: this.styleForm.opacity, width: this.styleForm.lineWidth, };
          this.lineChartOption.series[j].symbolSize = this.styleForm.pointSize;
          this.lineChartOption.series[j].smooth = this.styleForm.smoothLine;          
        }
        echarts.getInstanceByDom(this.$refs.lineChart).setOption(this.lineChartOption);
      },
      updateChartTitle(){
        this.lineChartOption.title = {
          text: this.titleForm.text,
          textStyle: {
            color: this.titleForm.textColor,
            fontSize: this.titleForm.textSize,
          },
          left: this.titleForm.textAlignment,
        }
        this.lineChartOption.title.textStyle.fontStyle = this.titleForm.italic ? 'italic' : 'normal';
        this.lineChartOption.title.textStyle.fontWeight = this.titleForm.bold ? 'bold' : 'normal';
        echarts.getInstanceByDom(this.$refs.lineChart).setOption(this.lineChartOption);
      },
      legendOrientChange(orient){
        this.legendForm.legendOrient = orient;
        this.updateChartLegend();
        this.legendForm.legendPositionHor = 'left';
        this.legendForm.legendPositionVer = 'top';
      },
      updateChartLegend(){
        this.lineChartOption.legend.textStyle = {
          color: this.legendForm.textColor,
          fontSize: this.legendForm.textSize,
        }
        this.lineChartOption.legend.orient = this.legendForm.legendOrient;
        this.lineChartOption.legend.left = this.legendForm.legendPositionHor;
        this.lineChartOption.legend.top = this.legendForm.legendPositionVer;
        console.log("New Line Chart Option (Legend)", this.lineChartOption );
        echarts.getInstanceByDom(this.$refs.lineChart).setOption(this.lineChartOption);
      },
      updateChartLabel(){
        for (let j = 0; j < this.lineChartOption.series.length; j++) {
          this.lineChartOption.series[j].label = {
            show: true,
            color: this.labelForm.textColor,
            fontSize: this.labelForm.textSize,
            formatter: '{c}'+this.labelForm.formatter,
          }
        }
        console.log("New Line Chart Option (Label)", this.lineChartOption );
        echarts.getInstanceByDom(this.$refs.lineChart).setOption(this.lineChartOption);
      },
      updateChartTooltip(){
        this.lineChartOption.tooltip.backgroundColor = this.tooltipForm.backgroundColor;
        this.lineChartOption.tooltip.textStyle = {
          color: this.tooltipForm.textColor,
          fontSize: this.tooltipForm.textSize,
        }
        console.log("New Line Chart Option (Tooltip)", this.lineChartOption );
        echarts.getInstanceByDom(this.$refs.lineChart).setOption(this.lineChartOption);
      },
      updateChartxAxis(){
        const config = this.xAxisConfig; 
        this.lineChartOption.xAxis.position = config.position;
        this.lineChartOption.xAxis.name = config.name;
        if (config.name !== ''){
          this.lineChartOption.xAxis.nameTextStyle = {
            color: config.nameTextStyle.color,
            fontSize: config.nameTextStyle.fontSize,
          }
          this.lineChartOption.xAxis.nameLocation = config.nameLocation;
          this.lineChartOption.xAxis.nameGap = config.nameGap;
        }
        this.lineChartOption.xAxis.axisTick = { show: config.axisTick.show, alignWithLabel: true, };
        if (config.axisLabel.show === true){
          this.lineChartOption.xAxis.axisLabel = {
            show: true,
            color: config.axisLabel.textStyle.color,
            fontSize: config.axisLabel.textStyle.fontSize,
            rotate: config.axisLabel.rotate,
          }
        } else { this.lineChartOption.xAxis.axisLabel = { show: false } }
        this.lineChartOption.xAxis.axisLine = { show: config.axisLine.show };
        if (config.splitLine.show === true){
          this.lineChartOption.xAxis.splitLine = {
            show: true,
            lineStyle: {
              color: config.splitLine.lineStyle.color,
              width: config.splitLine.lineStyle.width,
            },
          }
        } else { this.lineChartOption.xAxis.splitLine = { show: false } }

        console.log("New Line Chart Option (xAxis)", this.lineChartOption );
        echarts.getInstanceByDom(this.$refs.lineChart).setOption(this.lineChartOption);
      },
      updateChartyAxis(){
        const config = this.yAxisConfig; 
        this.lineChartOption.yAxis.position = config.position;
        this.lineChartOption.yAxis.name = config.name;
        if (config.name !== ''){
          this.lineChartOption.yAxis.nameTextStyle = {
            color: config.nameTextStyle.color,
            fontSize: config.nameTextStyle.fontSize,
          }
          this.lineChartOption.yAxis.nameLocation = config.nameLocation;
          this.lineChartOption.yAxis.nameGap = config.nameGap;
        }
        this.lineChartOption.yAxis.axisTick = { show: config.axisTick.show };
        if (config.axisLabel.show === true){
          this.lineChartOption.yAxis.axisLabel = {
            show: true,
            color: config.axisLabel.textStyle.color,
            fontSize: config.axisLabel.textStyle.fontSize,
            rotate: config.axisLabel.rotate,
            formatter: '{value}' + config.axisLabel.formatter,
          }
        } else { this.lineChartOption.yAxis.axisLabel = { show: false } }
        this.lineChartOption.yAxis.axisLine = { show: config.axisLine.show };
        if (config.splitLine.show === true){
          this.lineChartOption.yAxis.splitLine = {
            show: true,
            lineStyle: {
              color: config.splitLine.lineStyle.color,
              width: config.splitLine.lineStyle.width,
            },
          }
        } else { this.lineChartOption.yAxis.splitLine = { show: false } }

        console.log("New Line Chart Option (yAxis)", this.lineChartOption );
        echarts.getInstanceByDom(this.$refs.lineChart).setOption(this.lineChartOption);
      },
      getLineOption(){
        axios.get('http://localhost:5000/getDataFromXml/linechart')
            .then(response => {
                const parser = require('xml2js').Parser({ explicitArray: false });
                parser.parseString(response.data, (err, result) => {
                if (err) {
                    console.error('Error parsing XML:', err);
                    return;
                }
                this.lineChartOption = result.root.Option;
                console.log('Line Chart Option (parsed):', this.lineChartOption);
                this.initializeLineCharts();
                });
            })
            .catch(error => {
                console.error('Error fetching XML data:', error);
            });
      },
      initializeLineCharts(){
        const lineChartElement = this.$refs.lineChart;
        if (lineChartElement) {
            let lineChart = echarts.getInstanceByDom(lineChartElement); 
            if (lineChart) {
                lineChart.dispose();
                lineChart = null;
            }
            lineChart = echarts.init(lineChartElement);
            for(let i = 0; i< this.selectedOptions.length; i++){
                switch(this.selectedOptions[i]){
                    case '数据系列堆叠': for (let j = 0; j < this.lineChartOption.series.length; j++) { this.lineChartOption.series[j].stack = 'Total'; } break;
                    case '显示整体区块': for (let j = 0; j < this.lineChartOption.series.length; j++) { this.lineChartOption.series[j].areaStyle = {}; } break;
                    case '集中显示数据': for (let j = 0; j < this.lineChartOption.series.length; j++) { this.lineChartOption.series[j].emphasis = { focus: 'series' }; } break;
                }
            }
            const lineChartOptions = this.lineChartOption;
            lineChart.setOption(lineChartOptions);
        }
      },
      saveOptiontoXML(){
        const ChartOption = this.lineChartOption;
        const username = this.username;
        const combined = { ChartOption, username };
        axios.post('http://localhost:5000/saveToXml/user', combined)
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
      returnFunc(){
        this.$router.push({ name: 'select' });
      }
    }
  };
  </script>

  <style>
  /* Add this CSS to your styles */
  .el-collapse::-webkit-scrollbar {
    width: 2px; /* Set the width of the scrollbar */
  }

  .el-collapse::-webkit-scrollbar-thumb {
    background-color: #888; /* Set the color of the scrollbar thumb */
  }

  .el-collapse::-webkit-scrollbar-track {
    background-color: #f1f1f1; /* Set the color of the scrollbar track */
  }

  .seperator {
    margin: 10px 10px 10px 0;
    text-align: left;
  }
  </style>