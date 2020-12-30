<template>
  <div class="order">
    <div class="header"><HeaderInfo></HeaderInfo></div>
    <div class="content">
      <div class="contentHeader">
        <div class="contentHeaderTitle">新建订单</div>
      </div>
      <div class="contentArea">
        <div class="mainTitle">新建订单</div>
        <div class="titleTip">新建订单后请到小程序查看订单状态</div>
        <!-- 表单 -->
        <div>
          <el-form label-position="top" label-width="80px">
            <el-form-item label="花型">
              <el-upload
                :action="requestUrl + '/file'"
                list-type="picture-card"
                :headers="uploadHeader"
                :data="{ type: 0 }"
                :auto-upload="true"
                :on-success="uploadSuccess"
                :file-list="fileList"
                :before-remove="doLogin"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{ file }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePictureCardPreview(file)"
                    >
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <span
                      v-if="!disabled"
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file, fileList)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                  <el-input v-model="file.name"></el-input>
                </div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
            <el-form-item label="选择客户">
              <div class="chooseCustomer">
                <el-select
                  v-model="fkCustomerAccount"
                  placeholder="请选择客户"
                  @change="changeCustomer"
                >
                  <el-option
                    v-for="item in customerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.account"
                  >
                  </el-option>
                </el-select>
                <el-button type="info" plain @click="toCreateUser"
                  >创建新客户</el-button
                >
              </div>
            </el-form-item>
          </el-form>
          <el-form label-position="left" label-width="80px">
            <div class="deliveryType">
              <el-form-item label="面料来源">
                <el-radio-group v-model="origin" @change="changeOrigin">
                  <el-radio label="加工" value="加工"></el-radio>
                  <el-radio label="经销" value="经销"></el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form>
          <el-form label-position="top" label-width="80px">
            <el-form-item label="面料">
              <div class="chooseF">
                <el-select
                  v-model="fabricName"
                  placeholder="请选择面料"
                  clearable
                >
                  <el-option
                    v-for="item in fabricList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="是否加急">
              <div class="chooseF">
                <el-switch
                  v-model="expedite"
                  active-color="#13ce66"
                  :active-value="1"
                  :inactive-value="0"
                >
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item label="浆料配方">
              <div class="chooseF">
                <el-select
                  v-model="sizingName"
                  placeholder="请选择浆料"
                  clearable
                >
                  <el-option
                    v-for="item in sizingList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="配置方案">
              <div class="chooseF">
                <el-select
                  v-model="configName"
                  placeholder="请选择配置方案"
                  clearable
                >
                  <el-option
                    v-for="item in configList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="花型路径">
              <el-input
                v-model="flowerPath"
                placeholder="请输入花型路径"
              ></el-input>
            </el-form-item>
            <el-form-item label="选择调色员">
              <div class="chooseCustomer">
                <el-select
                  v-model="fkColorAccount"
                  placeholder="请选择调色员"
                  clearable
                >
                  <el-option
                    v-for="item in fkColorList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-row>
              <el-col :span="11">
                <el-form-item label="单价">
                  <el-input v-model="unitPrice" placeholder="请输入单价">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="11" :offset="2">
                <el-form-item label="米数">
                  <el-input v-model="meter" placeholder="请输入米数">
                    <template slot="append">米</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="收货时间">
              <el-date-picker
                v-model="deliveryTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择收货时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
          <el-form label-position="left" label-width="80px">
            <div class="deliveryType">
              <el-form-item label="快递方式">
                <el-radio-group v-model="deliveryType">
                  <el-radio label="物流" value="物流"></el-radio>
                  <el-radio label="自提" value="自提"></el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form>
          <el-form label-position="top" label-width="80px">
            <div class="deliveryType">
              <el-form-item label="备注">
                <el-input type="textarea" v-model="remark"></el-input>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button style="width=100%;" type="primary" @click="onSubmit"
                >确认提交</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="copyright">copyright © 2020 华燕数码</div>
  </div>
</template>
<script>
import HeaderInfo from '../components/headerInfo'

export default {
  name: "Order",
  data () {
    return {
      customerInfo: {
        account: '',
        password: '111111',
        name: '',
        companyName: '',
        address: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      token: '',
      uploadHeader: {},
      //客户id
      fkCustomerId: '',
      //客户列表
      customerList: [],
      fkCustomerAccount: '',
      // 调色员列表
      fkColorList: [],
      fkColorAccount: '',
      //面料列表
      fabricList: [],
      // 配置方案列表
      configList: [],
      // 选中的配置方案
      configName: '',
      //选中的面料规格
      fabricName: '',
      //米数
      meter: '',
      //单价
      unitPrice: '',
      //收货时间
      deliveryTime: '',
      //快递方式
      deliveryType: '物流',
      remark: "",
      //面料来源
      origin: '加工',
      // 花型路径
      flowerPath: '',
      fileSize: 20,
      // requestUrl: 'http://192.168.1.115:9999',//测试
      requestUrl: 'https://www.yinhuachaoshi.com/order',//线上
      again: false,
      //0不加急1加急
      expedite: 0,
      arrJingxiao: [],
      arrJiagong: [],
      // 浆料配方列表
      sizingList: [],
      //浆料名
      sizingName: '',
      sizingIndex: ''
    };
  },
  components: {
    HeaderInfo: HeaderInfo
  },
  methods: {
    onSubmit () {
      console.log(this.configList)
      console.log(this.configName)
      //验证
      if (this.fileList.length == 0) {
        this.$message.error("请选择花型");
      } else {
        let str = '';
        for (var i = 0; i < this.fileList.length; i++) {
          if (!this.fileList[i].name) {
            this.$message.error("请输入花型编号");
            return;
          }
          if (this.again && this.fileList[i].urlNext) {
            str += this.fileList[i].name + "," + this.fileList[i].urlNext + ',' + this.fileList[i].num + ';';
          } else {
            this.fileList[i].name = this.fileList[i].name.slice(0, this.fileList[i].name.lastIndexOf('.'));
            str += this.fileList[i].name + "," + this.fileList[i].response.data + ',' + this.fileList[i].num + ';';
            // console.log(this.fileList)
            // console.log(str)
          }
        }
        //正实数
        var reRealNumber1 = /^[0-9]/  //非零开头
        if (!this.fkCustomerAccount) {
          this.$message.error("请选择客户");
        } else if (!this.fabricName) {
          this.$message.error("请选择面料规格");
        } else if (!this.configName) {
          this.$message.error('请选择配置方案')
        } else if (!this.meter) {
          this.$message.error("请输入米数");
        } else if (!reRealNumber1.test(this.meter)) {
          // console.log(this.meter)
          this.$message.error("请输入正常的米数");
        } else if (!this.unitPrice) {
          this.$message.error("请输入单价");
        } else if (!reRealNumber1.test(this.unitPrice)) {
          this.$message.error("请输入正常的单价");
        } else if (!this.flowerPath) {
          this.$message.error("请输入花型路径");
        } else {
          var customer = '';
          var colorDetail = '';
          var fabricInfo = '';
          this.customerList.forEach((item, index) => {
            if (item.account == this.fkCustomerAccount) {
              customer = item.userDetail
            }
          })
          this.fkColorList.forEach(item => {
            if (item.name == this.fkColorAccount) {
              colorDetail = item;
            }
          })
          this.fabricList.forEach(item => {
            if (item.name == this.fabricName) {
              fabricInfo = item
            }
          })
          this.sizingIndex = this.sizingList.findIndex(item => {
            return item.name === this.sizingName
          })
          let sizingId
          let sizingName
          if (this.sizingIndex === -1) {
            sizingId = 0
            sizingName = '无浆料配方'
          } else {
            sizingId = this.sizingList[this.sizingIndex].id,
              sizingName = this.sizingList[this.sizingIndex].name
          }
          let machineId
          this.configList.forEach(item => {
            if (item.name === this.configName) {
              machineId = item.machineId
            }
          })
          const obj = {
            companyName: customer.companyName,
            fkCustomerId: customer.fkUserId,
            contacts: customer.contacts,
            phone: customer.phone,
            address: customer.address,
            fabricName: this.fabricName,
            fkFabricId: fabricInfo.id,
            meter: this.meter,
            unitPrice: this.unitPrice,
            origin: this.origin,
            note: this.remark,
            deliveryTime: this.deliveryTime,
            deliveryType: this.deliveryType,
            detailStrs: str,
            filePath: this.flowerPath,
            configName: this.configName,
            colorName: colorDetail.name,
            fkColorId: colorDetail.id,
            expedite: this.expedite,
            sizingId: sizingId,
            sizingName: sizingName,
            machineId
          }
          if (obj.colorName === undefined || obj.fkColorId === undefined) {
            obj.colorName = '无调色员'
            obj.fkColorId = 0
          }
          // console.log(obj)
          this.$post('/order', obj).then((data) => {
            this.$message.success(data.message);
            localStorage.removeItem('carList');
            this.$router.push({
              path: '/messageResult',
              params: { resultData: data }
            })
          })
        }
      }
    },
    toCreateUser () {
      this.$router.push({
        name: 'AddCustomer',
        params: {
          isLine: 1  //判断是否是从订单页面跳转
        }
      })
    },
    handleRemove (file, fileList) {
      var fileListResult = [];
      for (var i = 0; i < this.fileList.length; i++) {
        if (file.name != this.fileList[i].name || file.response.data != this.fileList[i].response.data) {
          fileListResult.push(this.fileList[i]);
        }
      }
      this.fileList = fileListResult;
    },
    //图片放大
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      console.log(file)
      this.dialogVisible = true;
    },
    //点击面料来源
    changeOrigin () {
      // console.log('点击')
      this.fabricName = ''
    },
    doLogin () {
      return false;
    },
    uploadSuccess (response, file, fileList) {
      // console.log(file)
      var types = 'jpg,jpeg,png,JPG,PNG,JPEG'
      if (types.indexOf(file.name.substring(file.name.indexOf('.') + 1, file.name.length)) <= -1) {
        this.$message.error('请上传图片格式的文件')
        fileList = fileList.slice(0, fileList.length - 1)
      } else if (file.name.indexOf('=') !== -1 || file.name.indexOf('&') !== -1 || file.name.indexOf(',') !== -1 || file.name.indexOf(';') !== -1) {
        // console.log('不能包含等号')
        this.$message.error('上传的图片名字中不能包含"="、";"、"&"或","')
        fileList = fileList.slice(0, fileList.length - 1)
      } else {
        fileList[fileList.length - 1].url = response.wwwFileBaseUrl + response.data;
        fileList[fileList.length - 1].num = fileList[fileList.length - 1].name;
      }
      // console.log(response)
      // console.log(fileList)
      // console.log(file)
      this.fileList = fileList;
    },
    //获取客户列表
    getCustomerList () {
      this.$get('/customer', {
        page: 1,
        rows: 999999
      }).then((data) => {
        this.customerList = data.data.list;
        if (this.fkCustomerId != '') {
          this.customerList.forEach((item, index) => {
            if (item.id == this.fkCustomerId) {
              this.fkCustomerAccount = item.account;
            }
          })
        }
      })
    },
    // 获取调色员列表
    getFkColorList () {
      this.$get('/user', {
        page: 1,
        rows: 99999,
        role: 7
      }).then((data) => {
        this.fkColorList = data.data.list
      })
    },
    //获取面料列表
    getFabricList (id) {
      this.$get('/fabric/select', {
        page: 1,
        rows: 999999,
        fkCustomerId: id
      }).then((data) => {
        // console.log(data)
        if (this.origin === '加工') {
          this.fabricList = data.data
        }
        this.arrJiagong = data.data;
      })
    },
    // 获取所有面料(经销加加工)
    getFabricListAll () {
      this.$get('/fabric', {
        page: 1,
        rows: 999999,
      }).then((data) => {
        // console.log(data)
        const arrJiagong = []
        const arrJingxiao = []
        const lenth = data.data.list.length
        for (let a = 0; a < lenth; a++) {
          if (data.data.list[a].fkCustomerId !== -10) {
            arrJiagong.push(data.data.list[a])
          }
        }
        // console.log(arrJiagong)
        // this.fabricName = ''
        this.arrJiagong = arrJiagong
        if (this.origin === '加工') {
          this.fabricList = arrJiagong
        }
      })
      this.$get('/fabric/select', {
        page: 1,
        rows: 999999,
        fkCustomerId: -10
      }).then((data) => {
        const arrJingxiao = []
        // console.log(data)
        const lenthA = data.data.length
        for (let a = 0; a < lenthA; a++) {
          arrJingxiao.push(data.data[a])
        }
        console.log(arrJingxiao)
        // this.fabricName = ''
        this.arrJingxiao = arrJingxiao
        if (this.origin === '经销') {
          this.fabricList = arrJingxiao
        }
      })
    },
    // 获取配置方案列表
    getConfigList () {
      this.$get('/config', {
        page: 1,
        rows: 999999
      }).then((data) => {
        this.configList = data.data.list;
      })
    },
    //获取浆料配方
    getSizingList () {
      this.$get('/sizing/sizing', {
        page: 1,
        rows: 999999
      }).then((data) => {
        this.sizingList = data.data.list;
      })
    },
    //客户改变
    changeCustomer () {
      // console.log('客户改变')
      if (this.origin === '加工') {
        this.fabricName = ''
        console.log(this.fkCustomerAccount)
      }
    }
  },
  mounted () {
    this.token = localStorage.getItem("token");
    this.uploadHeader = { 'token': this.token }
  },
  created () {
    this.getCustomerList();
    this.getConfigList();
    this.getFkColorList();
    this.getSizingList()
    this.getFabricListAll();
    if (this.$route.params) {
      this.fkCustomerAccount = this.$route.params.customerAccount
      //如果是再次下单
      if (this.$route.params.orderInfo) {
        this.again = true;
        let orderInfo = this.$route.params.orderInfo;
        console.log(orderInfo)
        let customer = {};
        customer.companyName = orderInfo.companyName;
        customer.fkUserId = orderInfo.fkUserId;
        customer.contacts = orderInfo.contacts;
        customer.phone = orderInfo.phone;
        customer.address = orderInfo.address;
        this.fkCustomerId = orderInfo.fkCustomerId
        this.fabricName = orderInfo.fabricName;
        // fabricInfo.id = orderInfo.fkFabricId;
        this.meter = parseFloat(orderInfo.meter);
        this.unitPrice = parseFloat(orderInfo.unitPrice);
        this.origin = orderInfo.origin;
        this.remark = orderInfo.note;
        this.deliveryTime = orderInfo.deliveryTime;
        this.deliveryType = orderInfo.deliveryType;
        this.sizingName = orderInfo.sizingName
        let fileList = [];
        orderInfo.orderDetails.forEach((item, index) => {
          fileList.push({
            name: item.flowerNum,
            url: localStorage.getItem("baseUrl") + item.flowerUrl,
            // url:item.flowerUrl,
            num: item.flowerNum,
            urlNext: item.flowerUrl
          })
        })
        this.fileList = fileList;
        //str = orderInfo.detailStrs;
        this.flowerPath = orderInfo.filePath;
        this.configName = orderInfo.configName;
        this.fkColorAccount = orderInfo.colorName;
        this.expedite = orderInfo.expedite;
        //colorDetail.id = orderInfo.fkColorId;
      }
    }
    if (localStorage.getItem("carList")) {
      this.fileList = JSON.parse(localStorage.getItem("carList"))
      this.fileList.forEach(item => {
        item.num = item.name
      })
    }
    var _this = this;
    document.onkeydown = function (e) {
      let key = window.event.keyCode;
      if (key == 8) {
        _this.doLogin();
      }
    }
  },
  watch: {
    fkCustomerAccount: function (newId, oldId) {
      console.log(newId)
      if (newId) {
        var fkCustomerId = '';
        this.customerList.forEach(item => {
          if (item.account == newId) {
            fkCustomerId = item.id
          }
        })
        console.log(fkCustomerId)
        this.getFabricList(fkCustomerId);
      }
      // console.log('客户选择')
    },
    origin () {
      // console.log(this.origin)
      if (this.origin === '加工') {
        this.fabricList = this.arrJiagong
      } else {
        this.fabricList = this.arrJingxiao
      }
    }
  }
}
</script>
<style>
.order .el-form-item__label {
  line-height: 100%;
}

.order .el-upload-list--picture-card .el-upload-list__item {
  overflow: inherit !important;
}
*:focus {
  outline: none;
}
.order .el-upload-list__item .el-input__inner {
  border: none;
}
.order .el-upload-list__item > :first-child {
  height: 100%;
}
.chooseCustomer .el-select > .el-input {
  width: 343px;
}
.chooseF .el-select > .el-input {
  width: 460px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.deliveryType .el-form-item__label {
  line-height: 40px;
}
</style>
<style scoped>
.el-button--primary {
  width: 100%;
}
.order {
  min-width: 1440px;
}
.header {
  box-shadow: 0 2px 35px 0 rgba(28, 34, 38, 0.1);
  position: relative;
}
.content {
  width: 1200px;
  margin: 51px auto;
}
.contentHeader {
  display: flex;
  margin-bottom: 22px;
}
.contentHeaderTitle {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 28px;
}
.contentArea {
  width: 460px;
  background: #ffffff;
  box-shadow: 0 2px 35px 0 rgba(28, 34, 38, 0.05);
  border-radius: 6px;
  padding: 63px 370px 67px;
}
.contentArea .mainTitle {
  font-family: PingFangSC-Regular;
  font-size: 40px;
  color: #000000;
  letter-spacing: -1.33px;
  line-height: 40px;
}
.titleTip {
  font-family: PingFangSC-Regular;
  font-size: 20px;
  color: #999999;
  letter-spacing: -0.55px;
  margin-top: 10px;
  margin-bottom: 65px;
}
.copyright {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  line-height: 20px;
  margin-top: 30px;
  text-align: center;
  margin-bottom: 30px;
}
</style>
