(() => {
  const mount = document.querySelector("[data-common-delivery]");
  if (!mount) return;

  const data = commonDeliveryData;
  const { repository, snapshot, groups, deliveries } = data;
  const treeUrl = `${repository}/tree/${snapshot}/common`;

  function add(parent, tag, label, className) {
    const element = document.createElement(tag);
    if (label) element.textContent = label;
    if (className) element.className = className;
    parent.append(element);
    return element;
  }

  function link(parent, label, url) {
    const anchor = add(parent, "a", label);
    anchor.href = url;
    if (url.startsWith("https://")) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    }
    return anchor;
  }

  function renderModule(list, module, category) {
    const card = add(add(list, "li"), "details", "", "common-card");
    const summary = add(card, "summary");
    add(summary, "span", category, "common-card-category");
    add(summary, "span", module.name, "common-card-name");
    add(summary, "code", module.id, "common-card-id");
    add(summary, "span", module.description, "common-card-description");

    const content = add(card, "div", "", "common-card-body");
    const capabilities = add(content, "ul");
    capabilities.setAttribute("aria-label", "主要能力");
    module.capabilities.forEach(capability => add(capabilities, "li", capability));

    if (module.prs.length) {
      add(content, "h5", "10 月代表性合入");
      const history = add(content, "ul", "", "common-card-deliveries");
      module.prs.forEach(number => {
        const [date, description] = deliveries[number];
        const item = add(history, "li");
        add(item, "time", date.slice(5)).dateTime = date;
        link(item, `!${number} ${description}`, `${repository}/merge_requests/${number}`);
      });
    }

    const links = add(content, "div", "", "common-card-links");
    link(links, "在 AtomGit 查看代码 ↗", `${treeUrl}/${module.id}`);
  }

  const preview = link(mount, "", "archify/common-capabilities.html");
  preview.className = "common-tree-preview";
  const previewText = add(preview, "div", "", "common-preview-copy");
  add(previewText, "span", "Archify 能力图", "common-preview-title");
  add(previewText, "span", "从模块和能力下钻到 FEAT，查看特性说明和对应的 L2 设计。", "common-preview-caption");
  const previewAction = add(previewText, "span", "打开交互图", "common-preview-action");
  add(previewAction, "span", " ↗").setAttribute("aria-hidden", "true");
  const image = add(preview, "img");
  image.src = "archify/common-capabilities-thumbnail.png";
  image.alt = "";
  image.width = 1080;
  image.height = 360;
  image.loading = "lazy";
  const grid = add(mount, "ul", "", "common-feature-grid");
  grid.setAttribute("aria-label", "Common 模块");
  groups.forEach(group => {
    group.modules.forEach(module => renderModule(grid, module, group.label));
  });

  const architecture = add(mount, "section", "", "common-architecture");
  architecture.id = "common-architecture";
  architecture.setAttribute("aria-labelledby", "common-architecture-title");
  const architectureHeader = add(architecture, "header", "", "common-architecture-header");
  const intro = add(architectureHeader, "div");
  add(intro, "h4", "Common 模块协作架构").id = "common-architecture-title";
  add(intro, "p", "11 个 Common 模块的请求、依赖、日志与观测关系。");
  link(architectureHeader, "打开交互架构图 ↗", "archify/common-module-architecture.html");
  const frame = add(architecture, "div", "", "common-architecture-scroll");
  frame.tabIndex = 0;
  frame.setAttribute("role", "region");
  frame.setAttribute("aria-label", "Common 协作架构图，可横向滚动");
  const architectureImage = add(frame, "img");
  architectureImage.src = "archify/common-module-architecture-preview.png";
  architectureImage.alt = "Common 模块协作架构，覆盖请求转发、宿主与代码复用、观测、日志采集和示例验证。";
  architectureImage.width = 1400;
  architectureImage.height = 860;
  architectureImage.loading = "lazy";
  add(architecture, "p", "实线表示请求、日志和轨迹关系。虚线表示依赖、可选接入和示例验证。", "common-architecture-legend");

  const snapshotNote = add(mount, "p", `模块快照 · ${snapshot.slice(0, 7)}`, "common-snapshot");
  link(snapshotNote, "查看 common/ 完整目录 ↗", treeUrl);
})();
