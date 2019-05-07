# Npm 常用命令

- 初始化（生成 package.json）: `npm init`

- 安装 package.json 中的所有包：`npm install`

- 全局安装（在安装命令行工具时使用全局安装，如`npm install vue-cli -g`）: `npm install <package> -g`

- 本地安装：`npm install<package>`

- 更新包：`npm update xxx`

- 安装并写入 package.json 的 dependencies 中: `npm install <package> --save`

- 安装并写入 package.json 的 devDependencies 中: `npm install <package> --save-dev`

- 移除并删除 package.json 的 dependencies 中的对应信息: `npm unnistall <package> --save`

- 移除并删除 package.json 的 devDependencies 中的对应信息: `npm unnistall <package> --save-dev`

- 运行 package.json 中的脚本（运行 package.json 的 scripts 中定义的脚本，如`npm run dev）: npm run xxx`

- 安装淘宝镜像 cnpm 命令行工具（将原命令中的 npm 换成 cnpm 即可；使用 cnpm 可能导致 IDE(这里指 idea，vscode 中没有出现)中部分库的代码提示功能失效，如 ElementUI）：`$ npm install -g cnpm --registry=https://registry.npm.taobao.org`
  cnpm 与 npm 实际仍存在差异，可能导致意想不到的错误，应避免和 npm 同时使用，我们可以继续使用 npm，但使用淘宝的仓库：`npm install --registry=https://registry.npm.taobao.org`

- 修改 npm 配置，如修改下载仓库为淘宝镜像，修改后 npm 安装包速度大大提高，也不再需要使用 cnpm：`npm config set registry https://registry.npm.taobao.org`
- node-sass安装失败（使用cnpm安装时不会失败），正确安装方式：`npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/`

- 安装更新包的插件: `npm install -g npm-check-updates`

- 查看可更新包（需要先安装 npm-check-updates）: `ncu`

- 更新全部包（需要先安装 npm-check-updates）: `ncu-u`
