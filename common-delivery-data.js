const commonDeliveryData = {
  snapshot: "f5dd5c345b88c2a0733f17d92606591c7542862b",
  sequenceRevision: "9ed4d70a42084b8a88328ce6da316d86ef06502c",
  repository: "https://atomgit.com/openJiuwen/agent-solution",
  deliveries: {
    769: ["2026-10-06", "DeepAnalyze 团队模板库、运行时工具与事件推送"],
    840: ["2026-10-20", "新增 AgentOps 观测模块"],
    881: ["2026-10-25", "Python 运行时迭代，支持多智能体托管、并发和取消"],
    886: ["2026-10-27", "直连模式支持动态注册和下线，增强网关路由转发"],
    895: ["2026-10-27", "新增 TypeScript 智能体客户端"],
    933: ["2026-10-27", "知识工程的两个脚本执行入口共用执行核心"],
    957: ["2026-10-29", "修复 Studio DSL 多轮 dry run 对齐"],
    989: ["2026-10-30", "MOA 旅行示例改用直连 A2A"]
  },
  sequence: {
    title: "A2A 直连时序",
    references: [
      { id: "caller", label: "示例调用入口", path: "common/example/agent-gateway-demo/feat-011-direct/smoke.sh", line: 35, end_line: 38 },
      { id: "register", label: "运行时启动注册", path: "common/agent-runtime-ext-java/agent-service-app/direct-registry/src/main/java/com/openjiuwen/service/app/directregistry/registration/InstanceRegistrationWorker.java", line: 94, end_line: 110 },
      { id: "registerHttp", label: "注册 HTTP 请求", path: "common/agent-runtime-ext-java/agent-service-app/direct-registry/src/main/java/com/openjiuwen/service/app/directregistry/registration/UnifiedRegistryRegistrationClient.java", line: 75, end_line: 86 },
      { id: "dispatcher", label: "网关选择直连路径", path: "common/agent-bus/agent-gateway/src/main/java/com/openjiuwen/gateway/facade/A2aDispatcher.java", line: 203, end_line: 240 },
      { id: "router", label: "网关选实例并转发", path: "common/agent-bus/agent-gateway/src/main/java/com/openjiuwen/gateway/routing/Router.java", line: 74, end_line: 95 },
      { id: "forward", label: "网关向运行时发起 HTTP 请求", path: "common/agent-bus/agent-gateway/src/main/java/com/openjiuwen/gateway/direct/HttpAgentRuntimeClient.java", line: 44, end_line: 65 },
      { id: "registry", label: "注册中心接收登记", path: "common/agent-bus/registry-discovery-center/src/main/java/com/openjiuwen/rdc/api/v2/UnifiedRegistryV2Controller.java", line: 68, end_line: 80 },
      { id: "candidates", label: "注册中心查询候选", path: "common/agent-bus/registry-discovery-center/src/main/java/com/openjiuwen/rdc/api/v2/UnifiedRegistryV2Controller.java", line: 120, end_line: 126 },
      { id: "resolve", label: "注册中心解析实例地址", path: "common/agent-bus/registry-discovery-center/src/main/java/com/openjiuwen/rdc/core/DefaultRegistryFacade.java", line: 132, end_line: 149 }
    ],
    participants: [
      ["caller", "external", "调用方", "A2A 客户端", ["caller"]],
      ["gateway", "backend", "A2A 网关", "agent-gateway", ["dispatcher", "router", "forward"]],
      ["registry", "backend", "注册发现中心", "RDC", ["registry", "candidates", "resolve"]],
      ["runtime", "backend", "Java 运行时", "目标实例", ["register", "registerHttp"]]
    ],
    phases: [
      {
        title: "启用注册 · 运行时就绪后",
        messages: [
          ["runtime", "registry", "登记实例与 Agent Card", "emphasis"],
          ["registry", "runtime", "实例 ID 与心跳策略", "return"]
        ]
      },
      {
        title: "新建同步请求 · DIRECT",
        messages: [
          ["caller", "gateway", "POST /a2a · SendMessage", "emphasis"],
          ["gateway", "registry", "查询目标 Agent 的候选实例"],
          ["registry", "gateway", "返回候选及路由句柄", "return"],
          ["gateway", "registry", "选定实例后解析路由句柄"],
          ["registry", "gateway", "返回实例地址与接口路径", "return"],
          ["gateway", "runtime", "HTTP 转发原始 JSON-RPC", "emphasis"],
          ["runtime", "gateway", "返回 JSON-RPC 响应", "return"],
          ["gateway", "caller", "返回同步响应", "return"]
        ]
      }
    ]
  },
  groups: [
    {
      id: "connect",
      label: "接入与互联",
      modules: [
        {
          id: "agent-client", name: "智能体客户端",
          description: "提供在 JVM、Node.js 和浏览器中调用智能体的 SDK。",
          capabilities: ["流式、阻塞与异步调用", "事件消费、交互续接与客户端工具", "TypeScript 的 ESM、CommonJS 和类型声明"],
          prs: [895]
        },
        {
          id: "agent-bus", name: "网关与注册发现",
          description: "为智能体互联提供 A2A 网关、服务发现、路由和总线转发。",
          capabilities: ["A2A 网关及目标路由", "服务注册、发现与健康探测", "事件总线中转及请求响应传递", "注册服务共用的身份验证接口"],
          prs: [886]
        }
      ]
    },
    {
      id: "runtime",
      label: "框架与运行时",
      modules: [
        {
          id: "agent-core-ext-java", name: "Java 框架扩展",
          description: "将编排、意图、工具和执行控制等能力提供给业务侧按需使用。",
          capabilities: ["编排、意图识别与 Studio DSL", "多模态工具、工具护栏与沙箱", "上下文压缩与 ReAct 护栏", "模型调用成本计量"],
          prs: [769, 957]
        },
        {
          id: "agent-runtime-ext-java", name: "Java 运行时扩展",
          description: "为 Java Runtime 增加协议入口、智能体适配和工具接入能力。",
          capabilities: ["自定义 REST 入口与总线消费", "Versatile 出站适配与 AgentScope 进程内适配", "远端工具与客户端工具", "可选 Skill Hub 中间件"],
          prs: [886]
        },
        {
          id: "agent-runtime-ext-python", name: "Python 运行时扩展",
          description: "提供可嵌入宿主的托管 SDK、部署参考与迁移说明。",
          capabilities: ["自定义 REST 入口与本地 Agent 适配", "代理调用、客户端工具和调用链", "多智能体托管、并发调用与取消"],
          prs: [881]
        }
      ]
    },
    {
      id: "applications",
      label: "智能体与场景",
      modules: [
        {
          id: "agents", name: "智能体应用",
          description: "覆盖深度分析、规则驱动规划、多智能体编排、过程验证和深度调研。",
          capabilities: ["DeepAnalyze 深度分析与模板库", "EDP Agent 规则驱动的动态规划", "MOA 多智能体编排与 PEV 执行验证", "SmartResearch Alpha 深度调研"],
          prs: [769, 989]
        },
        {
          id: "example", name: "集成与场景示例",
          description: "提供 SDK、网关、运行时和 A2A 协作的集成与验证入口。",
          capabilities: ["客户端、网关、注册与路由示例", "运行时、A2A 协作与 Studio DSL 示例", "金融、旅行、研究等场景示范"],
          prs: [886]
        }
      ]
    },
    {
      id: "operations",
      label: "运行观测与技能优化",
      modules: [
        {
          id: "agent-ops", name: "运行观测",
          description: "将执行轨迹整理为可查询的链路、会话和指标。",
          capabilities: ["运行总览与 Trace、Span 查询", "会话回溯与链路详情", "模型、工具及检索分析"],
          prs: [840]
        },
        {
          id: "agent-evolve", name: "技能演进",
          description: "通过运行日志与对话反馈支持 Skill 优化。",
          capabilities: ["对话驱动的 Skill 优化与结果报告", "EDP Agent 日志增量采集", "结构化 HTTP 查询与配套工具"],
          prs: []
        }
      ]
    },
    {
      id: "knowledge-data",
      label: "知识工程与数据治理",
      other: true,
      modules: [
        {
          id: "knowledge-scaffold", name: "知识工程",
          description: "把领域对象、规则、数据映射与脚本组织成可消费的知识包。",
          capabilities: ["知识包管理与知识消费", "知识驱动的查询、推理和计算", "脚本执行插件与统一鉴权"],
          prs: [933]
        },
        {
          id: "data-ai", name: "数据治理",
          description: "支持对话式数据处理、多智能体协作和数据治理流程。",
          capabilities: ["对话式处理与多智能体协作", "数据源、连接器与元数据", "算子、流程编排和调度"],
          prs: []
        }
      ]
    }
  ]
};
