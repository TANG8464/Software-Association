<template>
<div class>
    <div class="category">
        <el-table :data="categoryData" style="width: 100%" row-key="id" lazy :load="load" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="id" label="id" width="100" header-align="center"></el-table-column>
            <el-table-column prop="bookCategoryName" label="类型名称" align="center"></el-table-column>
            <el-table-column width="180" label="操作" align="center">
                <template slot="header">
                    <div style="text-align:center;display: flex;align-items: center;width:150px" @click="addTopNode()">
                        <svg t="1590303308927" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13268" width="18" height="18">
                            <path d="M512 0c282.752 0 512 229.248 512 512s-229.248 512-512 512S0 794.752 0 512 229.248 0 512 0z m0 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333z m-0.042667 170.666667a42.666667 42.666667 0 0 1 42.666667 42.666667v170.666666h170.666667a42.666667 42.666667 0 0 1 0 85.333334h-170.666667v170.666666a42.666667 42.666667 0 0 1-85.333333 0v-170.666666h-170.666667a42.666667 42.666667 0 0 1 0-85.333334h170.666667V298.666667a42.666667 42.666667 0 0 1 42.666666-42.666667z" fill="#008df0" p-id="13269" />
                        </svg>
                        <span style="color:#008df0;padding:0 8px;">添加顶级类型</span>
                    </div>
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleAdd(scope.$index, scope.row)">添加</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新增顶级分类" width="30%" class="add-event-dialog" :visible.sync="addTopVisible" size="tiny">
            <el-form ref="addTopForm" :model="addTopForm">
                <el-form-item label="分类名称" prop="bookCategoryName">
                    <el-input v-model="addTopForm.bookCategoryName"></el-input>
                </el-form-item>
                <el-form-item label="分类号" prop="id">
                    <el-input v-model="addTopForm.id"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addTopForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addTopFormCancleBtn('addTopForm')">取 消</el-button>
                <el-button type="primary" @click="addTopFormSubmitBtn('addTopForm')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="新增书籍分类" width="30%" class="add-event-dialog" :visible.sync="addEventdialogVisible" size="tiny">
            <el-form ref="addEventForm" :model="addEventForm">
                <el-form-item label="父类id" prop="categoryID">
                    <el-input v-model="addEventForm.categoryID" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="分类名称" prop="bookCategoryName">
                    <el-input v-model="addEventForm.bookCategoryName"></el-input>
                </el-form-item>
                <el-form-item label="分类号" prop="id">
                    <el-input v-model="addEventForm.id"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addEventForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addEventFormCancleBtn('addEventForm')">取 消</el-button>
                <el-button type="primary" @click="addEventFormSubmitBtn('addEventForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</div>
</template>

<script>
export default {
    created() {
        this.getToken();
        this.getData();
    },
    data() {
        return {
            categoryData: [],
            token: {},
            addTopVisible: false,
            addTopForm: {
                bookCategoryName: "",
                id: "",
                remark: ""
            },
            addEventdialogVisible: false,
            addEventForm: {
                bookCategoryName: "",
                id: "",
                remark: "",
                categoryID: ""
            }
        };
    },
    methods: {
        getToken: function () {
            //获取登录时存储在localStorage中的header-Token，作为上传凭证
            this.token["HEADER-TOKEN"] = localStorage.getItem("HEADER_TOKEN");
        },
        load(tree, treeNode, resolve) {
            setTimeout(async () => {
                const {
                    data: res
                } = await this.$http.get("book/categorise", {
                    headers: this.token,
                    params: {
                        categoryId: tree.id
                    }
                });
                if (res.code != 200) {
                    return
                }
                for (let i in res.data) {
                    res.data[i].hasChildren = "true";
                }
                resolve(res.data);
            }, 500);
        },
        async getData() {
            const {
                data: res
            } = await this.$http.get("book/categorise", {
                headers: this.token,
                params: {}
            });
            if (res.code != 200) return
            for (let i in res.data) {
                res.data[i].hasChildren = "true";
            }
            this.categoryData = res.data;

        },
        addTopNode() {
            this.addTopVisible = true;
        },
        handleAdd(index, row) {
            this.addEventForm.categoryID = row.id;
            this.addEventdialogVisible = "true";
        },
        handleDelete(index, row) {
            this.$confirm("确定要删除该节点吗？", "温馨提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(async () => {
                    const {
                        data: res
                    } = await this.$http.delete(
                        "book/category/" + row.id, {
                            headers: this.token
                        }
                    );
                    if (res.code != 200) {
                        this.$message.error("删除失败");
                    } else {
                        this.categoryData.splice(index, 1);
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    }
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        addTopFormSubmitBtn(formname) {
            this.$refs[formname].validate(async valid => {
                if (valid) {
                    let dataPost = {
                        bookCategoryName: this.addTopForm.bookCategoryName,
                        categoryID: null,
                        id: this.addTopForm.id,
                        remark: this.addTopForm.remark
                    };
                    const {
                        data: res
                    } = await this.$http.post(
                        "book/category/",
                        dataPost, {
                            headers: this.token
                        }
                    );
                    if (res.code != 200) {
                        this.$message.error(res.message);
                    } else {
                        this.getData();
                        this.$refs[formname].resetFields();
                        this.$message.success("添加书籍类型成功");
                        this.addTopVisible = false;
                    }
                } else {
                    return false;
                }
            });
        },
        /*取消顶级节点新增 */
        addTopFormCancleBtn(formname) {
            this.addTopVisible = false;
            this.$refs[formname].resetFields();
        },
        addEventFormSubmitBtn(formname) {
            this.$refs[formname].validate(async valid => {
                if (valid) {
                    let dataPost = {
                        bookCategoryName: this.addEventForm.bookCategoryName,
                        categoryID: this.addEventForm.categoryID,
                        id: this.addEventForm.id,
                        remark: this.addEventForm.remark
                    };
                    const {
                        data: res
                    } = await this.$http.post(
                        "book/category/",
                        dataPost, {
                            headers: this.token
                        }
                    );
                    if (res.code != 200) return
                    this.addEventdialogVisible = false;
                    this.$refs[formname].resetFields();
                    this.$message.success("添加书籍类型成功");

                } else {
                    return false;
                }
            });
        },
        /*取消节点新增 */
        addEventFormCancleBtn(formname) {
            this.addEventdialogVisible = false;
            this.$refs[formname].resetFields();
        }
    }
};
</script>

<style scoped>
</style>
