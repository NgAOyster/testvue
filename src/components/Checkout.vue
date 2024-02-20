<template>
    <br>
    <el-steps :active="active" finish-status="success" align-center>
        <el-step title="步骤 1" description="确认货物"></el-step>
        <el-step title="步骤 2" description="支付"></el-step>
        <el-step title="支付成功"></el-step>
    </el-steps>
    <br>
    <div v-if="active === 0">
        <div class="card_section">
            <el-card v-for="(item, index) in items" :key="index" class="item-card">
            <template #header>
                <span>{{ item.name }}</span>
            </template>
            <div>
                <img :src="item.picture" alt="item" class="item-image">
                <div class="item-details">
                    <div class="lhs-details">
                    <span class="item-info">价格: RM {{ item.price.toFixed(2) }}</span>
                    <span class="item-info">数量: {{ item.quantity }}</span>
                    </div>
                    <div class="rhs-details">
                    <span class="item-info">总价: RM <span class="bigger-text">{{ calTotalPrice(index).toFixed(2) }}</span></span>
                    </div>
                </div>
                <el-button type="danger" class="delete-button" @click="deleteItem(index)">删除</el-button>
                </div>
            </el-card>
        </div>
        <br>
        <div class="card-bottom">
            <el-button type="primary" class="next-button" @click="nextStep">下一步</el-button>
        </div>
    </div>
    <div v-if="active === 1">
        <div class="payment_section">
            <el-form
                :model="payment"
                ref="paymentForm"
                label-width="100px"
            >
                <el-form-item label="卡类型" prop="cardType">
                    <el-select v-model="payment.cardType" placeholder="请选择卡类型">
                        <el-option label="借记卡" value="Debit"></el-option>
                        <el-option label="信用卡" value="Credit"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="持卡人姓名" prop="cardName">
                    <el-input v-model="payment.cardName"></el-input>
                </el-form-item>

                <el-form-item label="卡号" prop="cardNo">
                    <el-input v-model="payment.cardNo"></el-input>
                </el-form-item>

                <el-form-item label="有效期" prop="expDate">
                    <el-input v-model="payment.expDate" maxlength="10" placeholder="DD/MM/YYYY" @input="formatExpDate" @blur="validateExpDate"></el-input>
                </el-form-item>

                <el-form-item label="CVV码" prop="cvv">
                    <el-input v-model="payment.cvv" :maxlength="3"></el-input>
                </el-form-item>
            </el-form>

            <el-button type="warning" @click="previousStep">返回</el-button>
            <el-button type="primary" @click="submitPaymentForm">提交</el-button>
        </div>
    </div>
    <div v-if="active === 2">
        <div class="success-page">
            <el-result
                icon="success"
                title="支付成功"
                :sub-title="`订单号：${orderNumber}`"
            >
                <template #extra>
                    <el-button type="success" >保存收据</el-button>
                    <el-button type="primary" @click="goHome">返回首页</el-button>
                </template>
            </el-result>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Checkout_Page_Test',
    data(){
        return {
            active: 0,
            orderNumber: 'NKH1123096543',
            items: [
                {
                    name: "Item 1",
                    picture: require('@/assets/logo.png'),
                    price: 10,
                    quantity: 2,
                },
                {
                    name: "Item 2",
                    picture: require('@/assets/logo.png'),
                    price: 15,
                    quantity: 3,
                },
                {
                    name: "Item 3",
                    picture: require('@/assets/logo.png'),
                    price: 15,
                    quantity: 1,
                },
                {
                    name: "Item 4",
                    picture: require('@/assets/logo.png'),
                    price: 7.50,
                    quantity: 3,
                },
            ],
            payment: {
                cardName: '',
                cardType: 'Debit',
                cardNo: '',
                expDate: '',
                cvv: '',
            },
        }
    },
    methods:{
        previousStep(){
            this.active--;
        },
        nextStep(){
            if (this.active++ > 2) this.active = 0;
        },
        goHome() {
            this.$router.push({ name: 'select' });
        },
        deleteItem(index) {
            this.items.splice(index, 1);
        },
        calTotalPrice(index){
            const totalPrice = this.items[index].price * this.items[index].quantity;
            return totalPrice;
        },
        submitPaymentForm(){

            if (!this.payment.cardType || !this.payment.cardName || !this.payment.cardNo) {
                this.$message.error("请填写所有字段");
                return;
            }

            if (this.payment.cvv.length !== 3) {
                this.$message.error('CVV码长度应为三位!');
                return;
            }

            if(this.payment.expDate.length !== 10){
                this.$message.error('有效期格式不对!');
                return;
            }
            const currentDate = new Date();
            const selectedDate = new Date(this.payment.expDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));

            if (selectedDate <= currentDate) {
                this.$message.error('你的卡已经过期了!');
                return;
            }

            this.nextStep();
        },
        formatExpDate() {
            // Remove non-numeric characters
            let formattedDate = this.payment.expDate.replace(/\D/g, "");

            // Insert "/" at appropriate positions
            if (formattedDate.length > 2) {
                formattedDate = formattedDate.slice(0, 2) + "/" + formattedDate.slice(2);
            }

            if (formattedDate.length > 5) {
                formattedDate =
                formattedDate.slice(0, 5) + "/" + formattedDate.slice(5, 9);
            }

            // Update the model with the formatted date
            this.payment.expDate = formattedDate;
        },
        validateExpDate() {
            const dateParts = this.payment.expDate.split("/");
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const year = parseInt(dateParts[2], 10);

            if (isNaN(day) || day < 1 || day > this.getDaysInMonth(month, year)) {
                this.$message.error(`Invalid day. Please enter a valid day (1-${this.getDaysInMonth(month, year)}).`);
                this.payment.expDate = "";
                return;
            }

            if (isNaN(month) || month < 1 || month > 12) {
                this.$message.error("Invalid month. Please enter a valid month (1-12).");
                this.payment.expDate = "";
                return;
            }
            // You can add additional validation for year if needed

            // Format the date again after validation
            this.formatExpDate();
        },
        getDaysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        },
    },
}
</script>

<style scoped>
.card_section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 15%;
}
.payment_section{
  padding: 20px 15%;
}

.item-card {
  margin: 20px 0; /* Adjust top and bottom margin */
  width: calc(50% - 10px); /* 50% width with 10px spacing between items */
}

.item-image {
  width: 200px;
  height: 100%; /* Maintain aspect ratio */
}

.item-info {
  display: block;
  margin-top: 10px;
}

.delete-button {
  margin-top: 10px; /* Adjust margin between item info and delete button */
  margin-left: auto;
}

.item-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.lhs-details {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.rhs-details {
  text-align: right;
}

.bigger-text {
  font-size: 1.5em; /* Adjust the font size as needed */
}

.card-bottom {
    display: flex;
    justify-content: space-between;
}

.next-button {
    min-width: 100px;
    margin: 0 20px 20px auto;
}

</style>
