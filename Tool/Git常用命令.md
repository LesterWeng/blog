# Git 常用命令

- 生成 SSH 公钥： `ssh-keygen`

- 修改 Git 配置： `git config [options]`

  可添加范围选项来更改配置的范围:

  - --system
  - --global
  - --local

  可查看（读），可设置（写）：

  - git config user.name (read)
  - git config user.name "your user name" (write)
  - git config --global http.sslVerify false (忽略https验证)

- 本地库初始化: `git init`

- 克隆分支： `git clone xxx`

- 查看远程/全部分支： `git branch -r/-a`

- 创建新分支: `git branch 'newBranch'`

- 创建并切换至新分支： `git checkout -b 'newBranch'`

- 将本地分支与远程分支进行关联（常用于本地新建分支之后需要提交到新的远程分支时，如修改本地分支名称后提交到新的远程分支时）： `git branch --set-upstream-to=origin/newBranch`

- 删除分支： `git checkout -d 'oldBranch'`

- 切换分支： `git checkout xxx`

- 将本地未 push 的 commit 历史整理成直线： `git rebase`

  可将本次push中的commit合并，常见案例：

  - commit-push 时发现远程已被他人更改，我们需要 pull 之后再 commmit-push，这将导致 git history 中我们这次有 2 次 commit
  - 本地多次 commit 后再 push，同样 git history 中会有多次 commit

- 合并 xxx 分支到当前分支： `git merge xxx`

- 更新当前分支（不会自动 merge 本地代码，冲突时，用户检查后决定是否 merge）：`git fetch`

- 更新当前分支（自动 merge 本地代码，冲突时，需要手动解决）： `git pull`

- 强制把远程库的代码跟新到当前分支上面：`git pull --rebase origin master`

- 添加本地文件（夹）修改到 stage： `git add xxx`

- 把 stage 中的修改提交到本地库：`git commit -m 'comments'`(-m: message)

- 将已被 git 追踪到的文件中的修改或删除操作提交到本地库，即使没有使用 git add 将改动提交到 stage，注意新加的文件是不会被提交的，仍需先使用 git add 将其添加到 stage：`git commit -a -m 'comments'`(-a: all)

- 把本地库的修改提交到远程库中： `git push`

- 把未完成的修改缓存到堆栈中：`git stash`

- 查看所有的缓存：`git stash list`

- 恢复到最近的一个缓存：`git stash apply`

- 恢复到指定的一个缓存：`git stash apply 'stashName'`

  'stashName'为`stash@{0}`,`stash@{1}`...

- 删除一个指定的缓存：`git stash drop 'stashName'`

- 恢复到最近的一个缓存并删除这个缓存：`git stash pop`

- 删除所有缓存：`git stash clear`

- 查看某个文件的每一行的修改记录（谁在什么时候修改的）：`git blame 'someFile'`

- 查看当前分支有哪些修改：`git status`

- 查看当前分支上的日志信息：`git log`

- 查看当前没有 add 的内容：`git diff`

- 查看已经 add 但是没有 commit 的内容：`git diff --cache`

- 查看当前没有 add 或已 add 但未 commit 的内容：`git diff HEAD`

- 撤销本地修改：`git reset --hard HEAD`

- 查看 git config 的 HOME 路径：`echo $HOME`

- 配置 git config 的 HOME 路径：`export $HOME=/c/gitconfig`
