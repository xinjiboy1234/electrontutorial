<template>
    <el-container>
        <!-- 窗体功能区域 -->
        <el-header>
            <el-row :gutter="0">
                <el-col :span="20">
                    <div style="margin: 5px">
                        <svg t="1612344942859" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2411" width="30" height="30"><path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#273B7A" p-id="2412"></path><path d="M1013.846 613.882L574.25 174.286l-45.522 451.67-108.902-108.902-74.638 239.93 258.766 258.766c205.73-37.31 368.636-197.54 409.892-401.868z" fill="#121149" p-id="2413"></path><path d="M424.846 678.056c0-48.134 39.018-87.154 87.154-87.154s87.154 39.018 87.154 87.154S512 888.5 512 888.5s-87.154-162.308-87.154-210.444z" fill="#EAA22F" p-id="2414"></path><path d="M599.154 678.056c0-48.134-39.018-87.154-87.154-87.154-0.386 0-0.766 0.024-1.148 0.028v295.412l1.148 2.154s87.154-162.308 87.154-210.44z" fill="#E09112" p-id="2415"></path><path d="M449.746 695.668c0-34.382 27.872-62.254 62.254-62.254s62.254 27.872 62.254 62.254S512 845.986 512 845.986s-62.254-115.936-62.254-150.318z" fill="#FFC61B" p-id="2416"></path><path d="M574.254 695.668c0-34.382-27.872-62.254-62.254-62.254-0.386 0-0.762 0.052-1.148 0.058v210.354c0.72 1.358 1.148 2.158 1.148 2.158s62.254-115.934 62.254-150.316z" fill="#EAA22F" p-id="2417"></path><path d="M656.404 418.526c0-107.844-51.724-239.296-123.898-279.952a41.758 41.758 0 0 0-41.018 0c-72.174 40.66-123.898 172.112-123.898 279.952 0 120.026 42.512 208.462 61.888 247.55h165.032c19.384-39.092 61.894-112.522 61.894-247.55z" fill="#FEE187" p-id="2418"></path><path d="M656.404 418.526c0-107.844-51.724-239.296-123.898-279.952-6.716-3.782-14.204-5.516-21.656-5.31V666.08h83.664c19.38-39.096 61.89-112.526 61.89-247.554z" fill="#FFC61B" p-id="2419"></path><path d="M532.508 138.57a41.758 41.758 0 0 0-41.018 0c-31.016 17.474-58.236 51.738-79.216 93.666h199.452c-20.982-41.928-48.202-76.192-79.218-93.666z" fill="#FF5419" p-id="2420"></path><path d="M532.508 138.57c-6.716-3.782-14.204-5.514-21.656-5.31v98.976h100.876c-20.984-41.928-48.204-76.192-79.22-93.666z" fill="#C92F00" p-id="2421"></path><path d="M512 377.26m-82.516 0a82.516 82.516 0 1 0 165.032 0 82.516 82.516 0 1 0-165.032 0Z" fill="#E09112" p-id="2422"></path><path d="M512 294.75c-0.386 0-0.766 0.024-1.148 0.028v164.974c0.382 0.006 0.762 0.028 1.148 0.028 45.574 0 82.516-36.944 82.516-82.516S557.574 294.75 512 294.75z" fill="#FF5419" p-id="2423"></path><path d="M512 377.26m-61.888 0a61.888 61.888 0 1 0 123.776 0 61.888 61.888 0 1 0-123.776 0Z" fill="#386895" p-id="2424"></path><path d="M512 315.378c-0.386 0-0.762 0.052-1.148 0.058v123.66c0.386 0.006 0.762 0.058 1.148 0.058 34.178 0 61.888-27.706 61.888-61.888 0-34.178-27.71-61.888-61.888-61.888z" fill="#273B7A" p-id="2425"></path><path d="M389.248 492.61s-145.042 42.16-88.112 176.222c23.072 54.334 44.056 88.154 44.056 88.154h78.696s-57.85-88.154 0-132.21l-34.64-132.166z" fill="#FF5419" p-id="2426"></path><path d="M634.752 492.61s145.042 42.16 88.112 176.222c-23.072 54.334-44.056 88.154-44.056 88.154h-78.696s57.85-88.154 0-132.21l34.64-132.166z" fill="#C92F00" p-id="2427"></path><path d="M523.46 748.592h-22.92a9.168 9.168 0 0 1-9.168-9.168v-187.954a9.168 9.168 0 0 1 9.168-9.168h22.922a9.168 9.168 0 0 1 9.168 9.168v187.954a9.168 9.168 0 0 1-9.17 9.168z" fill="#FF5419" p-id="2428"></path><path d="M523.46 542.3h-12.608v206.292h12.608a9.168 9.168 0 0 0 9.168-9.168v-187.954a9.168 9.168 0 0 0-9.168-9.17z" fill="#C92F00" p-id="2429"></path></svg>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="window-command-btn-zone">
                        <el-button
                            class="window-command-btn"
                            icon="el-icon-minus"
                            size="mini"
                            @click="minWindow"
                        ></el-button>
                        <el-button
                            class="window-command-btn"
                            size="mini"
                            @click="maxWindow"
                        >
                            <div v-if="isMaxWindow">
                                <svg
                                    t="1612266103867"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="2065"
                                    width="12"
                                    height="12"
                                >
                                    <path
                                        d="M959.72 0H294.216a63.96 63.96 0 0 0-63.96 63.96v127.92H64.28A63.96 63.96 0 0 0 0.32 255.84V959.4a63.96 63.96 0 0 0 63.96 63.96h703.56a63.96 63.96 0 0 0 63.96-63.96V792.465h127.92a63.96 63.96 0 0 0 63.96-63.96V63.96A63.96 63.96 0 0 0 959.72 0zM767.84 728.505V959.4H64.28V255.84h703.56z m189.322 0H831.8V255.84a63.96 63.96 0 0 0-63.96-63.96H294.216V63.96H959.72z"
                                        p-id="2066"
                                        fill="#FFFFFF"
                                    ></path>
                                </svg>
                            </div>
                            <div v-else>
                                <svg
                                    t="1612266576735"
                                    class="icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    p-id="2735"
                                    width="12"
                                    height="12"
                                >
                                    <path
                                        d="M865.28 939.52H158.72c-40.96 0-74.24-33.28-74.24-74.24V158.72c0-40.96 33.28-74.24 74.24-74.24h706.56c40.96 0 74.24 33.28 74.24 74.24v706.56c0 40.96-33.28 74.24-74.24 74.24zM158.72 151.04c-4.096 0-7.68 3.584-7.68 7.68v706.56c0 4.096 3.584 7.68 7.68 7.68h706.56c4.096 0 7.68-3.584 7.68-7.68V158.72c0-4.096-3.584-7.68-7.68-7.68H158.72z"
                                        p-id="2736"
                                        fill="#ffffff"
                                    ></path>
                                </svg>
                            </div>
                        </el-button>

                        <el-button
                            class="window-command-btn"
                            icon="el-icon-close"
                            size="mini"
                            @click="closeWindow"
                        ></el-button>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <!-- 窗体内容区域 -->
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
const ipcRenderer = window.require("electron").ipcRenderer;

function getParent(node) {
    if (node.nodeName == "BUTTON") {
        return node;
    } else {
        return getParent(node.parentNode);
    }
}

export default {
    name: "App",
    props: {},
    data() {
        return {
            isMaxWindow: false,
        };
    },
    components: {},
    mounted() {
        ipcRenderer.on("window-restore", () => {
            this.isMaxWindow = false;
        });
        ipcRenderer.on("window-maxed", () => {
            this.isMaxWindow = true;
        });
    },
    methods: {
        closeWindow() {
            ipcRenderer.send("window-close");
        },
        minWindow(e) {
            blur(e);
            ipcRenderer.send("window-min");
        },
        maxWindow(e) {
            let target = getParent(e.target);
            target.blur();
            this.isMaxWindow = !this.isMaxWindow;
            ipcRenderer.send("window-max");
        },
    },
};
</script>

<style lang='scss'>
@import "@/element-variables.scss";
$command-hover-background: coral;
$command-hover-color: white;

.el-header {
    height: 40px !important;
    min-width: 800px;
    padding: 0px !important;
    background-color: $--color-primary;
    -webkit-app-region: drag;
    .window-command-btn-zone {
        float: right;
    }
    .window-command-btn {
        margin: 0px;
        border: 0px;
        height: 40px;
        width: 45px;
        color: white;
        font-weight: bold;
        background-color: $--color-primary;
        vertical-align: middle;
        border-radius: 0px;
        -webkit-app-region: no-drag !important;
        &:hover {
            background-color: $command-hover-background;
            color: $command-hover-color;
        }
        &:focus {
            background-color: $--color-primary;
            color: $command-hover-color;
        }
    }
}
</style>
