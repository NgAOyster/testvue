<template>
  <el-container>
      <el-aside :width="'200px'" :style="{ position: 'static', zIndex: 'auto',}">
        <el-menu
          :uniqueOpened="true"
          class="el-menu-vertical-demo"
          background-color="#999999"
          text-color="#fff"
          active-text-color="#ffd04b"
          :style="{ minHeight: '100vh' }"
          @select="handleSubMenuSelect"
        >
        <el-menu-item index="0" class="logo" disabled><el-image :src="pic"></el-image></el-menu-item>
        <el-menu-item index="1">管理用户</el-menu-item>
        <el-menu-item index="2">管理菜单</el-menu-item>
        <el-menu-item index="3" @click="returnFunc">返回</el-menu-item>
        </el-menu>
    </el-aside>
    
    <div class="content" v-if="selectedSubMenu === '1'">
      <h2>管理用户</h2><br>
      <form @submit.prevent="addUser" style=" text-align: center;">
        <input type="text" v-model="user.cpid" placeholder="Company ID" class="form-input">
        <input type="text" v-model="user.username" placeholder="Username" class="form-input">
        <input type="password" v-model="user.password" placeholder="Password" class="form-input">
        <button type="submit" class="form-button">Add</button>
      </form>
      <br>
      <div class="table-container">
        <table>
        <thead>
            <tr>
            <th>CPID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(user, index) in users" :key="index">
            <td>{{ user.cpid }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.password }}</td>
            <td>
                <button @click="deleteUser(user.cpid, user.username)" class="deleteButton">Delete</button>
            </td>
            </tr>
        </tbody>
        </table>
      </div>
    </div>
    <div class="content" v-if="selectedSubMenu === '2'">
      <h2>管理菜单</h2><br>
      <form @submit.prevent="addMenu" style=" text-align: center;">
        <input type="text" v-model="menu.item" placeholder="Item" class="form-input">
        <input type="text" v-model="menu.price" placeholder="Price" class="form-input">
        <label for="available" class="form-label">Available:</label>
        <select v-model="menu.available" placeholder="Available" class="form-input">
          <option value="Yes" selected>Yes</option>
          <option value="No">No</option>
        </select>
        <button type="submit" class="form-button">Add</button>
      </form>
      <br>
      <div class="table-container">
        <table>
        <thead>
            <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Available</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(menu, index) in menus" :key="index">
            <td>{{ menu.item }}</td>
            <td>RM {{ menu.price }}</td>
            <td>{{ menu.available }}</td>
            <td>
              <button @click="updateAvailable(menu)" class="changeButton">更改</button>&nbsp;
              <button @click="deleteMenu(menu.item)" class="deleteButton">删除</button>
            </td>
            </tr>
        </tbody>
        </table>
      </div>
    </div>
  </el-container>
  </template>
  
  <script>
  import { db } from '@/firebase'
  import { collection, onSnapshot, query, orderBy, where, addDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore'
  
  export default {
    name: "Test_Page_Firebase",
    data() {
      return {
        pic: require('@/assets/Firebase.png'),
        user: {
          cpid: '',
          username: '',
          password: '',
        },
        users: [],
        menu: {
          item: '',
          price: null,
          available: 'Yes',
        },
        menus: [],
        selectedSubMenu: null,
      };
    },
    mounted() {
      this.userDatabase();
      this.menuDatabase();
    },
    methods: {
      async userDatabase(){
        const userCollection = collection(db, 'user');
          const q = query(userCollection, orderBy('cpid'));

          try {
            const initialSnapshot = await getDocs(q);
            if (initialSnapshot.size === 0) {
              // If collection is empty, add a placeholder
              await addDoc(userCollection, { placeholder: true });
              console.log('Placeholder added to an empty user table.');
            }
          } catch (error) {
            console.error('Error fetching initial snapshot:', error);
          }

          onSnapshot(q,(querySnapshot) => {
            const Alluser = []
            querySnapshot.forEach((doc)=>{
              const user = {
                cpid: doc.data().cpid,
                username: doc.data().username,
                password: doc.data().password,
              }
              Alluser.push(user)
            })
            this.users = Alluser
          })
      },
      async menuDatabase(){
        const menuCollection = collection(db, 'menu');
          const q = query(menuCollection, orderBy('item'));
          
          try {
            const initialSnapshot = await getDocs(q);
            if (initialSnapshot.size === 0) {
              // If collection is empty, add a placeholder
              await addDoc(menuCollection, { placeholder: true });
              console.log('Placeholder added to an empty menu table.');
            }
          } catch (error) {
            console.error('Error fetching initial snapshot:', error);
          }

          onSnapshot(q,(querySnapshot) => {
            const Allmenu = [];
            let avail = null;
            querySnapshot.forEach((doc)=>{
              if(doc.data().available === true){
                avail = 'Yes';
              } else if (doc.data().available === false) { 
                avail = 'No'; 
              }
              const menu = {
                item: doc.data().item,
                price: doc.data().price,
                available: avail,
              }
              Allmenu.push(menu)
            })
            this.menus = Allmenu
          })
      },
      handleSubMenuSelect(index) {
        this.selectedSubMenu = index;
      },
      async addUser() {
        const userExists = this.users.some(
            user => user.cpid === this.user.cpid && user.username === this.user.username
        );
        if(this.user.cpid === '' || this.user.username === '' || this.user.password === ''){
          alert('请填写全部资料');
          return;
        } else if (userExists){
          alert('该用户已使用');
          return;
        }
        const userCollection = collection(db, 'user');
        const userCheck = await getDocs(userCollection);
        if (userCheck.empty){
          try {
            await addDoc(userCollection, { placeholder: true });
            console.log('Empty collection "user" created successfully.');
          } catch (error) {
            console.error('Error creating empty collection:', error);
          }
        }

        await addDoc(collection( db, "user"),{
          cpid: this.user.cpid,
          username: this.user.username,
          password: this.user.password,
        })
        this.user.cpid = '';
        this.user.username = '';
        this.user.password = '';
      },
      async deleteUser(cpid, username) {
        const querySnapshot = await getDocs(query(collection(db, 'user'), where('cpid', '==', cpid), where('username', '==', username)));
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      },
      async addMenu(){
        const ItemExists = this.menus.some(
            menu => menu.item === this.menu.item
        );
        if(this.menu.item === '' || this.menu.price === null || this.menu.available === null){
          alert('请填写全部资料');
          return;
        } else if (ItemExists){
          alert('该物品已拥有');
          return;
        }

        // Validation to ensure price is a number
        const isPriceValid = /^\d+(\.\d{1,2})?$/.test(this.menu.price);
        if (!isPriceValid) {
          alert('请填写正确的价格');
          return; // Stop further execution if price is invalid
        }
        
        if (this.menu.available === 'Yes') {
        this.menu.available = true;
        } else if (this.menu.available === 'No') {
          this.menu.available = false;
        }

        const menuCollection = collection(db, 'menu');
        const menuCheck = await getDocs(menuCollection);
        if (menuCheck.empty){
          try {
            await addDoc(menuCollection, { placeholder: true });
            console.log('Empty collection "menu" created successfully.');
          } catch (error) {
            console.error('Error creating empty collection:', error);
          }
        }

        await addDoc(collection( db, "menu" ),{
          item: this.menu.item,
          price: parseFloat(this.menu.price).toFixed(2),
          available: this.menu.available,
        })
        
        this.menu.item = '';
        this.menu.price = null;
        this.menu.available = 'Yes';
      },
      async deleteMenu(item) {
        const querySnapshot = await getDocs(query(collection(db, 'menu'), where('item', '==', item)));
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      },
      async updateAvailable(menu) {
        try {
          const menuQuery = await getDocs(query(collection(db, 'menu'), where('item', '==', menu.item)));
          let avail = null;
          if (menu.available === 'Yes') { avail = true; }
          else if (menu.available === 'No') { avail = false; }
          menuQuery.forEach(async (doc) => {
            await updateDoc(doc.ref, {
              available: !avail
            });
          });
          console.log('Availability updated successfully');
        } catch (error) {
          console.error('Error updating availability: ', error);
        }
      },
      returnFunc(){
        this.$router.push({ name: 'select' });
      }

    },
  };
  </script>

  <style scoped>
  @import '../css/TestFirebase.css';
  </style>