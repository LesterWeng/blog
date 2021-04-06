# Git 常用命令

## global 相关

- 生成 SSH 公钥： `ssh-keygen`

- 本地库初始化: `git init`

- 修改 Git 配置： `git config [options]`

  可添加范围选项来更改配置的范围:

  - --system
  - --global
  - --local

  可查看（读），可设置（写）：

  - git config user.name (read)
  - git config user.name "your user name" (write)
  - git config --global http.sslVerify false (忽略 https 验证)

- 查看 git config 的 HOME 路径：`echo $HOME`

- 配置 git config 的 HOME 路径：`export $HOME=/c/gitconfig`

- 查看某个文件的每一行的修改记录（谁在什么时候修改的）：`git blame 'someFile'`

## branch 相关

- 克隆分支： `git clone xxx`

- 查看远程/全部分支： `git branch -r/-a`

- 创建新分支: `git branch 'newBranch'`

- 创建并切换至新分支： `git checkout -b 'newBranch'`

- 将本地分支与远程分支进行关联，设置后`git pull`和`git push`简写会直接拉取/推送到关联的远程分支： `git branch --set-upstream-to=origin/newBranch`

- 删除分支： `git checkout -d 'oldBranch'`

- 切换分支： `git checkout xxx`

- 查看当前分支有哪些修改：`git status`

- 查看当前分支上的日志信息：`git log`

## 拉取相关

- 更新本地的远程分支：`git fetch`

- 合并 xxx 分支到当前分支： `git merge xxx`

- 更新本地的远程分支并合并到本地分支（等于`git fetch + git merge`，冲突时，需要手动解决）： `git pull`

  - 可以把其他远程库的代码拉取到当前分支上面：`git pull origin master`

- 将单/多个 commit 应用于当前分支：`git cherry-pick 'commitHashA' 'commitHashB'`

案例：

- `master`分支不允许 push，因此通过`master_wlx`分支`merge`过去，操作步骤（在`master_wlx`分支）：修改版本号（假设仅需要修改某个包的版本号）->`git push`->`git pull origin master`，出现`conflict`，处理完之后发现文件没有改变，不允许 push。分析原因：相对于`master_wlx`分支，处理完分歧后的本地分支确实和远程分支一致。解决方案：先`pull`，再`push`，即`git pull origin master`->修改版本号->`git push`

## commit 相关

- 添加本地文件（夹）修改到 stage： `git add xxx`

  - 查看当前没有 add 的内容：`git diff`

  - 查看已经 add 但是没有 commit 的内容：`git diff --cache`

  - 查看当前没有 add 或已 add 但未 commit 的内容：`git diff HEAD`

- 把 stage 中的修改提交到本地库：`git commit -m 'comments'`(-m: message)

- 将已被 git 追踪到的文件中的`修改`或`删除`操作提交到本地库，即使没有使用 git add 将改动提交到 stage，注意`新加的文件`是不会被提交的，仍需先使用 git add 将其添加到 stage：`git commit -a -m 'comments'`(-a: all)

- 将本地未 push 的 commit 历史整理成直线： `git rebase`

  可将本次 push 中的 commit 合并，常见案例：

  - commit-push 时发现远程已被他人更改，我们需要 pull 之后再 commmit-push，这将导致 git history 中我们这次有 2 次 commit
  - 本地多次 commit 后再 push，同样 git history 中会有多次 commit

## push 相关

- 把本地库的修改提交到远程库中： `git push`

## 回退相关

- （`reset`）回退到之前的 commit state（可回退本地未 push 的 commit） 后提交，会撤销那次 commit 之后的 commit：`git reset --soft 'commitHash'`

  - 回退到上次（1 个版本）的 commit state：`git reset --soft HEAD~`、`git reset --soft HEAD~1`

  - 回退到上上次（2 个版本）的 commit state：`git reset --soft HEAD~2`...

  案例：

  - 回退 remote 的 commit，常用于回退`较新`的 commit ，回退后再将之后的 commit 重新提交一遍以恢复（其他已拉取该远程分支「如`master`」被撤销代码的分支仍会有问题，在`merge`到`master`分支时需要处理分歧，较好的解决方法是新建分支将撤销的代码恢复再重新`merge`到`master`，之后再拉取`master`之后即可更新）

- （`revert`）回退之前已提交的 commit 后提交，会撤销那次 commit 的修改：`git revert 'commitHash'`

  - 回退上次提交（1 个版本）的 commit state：`git revert HEAD~`、`git revert HEAD~1`

  - 回退上上次提交的（2 个版本） commit state：`git revert HEAD~2`...

  案例：

  - 回退 remote 的 commit，常用于回退`较老`的 commit ，回退后将修改后的这次 commit 重新提交一次以恢复

    - 使用 revert 回退`dev`后，其他分支若未修改被`revert`的文件，则后续`merge`时无法更新 dev，可在 dev`revert`那次`revert commit`以更新

## stash 相关

- 把未完成的修改缓存到堆栈中：`git stash`

  - 查看所有的缓存：`git stash list`

  - 恢复到最近的一个缓存：`git stash apply`

  - 恢复到指定的一个缓存：`git stash apply 'stashName'`

    'stashName'为`stash@{0}`,`stash@{1}`...

  - 删除一个指定的缓存：`git stash drop 'stashName'`

  - 恢复到最近的一个缓存并删除这个缓存：`git stash pop`

  - 删除所有缓存：`git stash clear`
