<template>
  <div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <v-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              业主统计
            </div>
            <count-to :start-val="0" :end-val="owner" :duration="5000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <v-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              公告统计
            </div>
            <count-to :start-val="0" :end-val="bulletin" :duration="4800" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <v-icon icon-class="service" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              投诉/报修
            </div>
            <count-to :start-val="0" :end-val="service" :duration="5500" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <v-icon icon-class="building" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              楼栋统计
            </div>
            <count-to :start-val="0" :end-val="building" :duration="4600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <v-icon icon-class="parking" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              车位(卖出)
            </div>
            <count-to :start-val="0" :end-val="parking" :duration="6600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <v-icon icon-class="house" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              房屋(卖出)
            </div>
            <count-to :start-val="0" :end-val="house" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="btn">
      <el-col :span="20">
        <el-button type='primary' @click="week">近7天</el-button>
        <el-button type='primary' @click="month">近30天</el-button>
      </el-col>
    </el-row>
    <div id="main" style="height:400px; wight: 95%;"></div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { getUsersAll } from '@/service/login'
import { getBulletin } from '@/service/bulletin'
import { getService } from '@/service/service'
import { getBuilding } from '@/service/building'
import { getParking } from '@/service/parking'
import { getHouse } from '@/service/house'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      owner: 0,
      bulletin: 0,
      bulletinPublish: [],
      service: 0,
      servicePublish: [],
      building: 0,
      parking: 0,
      house: 0,
      handleLogo: 1,
      date: [],
      option: {
        title: {
          text: '数据统计'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // data: ['业主总数', '发布公告数', '投诉/报修']
          data: ['发布公告数', '投诉/报修']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: { //配置项
          feature: {
            saveAsImage: {} //导出图片
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '发布公告数',
            type: 'line',
            stack: 'bulletin',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '投诉/报修',
            type: 'line',
            stack: 'service',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
        ]
      }
    }
  },
  created() {
    this._getUsersAll(2, 9999)
    this._getBulletin(null)
    this._getService(null)
    this._getBuilding('')
    this._getParking(1)
    this._getHouse(1)
  },
  methods: {
    _getUsersAll(identity, limit) {
      getUsersAll({identity, limit})
      .then(res => {
        if (res.data.code === 200) {
          this.owner = res.data.user.count
        } else {
          this.$message.error('业主获取失败')
        }
      })
    },
    _getBulletin(publishAt) {
      getBulletin({publishAt})
      .then(res => {
        if (res.data.code === 200) {
          this.bulletin = res.data.bulletin.count
          this.bulletinPublish = []
          let bulletinPublish = res.data.bulletin.rows
          this.bulletinPublish = bulletinPublish.map(item => {
            this.bulletinPublish.push(item.publishAt)
            return item.publishAt
          })
          this.bulletinPublish = this.handleDate(this.bulletinPublish)
        } else {
          this.$message.error('公告获取失败')
        }
      })
    },
    _getService(createdAt) {
      getService({createdAt})
      .then(res => {
        if (res.data.code === 200) {
          this.service = res.data.service.count
          this.servicePublish = []
          let servicePublish = res.data.service.rows
          this.servicePublish = servicePublish.map(item => {
            this.servicePublish.push(item.createdAt)
            return item.createdAt
          })
          this.servicePublish = this.handleDate(this.servicePublish)
        } else {
          this.$message.error('投诉获取失败')
        }
      })
    },
    _getBuilding(name) {
      getBuilding({name})
      .then(res => {
        if (res.status === 201) {
          this.building = res.data.building.count
        } else {
          this.$message.error('楼栋获取失败')
        }
      })
    },
    _getParking(state) { //1
      getParking({state})
      .then(res => {
        if (res.data.code === 200) {
          this.parking = res.data.parking.count
        } else {
          this.$message.error('车位获取失败')
        }
      })
    },
    _getHouse(state) { //1
      getHouse({state})
      .then(res => {
        if (res.data.code === 200) {
          this.house = res.data.house.count
        } else {
          this.$message.error('房屋获取失败')
        }
      })
    },
    drawChart() {
      let myEchart = this.$echarts.init(document.getElementById("main"))
      let option = this.option
      myEchart.setOption(option)
    },
    getDate(num) {
      let today = new Date()
      this.date = []
      let tempToday = today.toLocaleDateString()
      this.date.unshift(this.removeYear(tempToday))
      for( let i = 1; i < num ; i++) {
        today.setTime(today.getTime() - 3600 * 1000 * 24 )
        let date = today.toLocaleDateString()
        date = date.split('/')
        date = `${date[1]}/${date[2]}`
        this.date.unshift(date)
      }
    },
    removeYear(item) {
      item = item.split('/')
      item = `${item[1]}/${item[2]}`
      return item
    },
    handleDate(arr) {
      arr = arr.filter(item => item)
      arr = arr.map(item => {
        item = new Date(Date.parse(item))
        item.setTime(item.getTime() + 3600 * 1000 * 8)
        item = item.toLocaleDateString()
        item = this.removeYear(item)
        return item
      })
      return arr.sort()
    },
    week(){
      if (this.handleLogo !== 1) {
        this.$echarts.dispose(document.getElementById("main"))
      }
      let week = new Date()
      week.setTime(week.getTime() - 3600*1000*24*6)
      let today = new Date()
      today.setTime(today.getTime() + 3600*1000*8)
      this._getBulletin([week.toLocaleDateString(), today.toLocaleDateString()])
      this._getService([week.toLocaleDateString(), today.toLocaleDateString()])
      this.getDate(7)
      let series = Array(7).fill(0)
      this.option.xAxis.data = this.date
      this.bulletinPublish.map(item => {
        for (let i = 0; i < 7; i++) {
          if (item == this.date[i]) {
            series[i] = ++series[i]
          }
        }
      })
      this.option.series[0].data = series
      let seriesService = Array(7).fill(0)
      this.servicePublish.map(item => {
        for (let i = 0; i < 7; i++) {
          if (item == this.date[i]) {
            seriesService[i] = ++seriesService[i]
          }
        }
      })
      this.option.series[1].data = seriesService
      this.drawChart()
    },
    month(){
      this.$echarts.dispose(document.getElementById("main"))
      let week = new Date()
      week.setTime(week.getTime() - 3600*1000*24*29)
      let today = new Date()
      this._getBulletin([week.toLocaleDateString(), today.toLocaleDateString()])
      this.getDate(30)
      let series = Array(30).fill(0)
      this.option.xAxis.data = this.date
      this.bulletinPublish.map(item => {
        for (let i = 0; i < 30; i++) {
          if (item == this.date[i]) {
            series[i] = ++series[i]
          }
        }
      })
      this.option.series[0].data = series
      let seriesService = Array(30).fill(0)
      this.servicePublish.map(item => {
        for (let i = 0; i < 30; i++) {
          if (item == this.date[i]) {
            seriesService[i] = ++seriesService[i]
          }
        }
      })
      this.option.series[1].data = seriesService
      this.drawChart()
    }
  },
   mounted(){
    this.week()
    ++this.handleLogo
  }
}
</script>

<style lang="scss" scoped>

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

.btn {
  margin-bottom: 20px;
  span {
    line-height: 40px;
    margin: 0 10px;
  }
}

</style>
