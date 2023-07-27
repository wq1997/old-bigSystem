<template>
    <div class="svgWrap">

        <div class="main-case" style="min-height: 500px; height:90vh;">
            <div class="sovitjs_body" style="min-height: 500px;">
                <div id="main_div" style="display: flex;width: 100%;">
                    <div id="theLeftDiv" style="width:100%; ">
                        <div id="sovit3d_1" style="height: 100%; margin-top: 0px;position: relative;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { showMessage, setToken, redirectPath } from "@/common/utils";

const {
    mapGetters: device_getters,
    mapActions: device_actions,
} = createNamespacedHelpers("device");
const {
    mapGetters: plant_getters,
} = createNamespacedHelpers("plant");
let _this = {};
export default {
    name: "TubeMap",
    data() {
        let sceneMain = null;
        let sceneChartMain = null;

        return {
            sceneMain,
            sceneChartMain,
            bmsId: [],
            pcsId: [],
            idData:[
                {
                    plantId:1558,
                    PageId:"3302116777302949892",
                    name:"bsf"
                },
                {
                    plantId:1590,
                    PageId:"3352942610741198850",
                    name:"tuv"
                },
            ],
            currentId:''
        }

    },
    computed: {
        ...device_getters(["allDevices", "version", "PCS", "BMS", "allDevDetails"]),
        ...plant_getters(["currentPlant", ]),

    },
    created() {
        _this = this;
    },
    mounted() {
        this.function();
    },
    methods: {
        ...device_actions(["getContainer"]),
        function() {
            this.idData.forEach(item=>{
                if (item.plantId==this.currentPlant.plantId) {
                    this.currentId=item.PageId;
                    console.log(  this.currentId);
                }else{
                    this.currentId="3302116777302949892";
                }
            })
            this.sceneMain = new Sovit3DPaser.SceneMain({
                /**
                 * 说明：apiurl用来定义后端接口地址。当部署方式不一样时接口地址的写法不一样。
                 * 具体写法：
                 * 数维图云端部署：https://admin.sovitjs.com/restapi
                 * 私有版部署：http://192.168.0.10:9188
                 * 私有版部署时需要写对应部署的服务器的IP及服务端口
                 * 注意：Sovit3D目前不支持离线下载文件进行引用，请使用在线引用场景(云端或者私有部署均可)
                 */
                apiurl: 'https://admin.sovitjs.com/restapi',
                publishType: 1 //1为在线引用组件 
            });
            this.sceneChartMain = new SovitChartPaser.SceneMain({
                apiurl: 'https://admin.sovitjs.com/restapi',
                publishType: 1 //1为在线引用组件 
            });
            this.initScene(this.currentId);
        },
        initScene(id) {
            //清除上一个场景的页面数据
            jCanvasQuery("#sovit3d_1").html('').css("height", "100vh");
            //销毁上一个场景的3D对象数据
            this.sceneMain.destroyed();
            //销毁上一个场景的图表对象数据
            // sceneChartMain.destroyed();
            this.sceneChartMain = new SovitChartPaser.SceneMain({
                apiurl: 'https://admin.sovitjs.com/restapi',
                publishType: 1 //1为在线引用组件
            });
            this.sceneMain.init3d("sovit3d_1", {
                pageId: id, //图表的ID，发布图表的地方可以找到
                chartSceneMain: this.sceneChartMain,//图表解析器对象传入到3D解析器中
                params: { //params是向后端接口或者SQL中定义了参数，进行参数传递，注意key的名称要和编辑器中对接数据时定义的参数名一样
                }
            }, function (reData) {
                if (reData.props.pcsIdModel) {
                    sessionStorage.setItem("containerId", _this.pcsId[+reData.props.pcsIdModel])
                } else {
                    sessionStorage.setItem("containerId", _this.bmsId[+reData.props.idModel])
                }
                _this.getContainer({
                    containerId: sessionStorage.getItem('containerId'),
                }).then(() => {
                    if (_this.PCS.length == 0 && _this.BMS.length == 0) {
                        showMessage("warning", "该集装箱数据暂未采集")
                    }
                });
                _this.$router.push({
                    path: '/containerIndex/equipmentOverview/containerDetail', // 命名路由
                    query: {
                        id: sessionStorage.getItem('containerId'),
                    }
                })
            }, function (sceneObj) {
                _this.allDevices.forEach((item, index) => {
                    if (item.type === 1) {
                        _this.pcsId.push(item.id)
                    } else {
                        _this.bmsId.push(item.id)
                    }
                })
            });
            this.sceneChartMain.initChart("sovit3d_1", {
                appType: 'sovit3d', //注意，当Sovit2D中使用了chart，这里使用SovitChart的API时必须加上这个参数
                pageId: id, //图表的ID，发布图表的地方可以找到
                params:{
                    plantId:_this.plantId
			}
            }, function (comId, eventType, reData) {
            });

        }

    },
    watch: {

    },


}
</script>
<style lang="scss" scoped>
/* @import url(); 引入css类 */
.svgWrap {
    width: 100%;
    margin-bottom: 20px;
    // overflow: hidden;
    height: 100vh;

    .ayk {
        width: 100%;
        height: 100%;
    }
}

.content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.topo {
    width: 1070px;
    height: 600px;
}
</style>