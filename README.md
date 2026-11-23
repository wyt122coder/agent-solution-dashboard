# Agent Solution 社区贡献看板

看板展示 openJiuwen Agent Solution 的社区贡献、Common 特性和 SIG 例会日历。

## 公开访问

- [GitHub Pages](https://wyt122coder.github.io/agent-solution-dashboard/)
- [ChatGPT Sites](https://openjiuwen-solution-sig-board.wyt122.chatgpt.site/)

## 双站发布

1. 把看板更新提交到本仓库的 `main`，以该提交的静态站点文件作为两边的发布内容。
2. 等待 GitHub Pages 从 `main` 的仓库根目录发布，同时用同一份静态文件更新现有的 ChatGPT Sites 看板。ChatGPT Sites 的静态发布目录为 `dist/`，沿用该项目现有的托管配置和公开地址。
3. 打开两个公开入口，核对首页、受影响的页面和资源，确认两边都已上线同一版本。单边部署失败时，记录失败环境并完成补发后，再确认同步发布完成。
