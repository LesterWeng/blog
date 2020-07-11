# Npm 常用命令

> 注：如下命令中的 `/` 均表示或，取其一即可

- 初始化（生成 package.json）：`npm init`

- 安装 package.json 中的所有包：`npm i/install`

- 全局安装（在安装命令行工具时使用全局安装，如`npm i vue-cli -g`）：`npm i <package> -g`

- 安装并写入 package.json 的 dependencies 中：`npm i <package>` 或 `npm i <package> -S/--save`

- 安装并写入 package.json 的 devDependencies 中：`npm i <package> -D` 或 `npm i <package> --save-dev`

- 移除并删除 package.json 的 dependencies 和 devDependencies 中的对应信息：`npm unnistall <package>`

- 移除并删除 package.json 的 dependencies 中的对应信息：`npm unnistall <package> --save`

- 移除并删除 package.json 的 devDependencies 中的对应信息：`npm unnistall <package> --save-dev`

- 运行 package.json 中 scripts 定义的脚本：`npm run xxx`，一些常用命令可简化，如`npm start`、`npm test`、`npm build`

- 将 npm 模块链接到本地 npm 模块：`npm link`，如在`A`项目中需要使用本地 npm 模块`B`，则我们需要现在`B`模块内使用`npm link`，之后在`A`项目内使用`npm link B`

- 安装淘宝镜像 cnpm 命令行工具：`$ npm i cnpm --registry=https://registry.npm.taobao.org -g`

  - 使用淘宝镜像安装包：将 npm 命令中的`npm`换成`cnpm`即可

  - `cnpm` 与 `npm` 仍有差异，应避免其与 `npm` 混用

- 全局修改 npm 配置，如`npm config set registry https://registry.npm.taobao.org -g`，也可在安装某个包时设置使用的仓库，如`npm i <package> --registry=https://registry.npm.taobao.org`

- 更新包

  - 更新包并更新 package.json 文件中版本号：`npm update <package>`
  - ncu
    - 安装更新包的插件：`npm i npm-check-updates -g`
    - 查看可更新包（需要先安装 npm-check-updates）：`ncu`
    - 更新 package.json 文件中版本号（需要先安装 npm-check-updates）：`ncu -u`

- package.json 中包名称前修饰符

  - `~`：匹配最近的小版本依赖包，比如`~1.2.3` 会匹配所有 `1.2.x` 版本，但是不包括 `1.3.0`
  - `^`：匹配最新的大版本依赖包，比如`^1.2.3` 会匹配所有 `1.x.x` 的包，包括 `1.3.0`，但是不包括 `2.0.0`
  - `*`：匹配最新版本的依赖包

- 问题记录

  - `npm WARN tarball tarball data for`，此问题怀疑是网络不好，部分包没有拉下来，可尝试先单独安装出错的包
