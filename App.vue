<script>
// #ifdef APP
//初始化pda扫码
import pda from "@/utils/pda.js";
pda.initScan();
// #endif
export default {
  onLaunch: function () {},
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {},
};
</script>

<style lang="scss">
@import "@/common/uni.css";
@import "@/common/uni-icons.css";
@import "@/common/main.scss";
</style>
