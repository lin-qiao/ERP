<!--
 * @Author: your name
 * @Date: 2021-03-16 11:32:02
 * @LastEditTime: 2021-03-16 15:07:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue3-element-admin\src\components\dashboard\Shortcuts.vue
-->
<template>
    <el-row :gutter="20" style="padding-bottom: 10px;">
        <el-col :span="12">
            <div class="ve-card ve_card1">
                <i class="el-icon-basketball"></i>
                <div>
                    <p>菜单数量</p>
                    <span>6</span>
                </div>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="ve-card ve_card2">
                <i class="el-icon-user-solid"></i>
                <div>
                    <p>用户数量</p>
                    <span>6</span>
                </div>
            </div>
        </el-col>
    </el-row>
    <el-row :gutter="20" style="padding-top: 10px;">
        <el-col :span="12">
            <div class="ve-card ve_card3">
                <i class="el-icon-s-check"></i>
                <div>
                    <p>角色数量</p>
                    <span>6</span>
                </div>
            </div>
        </el-col>
        <el-col :span="12">
            <div class="ve-card ve_card4">
                <i class="el-icon-s-order"></i>
                <div>
                    <p>资料数量</p>
                    <span>6</span>
                </div>
            </div>
        </el-col>
    </el-row>
</template>

<script>
export default {
    setup() {
        return {};
    }
};
</script>

<style lang="scss" scoped>
.el-row {
    height: 50%;

    padding-right: 10px;
}
.ve-card {
    border-radius: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    transition: all 500ms;
    color: #fff;
    &:hover {
        box-shadow: 3px 3px 6px 1px rgba(0, 0, 0, 0.2);
        background: #fff;
    }
    i {
        font-size: 100px;
        margin: 0 20px;
    }
    div {
        flex: 1;
        padding-right: 12px;
        p {
            margin: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        span {
            font-size: 60px;
            font-weight: bold;
        }
    }
}
.ve_card1 {
    background: #409eff;
    &:hover {
        color: #409eff;
    }
}
.ve_card2 {
    background: #67c23a;
    &:hover {
        color: #67c23a;
    }
}
.ve_card3 {
    background: #e6a23c;
    &:hover {
        color: #e6a23c;
    }
}
.ve_card4 {
    background: #f56c6c;
    &:hover {
        color: #f56c6c;
    }
}
</style>
