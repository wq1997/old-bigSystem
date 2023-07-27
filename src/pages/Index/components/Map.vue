<template>
  <div class="map">
    <div id="__map"></div>
    <DeviceContent :flag="flag" />
  </div>
</template>

<script>
import { showMessage, redirectPath, deepClone } from "@/common/utils";
import { createNamespacedHelpers } from "vuex";
import point from "@/assets/images/point.png";
import routes_container from "@/router/routes.container";
const { mapGetters: plant_getters, mapMutations: plant_mutations } =
  createNamespacedHelpers("plant");
const {
  mapGetters: device_getters,
  mapMutations: device_mutations,
  mapActions: device_actions,
} = createNamespacedHelpers("device");
const { mapGetters: app_getters } = createNamespacedHelpers("app");
export default {
  name: "Map",
  data() {
    return {
      flag: false,
      mapObj: null,
      mapStyle: {
        resizeEnable: true,
        center: [113.62, 34.75],
        zoom: 6,
        pitch: 75,
        routes: [],
      },
    };
  },
  mounted() {
    this.initMap();
  },
  components: {
    DeviceContent: (_) => import("./DeviceContent"),
  },
  computed: {
    ...app_getters(["systemTheme"]),
    ...plant_getters(["allPlants"]),
    ...device_getters(["allDevices", "version"]),
  },
  methods: {
    ...device_mutations(["setAllDevices", "setCurrentDevice"]),
    ...device_actions(["getAllDevices", "getDevicePermissions","getSummary"]),
    ...plant_mutations(["setCurrentPlant"]),
    initMap() {
      this.addStyle();
      this.mapObj = new AMap.Map("__map", this.mapStyle);
    },
    addMarker({ longitude, latitude }, infoWindow) {
      let position = [longitude, latitude];
      let marker = new AMap.Marker({
        map: this.mapObj,
        icon: require("../../../assets/images/point.png"),
        position,
      });
      marker.setAnimation("AMAP_ANIMATION_BOUNCE");
      marker.on("click", (_) => {
        infoWindow.open(this.mapObj, position);
        infoWindow.on("close", (_) => {
          this.flag = false;
          this.setCurrentPlant({});
          this.setAllDevices([]);
        });
      });
    },
    handleGetDevice(plantId) {
      let plant = this.allPlants.find((v) => v.plantId === plantId);
      this.setCurrentPlant(plant);
      this.getAllDevices({ plantId }).then(() => {
        if (this.version === 2) {
          this.getSummary({ plantId,type:1 });
          redirectPath("/containerIndex/equipment/overview");
        } else {
          this.flag = true;
          // redirectPath("/system/overview");
         
        }
      });
    },
    createContent(plant) {
      window.handleGetDevice = this.handleGetDevice;
      let infoWindow = `
        <div
          onclick="handleGetDevice(${plant.plantId})"
          style="
            cursor: pointer;
            min-width: 150px;
            text-align: center;
            font-size: 12px; 
            font-weight: bold;
            color:#fff;,
          "
        >
          <div >${plant.name}</div>
          <div style="font-size: 12px">
            <i style="
              color:#31e0f0" 
              class="iconfont icon-weizhi1"
            ></i>:
            ${plant.position}
          </div>
        </div>
      `;
      return infoWindow;
    },
    addInfoWindow(plants) {
      plants.forEach((item) => {
        this.addMarker(
          item,
          new AMap.InfoWindow({
            content: this.createContent(item),
          })
        );
      });
    },
    addStyle() {
      this.mapStyle.layers = "";
      this.mapStyle.mapStyle = "";
      if (this.systemTheme === "light") {
        this.mapStyle.layers = [
          new AMap.TileLayer.Satellite(),
          new AMap.TileLayer.RoadNet(),
        ];
      } else if (this.systemTheme === "black") {
        this.mapStyle.mapStyle = "amap://styles/grey";
      } else {
        this.mapStyle.mapStyle = "amap://styles/blue";
      }
    },
  },
  watch: {
    allPlants(newVal) {
      this.addInfoWindow(newVal);
    },
    systemTheme(newVal) {
      this.initMap();
      this.addInfoWindow(this.allPlants);
    },
    version(newVal) {
      if (newVal === 2) {
        redirectPath("/containerIndex/equipmentOverview");
      } else {
        this.flag = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: calc(100% - 80px);
  border-radius: 5px;
  position: relative;

  #__map {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
}

>>>.amap-info-content {
  background: #1b2535;
}

>>>.amap-info-sharp {
  border-top: 8px solid #1b2535;
}

// >>> .amap-info-content {
//   // background: linear-gradient(to right, #033447, #033447f5, #133f5800);
//   background: none;
//   font-size: 10px;
//   color: aqua;
//   text-align: center;
//    min-width: 150px;
//   font-weight: 700;
//   box-shadow: 0px 0 10px cyan inset;
//   cursor: pointer;
// }
// >>> .amap-info-contentContainer:hover .amap-info-outer {
//   box-shadow: 0px 0 10px cyan inset;
// }
</style>
