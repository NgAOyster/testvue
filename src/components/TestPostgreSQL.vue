<template>
    <el-container>
        <el-aside :width="'200px'" :style="{ position: 'static', zIndex: 'auto',}">
            <el-menu
              class="el-menu-vertical-demo"
              background-color="#999999"
              text-color="#fff"
              active-text-color="#ffd04b"
              :style="{ minHeight: '100vh' }"
              @select="handleSubMenuSelect"
            >
            <el-menu-item index="0" class="logo" disabled><el-image :src="pic"></el-image></el-menu-item>
            <el-menu-item index="1">添加用户</el-menu-item>
            <el-menu-item index="2">更改用户密码</el-menu-item>
            <el-menu-item index="3">用户列表</el-menu-item>
            <el-sub-menu index="4">
              <template #title>指定搜寻</template>
              <el-menu-item index="4-1">公司编号</el-menu-item>
              <el-menu-item index="4-2">用户名</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="5" @click="returnFunc">返回</el-menu-item>
            </el-menu>
        </el-aside>
    
        <div class="content" v-if="selectedSubMenu === '1'">
            <h2>添加用户</h2>
            <div class="form-container">
                <el-form :model="newUser" @submit.prevent="addUser" class="centered-form" label-width="150px">
                  <el-form-item label="公司编号:" required>
                    <el-input v-model="newUser.cpid" required></el-input>
                  </el-form-item>
      
                  <el-form-item label="用户名:" required>
                    <el-input v-model="newUser.username" required></el-input>
                  </el-form-item>
      
                  <el-form-item label="密码:" required>
                    <el-input type="password" v-model="newUser.password" required></el-input>
                  </el-form-item>
      
                    <el-button type="primary" native-type="submit">添加</el-button>
                </el-form>
            </div>
        </div>
    
        <div class="content" v-if="selectedSubMenu === '2'">
            <h2>更改用户密码</h2>
            <div class="form-container">
                <el-form :model="changePassword" @submit.prevent="updatePassword" class="centered-form" label-width="150px">
                  <el-form-item label="公司编号:" required>
                    <el-input v-model="changePassword.cpid" required></el-input>
                  </el-form-item>
      
                  <el-form-item label="用户名:" required>
                    <el-input v-model="changePassword.username" required></el-input>
                  </el-form-item>
      
                  <el-form-item label="旧密码:" required>
                    <el-input type="password" v-model="changePassword.oldPassword" required></el-input>
                  </el-form-item>
      
                  <el-form-item label="新密码:" required>
                    <el-input type="password" v-model="changePassword.newPassword" required></el-input>
                  </el-form-item>
      
                    <el-button type="primary" native-type="submit">更新</el-button>
                </el-form>
              </div>
        </div>
        
        <div class="content" v-if="selectedSubMenu === '3'">
            <h2>用户列表</h2>
            <div class="postgres-table-container">
                <el-table :data="userList" style="width: 100%" :border="true">
                    <el-table-column prop="cpid" label="公司编号" sortable ></el-table-column>
                    <el-table-column prop="username" label="用户名" sortable ></el-table-column>
                    <el-table-column label="密码">
                    <template v-slot="{ row }">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span v-if="!row.showPassword">****</span>
                        <span v-else>{{ row.password }}</span>
                        <el-button @click="togglePassword(row)" plain>
                            <i :class="row.showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </el-button>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="{ row }">
                            <el-button @click="deleteMenu(row.cpid, row.username)" type="danger">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="content" v-if="selectedSubMenu === '4-1'">
          <h2>搜寻公司</h2>
          <div class="form-container">
            <el-form @submit.prevent="SearchCPID" class="centered-form" label-width="150px">
              <el-form-item label="公司编号:" required>
                <el-input v-model="cpidSearch" required></el-input>
              </el-form-item>
      
              <el-button type="primary" native-type="submit">搜寻</el-button>
            </el-form>
          </div>
          <br>
          <div v-if="resultListCPID.length > 0">
            <h2>搜寻结果</h2>
            <div class="postgres-table-container">
                  <el-table :data="resultListCPID" style="width: 50%" :border="true">
                      <el-table-column prop="cpid" label="公司编号" sortable align="center" header-align="center"></el-table-column>
                      <el-table-column prop="username" label="用户名" sortable align="center" header-align="center"></el-table-column>
                  </el-table>
              </div>
          </div>
        </div>

        <div class="content" v-if="selectedSubMenu === '4-2'">
          <h2>搜寻用户</h2>
          <div class="form-container">
            <el-form @submit.prevent="SearchUsername" class="centered-form" label-width="150px">
              <el-form-item label="用户名:" required>
                <el-input v-model="usernameSearch" required></el-input>
              </el-form-item>
      
              <el-button type="primary" native-type="submit">搜寻</el-button>
            </el-form>
          </div>
          <br>
          <div v-if="resultListUsername.length > 0">
            <h2>搜寻结果</h2>
              <div class="postgres-table-container">
                  <el-table :data="resultListUsername" style="width: 50%" :border="true">
                      <el-table-column prop="cpid" label="公司编号" sortable align="center" header-align="center"></el-table-column>
                      <el-table-column prop="username" label="用户名" sortable align="center" header-align="center"></el-table-column>
                  </el-table>
              </div>
          </div>
        </div>
    </el-container>
    </template>
      
      <script>
      import axios from 'axios';
      
      export default {
        name: 'Test_Page_PostgreSQL',
        data() {
          return {
            pic: require('@/assets/postgresql.png'),
            selectedSubMenu: null,
            userList: [],
            newUser: {
              cpid: '',
              username: '',
              password: ''
            },
            changePassword: {
              cpid: '',
              username: '',
              oldPassword: '',
              newPassword: ''
            },
            cpidSearch: '',
            resultListCPID: [],
            usernameSearch: '',
            resultListUsername: [],
          };
        },
        mounted() {
          this.fetchUsers();
        },
        methods: {
          fetchUsers() {
            axios.get('http://localhost:5000/api2/users')
              .then(response => {
                this.userList = response.data;
              })
              .catch(error => {
                console.error('Error fetching users:', error);
              });
          },
          addUser() {
            const userExists = this.userList.some(
                user => user.cpid === this.newUser.cpid && user.username === this.newUser.username
            );
            if (userExists){
                this.$alert('该用户已经被使用！', '失败', {
                confirmButtonText: '确定',
                type: 'warning',
                showClose: false,
                })
                return;
            }
            const userData = {
              cpid: this.newUser.cpid,
              username: this.newUser.username,
              password: this.newUser.password
            };
      
            axios.post('http://localhost:5000/api2/users/add', userData, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(response => {
              console.log(response.data); // Handle success, such as showing a success message
              this.fetchUsers(); // Fetch updated user list after adding a user
              this.clearForm(); // Clear the form after successful addition
              this.$alert('添加用户成功！', '成功', {
                confirmButtonText: '确定',
                type: 'info',
                showClose: false,
                })
            })
            .catch(error => {
              console.error('Error adding user:', error);
            });
          },
          clearForm() {
            this.newUser.cpid = '';
            this.newUser.username = '';
            this.newUser.password = '';
          },
          updatePassword() {
            const updatedPasswordData = {
              cpid: this.changePassword.cpid,
              username: this.changePassword.username,
              oldPassword: this.changePassword.oldPassword,
              newPassword: this.changePassword.newPassword
            };
      
            axios.put('http://localhost:5000/api2/users/update/password', updatedPasswordData, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            .then(response => {
              console.log(response.data); // Handle success, such as showing a success message
              this.fetchUsers();
              this.clearUpdateForm();
              this.$alert('更新密码成功！', '成功', {
                confirmButtonText: '确定',
                type: 'info',
                showClose: false,
                })
            })
            .catch(error => {
              console.error('Error updating password:', error);
              this.$alert('更新密码失败！请确认信息是否正确', '失败', {
                confirmButtonText: '确定',
                type: 'warning',
                showClose: false,
                })
            });
          },
          clearUpdateForm() {
            this.changePassword.cpid = '';
            this.changePassword.username = '';
            this.changePassword.oldPassword = '';
            this.changePassword.newPassword = '';
          },
          togglePassword(row) {
            row.showPassword = !row.showPassword;
          },
          deleteMenu(cpid, username) {
            console.log("cpid: ", cpid);
            console.log("username: ", username);
            axios.delete(`http://localhost:5000/api2/users/delete`, {
                data: {
                    cpid: cpid,
                    username: username
                }
            })
            .then(response => {
                console.log(response.data); 
                this.fetchUsers();
                this.$alert('删除用户成功！', '成功', {
                    confirmButtonText: '确定',
                    type: 'info',
                    showClose: false,
                })
            })
            .catch(error => {
                console.error('Error delete user:', error);
            });
          },
          SearchCPID() {
            axios.get(`http://localhost:5000/api2/users/get/cpid?cpid=${this.cpidSearch}`, {
              headers: {
                'Content-Type': 'application/json'
              },
            })
            .then(response => {
              console.log(response.data); 
              this.cpidSearch = '';
              this.resultListCPID = response.data;
              this.$alert('搜寻公司编号成功！', '成功', {
                confirmButtonText: '确定',
                type: 'info',
                showClose: false,
                })
            })
            .catch(error => {
              console.error('Error search CPID:', error);
              this.$alert('搜寻失败，确保您输入正确的公司编号', '失败', {
                confirmButtonText: '确定',
                type: 'warning',
                showClose: false,
                })
            });
          },
          SearchUsername() {
            axios.get(`http://localhost:5000/api2/users/get/username?username=${this.usernameSearch}`, {
              headers: {
                'Content-Type': 'application/json'
              },
            })
            .then(response => {
              console.log(response.data); 
              this.usernameSearch = '';
              this.resultListUsername = response.data;
              this.$alert('搜寻用户成功！', '成功', {
                confirmButtonText: '确定',
                type: 'info',
                showClose: false,
                })
            })
            .catch(error => {
              console.error('Error search username:', error);
              this.$alert('搜寻失败，确保您输入正确的用户名', '失败', {
                confirmButtonText: '确定',
                type: 'warning',
                showClose: false,
                })
            });
          },
          handleSubMenuSelect(index) {
            this.selectedSubMenu = index;
            if (index === '3') { this.fetchUsers(); }
            if (this.resultListCPID.length > 0) { this.resultListCPID = []; }
            if (this.resultListUsername.length > 0) { this.resultListUsername = []; }
          },
          returnFunc(){
            this.$router.push({ name: 'select' });
          }
        }
      };
      </script>
      
      <style scoped>
      @import '../css/TestPostgreSQL.css';
      </style>