export default [
  {
    path: "/system",
    redirect:'/system/overview',
    component: _ => import(/* webpackChunkName: "Layout" */ "@/pages/Layout"),
    children: [
      {
        path: "/system/overview",
        code: "A",
        meta: {
          name: "总览",
          icon: "icon-chanpinzonglan"
        },
        component: _ => 
          import(/* webpackChunkName: "Overview" */ "@/pages/Overview")
      },
      {
        path: "/system/monitor",
        code: "B",
        meta: {
          name: "视屏监控",
          icon: "icon-jiankong"
        },
        component: _ =>
          import(/* webpackChunkName: "Overview" */ "@/pages/VideoMonitor")
      },
      {
        path: "/system/electricityAnalysis",
        component: _ =>
          import(
            /* webpackChunkName: "ElectricityAnalysis" */ "@/pages/ElectricityAnalysis/Index"
          ),
        meta: {
          name: "电量分析",
          icon: "icon-jianceshi"
        },
        redirect: "/system/electricityAnalysis/runMonitor",
        children: [
          {
            path: "/system/electricityAnalysis/runMonitor",
            code: "D",
            meta: {
              name: "运行监测"
            },
            component: _ => import("@/pages/ElectricityAnalysis/RunMonitor")
          },
          {
            path: "/system/energyManage/energyMonitor",
            code: "E",
            meta: {
              name: "储能监测"
            },
            component: _ => import("@/pages/EnergyManage/EnergyMonitor")
          }
        ]
      },
      {
        path: "/system/energyManage",
        component: _ => import("@/pages/EnergyManage/Index"),
        meta: {
          name: "储能管理",
          icon: "icon-dianchi"
        },
        redirect: "/system/energyManage/energyMonitor",
        children: [
          {
            path: "/system/energyManage/batteryOverview",
            code: "F",
            meta: {
              name: "电池总览"
            },
            component: _ => import("@/pages/EnergyManage/BatteryOverview")
          },
          {
            path: "/system/energyManage/batteryCluster",
            code: "G",
            meta: {
              name: "电芯详情"
            },
            component: _ => import("@/pages/EnergyManage/BatteryCluster")
          },

          {
            path: "/system/statistiReport/maxPressure",
            code: "H",
            meta: {
              name: "电池最大压差"
            },
            component: _ => import("@/pages/StatistiReport/MaxPressure")
          },
          {
            path: "/system/statistiReport/tempCurve",
            code: "I",
            meta: {
              name: "温差曲线"
            },
            component: _ => import("@/pages/StatistiReport/TempCurve")
          },
          {
            path: "/system/statistiReport/volCurve",
            code: "J",
            meta: {
              name: "压差曲线"
            },
            component: _ => import("@/pages/StatistiReport/VolCurve")
          }
        ]
      },
      {
        path: "/system/statistiReport",
        component: _ => import("@/pages/StatistiReport/Index"),
        meta: {
          name: "统计报表",
          icon: "icon-tubiao1"
        },
        redirect: "/system/statistiReport/batterySoc",
        children: [
          {
            path: "/system/electricityAnalysis/terminalMeter",
            code: "K",
            meta: {
              name: "终端计量"
            },
            component: _ => import("@/pages/ElectricityAnalysis/TerminalMeter")
          },
          {
            path: "/system/electricityAnalysis/profitStatistics",
            code: "L",
            meta: {
              name: "收益统计"
            },
            component: _ =>
              import("@/pages/ElectricityAnalysis/ProfitStatistics")
          },
          {
            path: "/system/electricityAnalysis/profitDetail",
            code: "M",
            meta: {
              name: "收益明细"
            },
            component: _ => import("@/pages/ElectricityAnalysis/ProfitDetail")
          },
          {
            path: "/system/electricityAnalysis/electricityStatistics",
            code: "N",
            meta: {
              name: "电量统计"
            },
            component: _ =>
              import("@/pages/ElectricityAnalysis/ElectricityStatistics")
          }
        ]
      },
      {
        path: "/system/stationManage",
        component: _ => import("@/pages/StationManage/Index"),
        meta: {
          name: "场站管理",
          icon: "icon-shezhi"
        },
        redirect: "/system/stationManage/plantList",
        children: [
          {
            path: "/system/stationManage/plantList",
            code: "O",
            meta: {
              name: "电站列表"
            },
            component: _ => import("@/pages/StationManage/PlantList")
          },
          {
            path: "/system/stationManage/deviceList",
            code: "P",
            meta: {
              name: "设备列表"
            },
            component: _ => import("@/pages/StationManage/DeviceList")
          },
          {
            path: "/system/energyManage/controlStrategy",
            code: "Q",
            meta: {
              name: "控制策略"
            },
            component: _ => import("@/pages/EnergyManage/ControlStrategy")
          },
          {
            path: "/system/energyManage/timePrice",
            code: "R",
            meta: {
              name: "时段电价"
            },
            component: _ => import("@/pages/EnergyManage/TimePrice")
          }
        ]
      },
      {
        path: "/system/userManage",
        component: _ => import("@/pages/UserManage/Index"),
        meta: {
          name: "用户管理",
          icon: "icon-geren"
        },
        redirect: "/system/userManage/personalInfo",
        children: [
          {
            path: "/system/userManage/personalInfo",
            code: "S",
            meta: {
              name: "个人信息"
            },
            component: _ => import("@/pages/UserManage/PersonalInfo")
          },
          {
            path: "/system/userManage/addedService",
            code: "S",
            meta: {
              name: "增值业务"
            },
            component: _ => import("@/pages/UserManage/AddedService")
          },
          {
            path: "/system/userManage/userList",
            code: "T",
            meta: {
              name: "用户列表"
            },
            component: _ => import("@/pages/UserManage/UserList")
          }
        ]
      },
      {
        path: "/system/alarm",
        component: _ => import(/* webpackChunkName: "Alarm" */ "@/pages/Alarm"),
        meta: {
          name: "报警",
          icon: "icon-lingdang"
        },
        redirect: "/system/alarm/search",
        children: [
          {
            path: "/system/alarm/search",
            code: "U",
            meta: {
              name: "报警查询"
            },
            component: _ =>
              import(
                /* webpackChunkName: "AlarmSearch" */ "@/pages/Alarm/AlarmSearch"
              )
          },
          {
            path: "/system/alarm/config",
            code: "V",
            meta: {
              name: "报警配置"
            },
            component: _ =>
              import(
                /* webpackChunkName: "AlarmConfig" */ "@/pages/Alarm/AlarmConfig"
              )
          },
          {
            path: "/system/alarm/rule",
            code: "W",
            meta: {
              name: "报警规则"
            },
            component: _ =>
              import(
                /* webpackChunkName: "AlarmConfig" */ "@/pages/Alarm/AlarmRule"
              )
          }
        ]
      },
    
    ]
  }
];
