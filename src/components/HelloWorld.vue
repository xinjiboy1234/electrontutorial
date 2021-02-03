<template>
	<div class="hello">
		<div>
			<h1>Light Test</h1>
			<el-button @click="connectToServer" type="primary" plain>Conn</el-button>
			<el-button @click="batchLightOn" type="primary" plain>Light On</el-button>
			<el-button @click="batchLightOff" type="primary" plain>Light Off</el-button>
		</div>

		<div class="container">
			<el-row type="flex" :gutter="10">
				<el-col :span="8">
					<div class="basic-container settings-container">
						<div>
							<h3>Host Settings</h3>
							<div>
							<el-button type="primary" @click="hostDialogVisible=true">Add</el-button>
							<el-button type="danger" :disabled="hosts.length<=0">Delete</el-button>
							</div>
							<el-table :data="hosts" class="host-table">
                                <el-table-column prop="ip" label="IP">
                                </el-table-column>
                                <el-table-column prop="port" label="Port">
                                </el-table-column>
							</el-table>
						</div>
						<div>
							<div>
								<h3>Light Settings</h3>
							</div>
							<div>
								<el-button type="primary" @click="lightSettingDialogVisible = true">Add</el-button>
								<el-button type="danger" :disabled="lights.length<=0" @click="lightSettingsDelete">Delete</el-button>
							</div>
							<el-table :data="lights" class="light-table" @selection-change="handleSelectionChange">
								<el-table-column type="selection" width="55">
								</el-table-column>
								<el-table-column prop="index" label="Index">
								</el-table-column>
								<el-table-column prop="displayNumber" label="DisplayNumber">
								</el-table-column>
								<el-table-column prop="color" label="Color">
									<template slot-scope="scope">
									<font :color="scope.row.color == 'WHITE'? gray: scope.row.color" fontweight="bold">
										<strong>{{scope.row.color}}</strong>
									</font>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</el-col>
				<el-col :span="16">
                    <div class="receivebox-container">
                        <el-input id="receivedMessage" type="textarea" placeholder="Received Message" v-model="message" readonly="true">
                    </div>
				</el-col>
			</el-row>
		</div>
		<!-- 服务器配置 -->
		<el-dialog :visible.sync="hostDialogVisible">
			<el-form :model="host">
				<el-form-item label="Ip" :label-width="formLabelWidth">
					<el-input v-model="host.ip" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="Port" :label-width="formLabelWidth">
					<el-input v-model="host.port" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="hostSettingCancel">Close</el-button>
				<el-button type="primary" @click="hostSettingConfirm">Save</el-button>
			</div>
		</el-dialog>
		<!-- 灯设置 -->
		<el-dialog :visible.sync="lightSettingDialogVisible">
			<el-form :model="light">
				<el-form-item label="Index" :label-width="formLabelWidth2">
					<el-input v-model="light.index" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="Display Number" :label-width="formLabelWidth2">
					<el-input v-model="light.displayNumber" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="Color" :label-width="formLabelWidth2">
					<el-select v-model="light.color">
                        <el-option label="RED" value="RED"></el-option>
                        <el-option label="WHITE" value="WHITE"></el-option>
                        <el-option label="YELLOW" value="YELLOW"></el-option>
                        <el-option label="BLUE" value="BLUE"></el-option>
                        <el-option label="GREEN" value="GREEN"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="lightSettingCancel">Close</el-button>
				<el-button type="primary" @click="lightSettingConfirm">Save</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import socketClient from "@/utils/socket";

export default {
    name: "HelloWorld",
    data() {
        return {
            message: "",
            options: [
                {
                    label: "Red",
                    value: "red",
                },
            ],
            value: "",
            hosts: [],
            lights: [],
            host: {
                ip: "",
                port: "",
            },
            hostDialogVisible: false,
            formLabelWidth: "100px",
            formLabelWidth2: "130px",
            lightSettingDialogVisible: false,
            light: {
                index: "",
                displayNumber: "",
                color: "",
            },
            selectedLights: [],
        };
    },

    methods: {
        /**
         * 添加主机窗口关闭
         */
        hostSettingCancel() {
            this.hostDialogVisible = false;
        },
        /**
         * 添加主机信息
         */
        hostSettingConfirm() {
            this.hostDialogVisible = false;
            this.hosts.push({
                ip: this.host.ip,
                port: this.host.port,
            });
            this.host = {
                ip: "",
                port: "",
            };
        },
        /**
         * 表格多选框事件
         */
        handleSelectionChange(val) {
            this.selectedLights = val;
        },
        /**
         * 添加灯数据
         */
        lightSettingConfirm() {
            this.lightSettingDialogVisible = false;
            this.lights.push({
                index: this.light.index,
                displayNumber: this.light.displayNumber,
                color: this.light.color,
            });
            this.light = {
                index: "",
                displayNumber: "",
                color: "",
            };
        },
        /**
         * 添加窗口关闭
         */
        lightSettingCancel() {
            this.lightSettingDialogVisible = false;
        },
        /**
         * 删除选定的灯
         */
        lightSettingsDelete() {
            if (this.selectedLights.length === 0) {
                this.$message({
                    message: "Please select one record",
                    type: "warning",
                });
                return;
            }
            this.selectedLights.forEach((x) => {
                for (let i = 0; i < this.lights.length; i++) {
                    if (x.index === this.lights[i].index) {
                        this.lights.splice(i, 1);
                    }
                }
            });
        },
        /**
         * 连接到服务器
         */
        connectToServer() {
            /*
      6D0006000000510c000d001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100
      */
            socketClient.connect("127.0.0.1", 4660, (data) => {
                console.log("a ==>" + data.toString());
                const date = new Date();
                this.message +=
                    date.toLocaleString() +
                    "\n接收到服务器数据" +
                    JSON.stringify(data) +
                    "\n";
            });

            socketClient.connect("127.0.0.1", 4661, (data) => {
                console.log("a ==>" + data.toString());
                const date = new Date();
                this.message +=
                    date.toLocaleString() +
                    "\n接收到服务器数据" +
                    JSON.stringify(data) +
                    "\n";
            });
        },

        batchLightOn() {
            socketClient.batchLightOn({
                ip: "127.0.0.1",
                port: 4660,
                color: "red",
                lamps: [
                    {
                        id: 1,
                        qty: 12,
                    },
                    {
                        id: 2,
                        qty: 13,
                    },
                    {
                        id: 3,
                        qty: 16,
                    },
                ],
            });
            socketClient.batchLightOn({
                ip: "127.0.0.1",
                port: 4661,
                color: "red",
                lamps: [
                    {
                        id: 1,
                        qty: 12,
                    },
                    {
                        id: 2,
                        qty: 13,
                    },
                    {
                        id: 3,
                        qty: 16,
                    },
                ],
            });
        },
        /**
         * 批量灭灯
         */
        batchLightOff() {
            socketClient.batchLightOff({
                ip: "127.0.0.1",
                port: "4660",
                color: "",
                lamps: [],
            });
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.container {
    margin-top: 10px;
    .basic-container {
        padding: 10px;
        border: #dcdfe6 solid 1px;
        border-radius: 5px;
    }
    .light-table {
        margin-top: 10px;
    }
    .host-table {
        margin-top: 10px;
    }
}
#receivedMessage {
    min-height: 500px !important;
}
</style>
