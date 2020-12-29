<template>
  <div class="ceshi">
    测试页面
    <input
      type="file"
      class="fileInput"
      ref="file"
      id="file"
      placeholder=""
      @change="chooseFile"
      accept="image/*"
    />
    <input
      type="file"
      class="fileInput"
      ref="file1"
      id="file"
      placeholder=""
      @change="chooseFile1"
      accept="image/*"
    />
    <div class="lookUrl">
      <img :src="lookUrl" alt="#" class="lookUrl" />
    </div>
    <div class="img" v-for="(item, index) in imgList" :key="index">
      <img :src="baseURL + item.customContent" alt="#" />
    </div>
    <div class="imgall">
      <div class="img" v-for="(item, index) in imgList1" :key="index">
        <img :src="baseURL1 + item.url" alt="#" />
      </div>
    </div>
    <!-- <el-pagination
      background
      layout="prev, pager, next"
      :total="100"
      :current-page.sync="page"
      @current-change="handleCurrentChange"
      v-if="imgList1.length !== 0"
    >
    </el-pagination> -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="300"
      v-if="imgList1.length !== 0"
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
import { Message } from 'element-ui'
export default {
  name: 'Ceshi',
  data () {
    return {
      imgList: [],
      baseURL: '',
      baseURL1: '',
      imgList1: [],
      lookUrl: '',
      page: 1,
      rows: 10,
      file: ''
    }
  },
  methods: {
    chooseFile (a) {
      const fr = new FileReader()
      fr.readAsDataURL(a.target.files[0])
      fr.onload = e => {
        this.lookUrl = e.target.result
      }
      console.log(this.$refs.file)
      console.log(this.$refs.file.files[0])
      if (this.$refs.file.files[0].size / 1024 / 1024 < 20) {
        // this.file = this.$refs.file.files[0];
        // this.mainMenuList=[];
        // this.dataList1=[];
        // this.dataList2=[];
        // this.dataList3=[];
        // this.dataList4=[];
        // this.page=1;
        this.getList(this.$refs.file.files[0]);
      } else {
        Message({ message: '图片大小不能超过20M', type: "error" })
      };
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.page = val
      this.img(this.file)
    },
    chooseFile1 (a) {
      const fr = new FileReader()
      fr.readAsDataURL(a.target.files[0])
      fr.onload = e => {
        this.lookUrl = e.target.result
      }
      console.log(this.$refs.file1.files[0])
      if (this.$refs.file1.files[0].size / 1024 / 1024 < 20) {
        // this.file = this.$refs.file.files[0];
        // this.mainMenuList=[];
        // this.dataList1=[];
        // this.dataList2=[];
        // this.dataList3=[];
        // this.dataList4=[];
        // this.page=1;
        this.getList1(this.$refs.file1.files[0]);
      } else {
        Message({ message: '图片大小不能超过20M', type: "error" })
      };
    },
    getList (file) {
      let formData = new FormData()
      formData.append('file', file)
      formData.append('page', this.page)
      formData.append('rows', this.rows)
      axios.post('/pic/pic', formData).then((res) => {
        console.log(res)
        const data = res.data.data
        if (res.data.code === 0) {
          this.baseURL = res.data.wwwFileBaseUrl
          const imgArr = data.searchResult.auctions
          console.log(imgArr.length)
          if (imgArr.length === 0) return Message.error('没有找到相似图片')
          Message.success('搜索成功')
          this.imgList = imgArr
        }
      })
    },
    handleSizeChange (val) {
      console.log('条数:' + val)
      this.page = 1
      this.rows = val
      this.img(this.file)
    },
    getList1 (file) {
      this.page = 1
      this.img(file)
    },
    img (file) {
      const page = (this.page - 1) * this.rows
      let formData = new FormData();
      formData.append('file', file);
      formData.append('page', page);
      formData.append('rows', this.rows);
      this.file = file
      axios.post('/badidu/pic/pic', formData).then((res) => {
        console.log(res)
        const data = res.data.data
        if (res.data.code === 0) {
          this.baseURL1 = res.data.wwwFileBaseUrl
          const imgArr = data.result
          const arr = []
          // const a = imgArr.forEach(item=>{
          //   return item.name === 692f33be02884f6699ca565fb255cd5a.jpg
          // })
          // console.log(a)
          console.log(imgArr.length)
          if (imgArr.length === 0) return Message.error('没有找到相似图片')
          Message.success('搜索成功')
          this.imgList1 = imgArr
        }
      })
    }
  }
}
</script>

<style>
.img {
  width: 200px;
}
img {
  width: 100%;
}
.imgall {
  display: flex;
  flex-wrap: wrap;
}
.lookUrl {
  width: 300px;
  height: 300px;
}
</style>