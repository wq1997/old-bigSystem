export default [
  {
    path: "/",
    redirect: "/containerIndex/equipment",
    component: _ =>
      import(/* webpackChunkName: "Layout" */ "@/pages/Index/Layout"),
    children: [
      {
        path: "/containerIndex/equipment/overview",
        meta: {
          name: "设备舱列表",
          icon: "icon-chanpinzonglan"
        },
        redirect: "/containerIndex/equipment/overview",
        component: _ =>
          import(
                    /* webpackChunkName: "Overview" */ "@/pages/equipmentOverview"
          ),
        children: [
          {
            path: "/containerIndex/equipment/overview",
            code: "T",
            meta: {
              icon: "icon-chanpinzonglan",
              name:'总览'
            },
            component: _ =>
              import(
                /* webpackChunkName: "Overview" */ "@/pages/equipmentOverview/equipmentLayout/index"
              )
          },
          {
            path: "/containerIndex/equipmentOverview",
            code: "T",
            meta: {
              name: "设备舱详情",
              icon: "icon-chanpinzonglan"
            },
            redirect: "/containerIndex/equipmentOverview/containerDetail",
            component: _ =>
              import(
              /* webpackChunkName: "Overview" */ "@/pages/containerDetail/Index"
              ),
            children: [
              {
                path: "/containerIndex/equipmentOverview/containerDetail",
                code: "T",
                meta: {
                  icon: "icon-chanpinzonglan"
                },
                component: _ =>
                  import(
                      /* webpackChunkName: "Overview" */ "@/pages/containerDetail/components/overView"
                  ),
              },
              {
                path: "/containerIndex/equipmentOverview/monitor",
                code: "B",
                meta: {
                  name: "视屏监控",
                  icon: "icon-jiankong"
                },
                component: _ =>
                  import(/* webpackChunkName: "Overview" */ "@/pages/VideoMonitor")
              },
              {
                path: "/containerIndex/equipmentOverview/alarm",
                component: _ =>
                  import(
                                /* webpackChunkName: "ElectricityAnalysis" */ "@/pages/equipmentOverview/DeviceBatteryDetails"
                  ),
                meta: {
                  name: "报警查询",
                  icon: "icon-jianceshi"
                },
              },
              {
                path: "/containerIndex/equipmentOverview/energyManage",
                component: _ => import("@/pages/equipmentOverview/EnergyManage"),
                meta: {
                  name: "数据分析",
                  icon: "icon-dianchi"
                },
              },

            ]
          },

        ],
      },
      {
        path: "/equipment/electricityAnalysis",
        component: _ => import("@/pages/StatistiReport/Index"),
        meta: {
          name: "场站数据",
          icon: "icon-jiance1"
        },
        redirect: "/equipment/electricityAnalysis/historicalDataQuery",
        children: [
          // {
          //   path: "/equipment/electricityAnalysis/historicalDataQuery",
          //   code: "K",
          //   meta: {
          //     name: "数据查询"
          //   },
          //   component: _ => import("@/pages/equipmentOverview/HistoricalDataQuery")
          // },
          {
            path: "/equipment/electricityAnalysis/intervalData",
            code: "K",
            meta: {
              name: "数据对比"
            },
            component: _ => import("@/pages/equipmentOverview/IntervalData")
          },
        ]
      },
      {
        path: "/equipment/statistiReport",
        component: _ => import("@/pages/StatistiReport/Index"),
        meta: {
          name: "统计报表",
          icon: "icon-tubiao1"
        },
        redirect: "/equipment/electricityAnalysis/terminalMeter",
        children: [
          {
            path: "/equipment/electricityAnalysis/Report",
            meta: {
              name: "报表导出"
            },
            component: _ => import("@/pages/ElectricityAnalysis/Report")
          },
          {
            path: "/equipment/electricityAnalysis/terminalMeter",
            code: "K",
            meta: {
              name: "终端计量"
            },
            component: _ => import("@/pages/ElectricityAnalysis/TerminalMeter")
          },
          {
            path: "/equipment/electricityAnalysis/profitStatistics",
            code: "L",
            meta: {
              name: "收益统计"
            },
            component: _ =>
              import("@/pages/ElectricityAnalysis/ProfitStatistics")
          },
          {
            path: "/equipment/electricityAnalysis/profitDetail",
            code: "M",
            meta: {
              name: "收益明细"
            },
            component: _ => import("@/pages/ElectricityAnalysis/ProfitDetail")
          },
          {
            path: "/equipment/electricityAnalysis/electricityStatistics",
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
        path: "/equipment/stationManage",
        component: _ => import("@/pages/StationManage/Index"),
        meta: {
          name: "场站管理",
          icon: "icon-shezhi"
        },
        redirect: "/equipment/stationManage/plantList",
        children: [
          {
            path: "/equipment/stationManage/plantList",
            code: "O",
            meta: {
              name: "电站列表"
            },
            component: _ => import("@/pages/StationManage/PlantList")
          },
          {
            path: "/equipment/stationManage/deviceList",
            code: "P",
            meta: {
              name: "设备列表"
            },
            component: _ => import("@/pages/StationManage/DeviceList")
          },
          // {
          //   path: "/equipment/energyManage/controlStrategy",
          //   code: "Q",
          //   meta: {
          //     name: "控制策略"
          //   },
          //   component: _ => import("@/pages/EnergyManage/ControlStrategy")
          // },
          {
            path: "/equipment/energyManage/timePrice",
            code: "R",
            meta: {
              name: "时段电价"
            },
            component: _ => import("@/pages/EnergyManage/TimePrice")
          },
          {
            path: "/equipment/alarm/rule",
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

      {
        path: "/equipment/userManage",
        component: _ => import("@/pages/UserManage/Index"),
        meta: {
          name: "用户管理",
          icon: "icon-geren"
        },
        redirect: "/equipment/userManage/personalInfo",
        children: [
          {
            path: "/equipment/userManage/personalInfo",
            code: "S",
            meta: {
              name: "个人信息"
            },
            component: _ => import("@/pages/UserManage/PersonalInfo")
          },
          {
            path: "/equipment/userManage/addedService",
            code: "S",
            meta: {
              name: "增值业务"
            },
            component: _ => import("@/pages/UserManage/AddedService")
          },
          {
            path: "/equipment/userManage/userList",
            code: "T",
            meta: {
              name: "用户列表"
            },
            component: _ => import("@/pages/UserManage/UserList")
          }
        ]
      },

    ]
  },
]