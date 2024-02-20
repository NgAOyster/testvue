<template>
    <div>
      <h2 class="select_title">测试数据库:</h2>
      <el-form :model="formData" label-width="0" class="button-container">
        <el-form-item>
          <el-button class="button_select" type="primary" size="large" @click="selectDatabase('firebase')">Firebase</el-button>
          <el-button class="button_select" type="primary" size="large" @click="selectDatabase('mysql')">MySQL</el-button>
          <el-button class="button_select" type="primary" size="large" @click="selectDatabase('postgresql')">PostgreSQL</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <h2 class="select_title">测试其他:</h2>
      <el-form :model="formData" label-width="0" class="button-container">
        <el-form-item>
          <el-button class="button_select" type="success" size="large" @click="selectOther('xml')">XML (固定)</el-button>
          <el-button class="button_select" type="success" size="large" @click="selectOther('xml2')">XML (实时更新)</el-button>
          <el-button class="button_select" type="warning" size="large" @click="selectOther('setting')">设定</el-button>
          <el-button class="button_select" type="info" size="large" @click="selectOther('checkout')">模拟结账</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Select_Test_Database',
    data() {
      return {
        formData: {
          selectedDatabase: '',
          other: '',
        }
      };
    },
    methods: {
      selectDatabase(database) {
        this.formData.selectedDatabase = database;
        this.navigateToPage();
      },
      selectOther(other) {
        this.formData.other = other;
        this.navigateToPage();
      },
      navigateToPage() {
        if (this.formData.selectedDatabase) {
          this.$router.push({ name: this.formData.selectedDatabase });
          this.formData.selectedDatabase = '';
        }
        if (this.formData.other) {
          this.$router.push({ name: this.formData.other });
          this.formData.other = '';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  @import '../css/Select.css';
  </style>
  
  
  