(() => {
  const panel = document.querySelector("#sig-calendar");
  const grid = panel.querySelector("[data-sig-days]");
  const monthTitle = panel.querySelector("[data-sig-month]");
  const activities = panel.querySelector("[data-sig-activities]");
  const activitiesTitle = panel.querySelector("[data-sig-activities-title]");
  const range = panel.querySelector("[data-sig-range]");
  const clearDay = panel.querySelector("[data-sig-clear]");
  const pagination = panel.querySelector("[data-sig-pagination]");
  const previousPage = panel.querySelector("[data-sig-previous-page]");
  const nextPage = panel.querySelector("[data-sig-next-page]");
  const pageLabel = panel.querySelector("[data-sig-page-label]");
  const pageSize = 5;
  const months = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];

  // Meeting dates and agendas from sig_html/calendar.js.
  const records = [
    {
      "month": "2026-11",
      "date": "2026-12-02",
      "time": "下午",
      "status": "待开始",
      "agenda": [
        "议题一：Agent Solution仓1130版本发布宣讲（付英杰） --- 20min",
        "议题二：智能体特性平台化建设相关内容（陶奕） --- 40min",
        "议题三：Agent Solution新特性解读及demo演示（袁作松） --- 40min",
        "议题四：智能体平台网关协议及应用（尤国庆） --- 30min",
        "议题五：开放讨论"
      ]
    },
    {
      "month": "2026-10",
      "date": "2026-10-28",
      "status": "已结束",
      "platform": "线下会议（练秋湖B4-3-18R）& welink线上",
      "meetingId": "99121984（welink客户端接入需输会议密码：203658）",
      "link": "https://app.huawei.com/wmeeting/join/99121984/mTY15AoqX45tTU8Ew0fQtAAcMYeXakeht",
      "agenda": [
        "议题一：Agent Solution仓1030版本发布宣讲",
        "议题二：电力行业SIG成立申请",
        "议题三：AI 原生钢厂建设思路介绍",
        "议题四：冶金行业SIG成立申请",
        "议题五：开放讨论"
      ]
    },
    {
      "month": "2026-09",
      "date": "2026-09-30",
      "title": "OpenJiuwen Agent Solution 九月SIG会议",
      "status": "已结束",
      "platform": "welink线上",
      "meetingId": "94182955（welink客户端接入需输会议密码：704281）",
      "link": "https://app.huawei.com/wmeeting/join/94182955/wWlUutXxsOcuNPxFTgGFJ1nS31mHNWUwh",
      "agenda": [
        "议题一：Agent Solution仓930版本发布宣讲",
        "议题二：openJiuwen开发范式宣讲",
        "议题三：开放讨论"
      ]
    },
    {
      "month": "2026-08",
      "date": "2026-08-26",
      "title": "OpenJiuwen Agent Solution 八月SIG会议",
      "status": "已结束",
      "platform": "welink线上",
      "meetingId": "96825204（welink客户端接入需输会议密码：881330）",
      "link": "https://app.huawei.com/wmeeting/join/96825204/f2CRXVqp6Y86Ij16eP5I0hsBTdEsrrgXt",
      "agenda": [
        "议题一：Agent Solution仓830版本发布评审",
        "议题二：智能体架构H2规划",
        "议题三：研讨议题：行业SIG筹备讨论",
        "议题四：开放讨论"
      ]
    },
    {
      "month": "2026-07",
      "date": "2026-07-22",
      "title": "OpenJiuwen Agent Solution 七月SIG会议",
      "status": "已结束",
      "platform": "线下会议（练秋湖B4-3-18R）& welink线上",
      "meetingId": "95272456（welink客户端接入需输会议密码：693961）",
      "link": "https://app.huawei.com/wmeeting/join/95272456/KbEGsZWVHHICwbWSulH5BZz0M5EyXAzX9",
      "agenda": [
        "议题一：Openjiuwen的平台能力规划和进展宣讲",
        "议题二：社区管理与方向性决策（SIG运作机制宣讲）",
        "议题三：金融实战案例分享",
        "议题四：开放讨论"
      ]
    }
  ];
  const recordedMonths = new Set(records.map(event => event.month));
  const localDate = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
  });
  const dateParts = Object.fromEntries(localDate.formatToParts(new Date()).map(part => [part.type, part.value]));
  const today = [dateParts.year, dateParts.month, dateParts.day].join("-");
  const upcoming = records.filter(event => event.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
  const [year, month] = (upcoming?.date ?? today).split("-").map(Number);
  let currentMonth = new Date(Date.UTC(year, month - 1, 1));
  let selectedDay = null;
  let page = 1;

  const isoDate = date => date.toISOString().slice(0, 10);

  function add(parent, type, name, content) {
    const item = document.createElement(type);
    if (name) item.className = name;
    if (content !== undefined) item.textContent = content;
    parent.append(item);
    return item;
  }

  function shiftMonth(date, offset) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));
  }

  function monthEvents(date) {
    const monthKey = isoDate(date).slice(0, 7);
    const events = records.filter(event => event.date.startsWith(monthKey + "-"));
    // Last-Wednesday convention from the source calendar, marked provisional.
    if (!recordedMonths.has(monthKey) && monthKey >= today.slice(0, 7)) {
      const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
      end.setUTCDate(end.getUTCDate() - (end.getUTCDay() + 4) % 7);
      const scheduled = isoDate(end);
      if (scheduled >= today) events.push({ month: monthKey, date: scheduled, tentative: true });
    }
    return events.sort((a, b) => a.date.localeCompare(b.date));
  }

  function dayName(date) {
    const [y, m, d] = date.split("-").map(Number);
    return y + " 年 " + m + " 月 " + d + " 日";
  }

  function renderCalendar() {
    const y = currentMonth.getUTCFullYear();
    const m = currentMonth.getUTCMonth();
    monthTitle.textContent = y + " 年 " + (m + 1) + " 月";
    const meetings = new Map(monthEvents(currentMonth).map(event => [event.date, event]));
    const days = document.createDocumentFragment();
    for (let index = 0; index < 42; index++) {
      const day = new Date(Date.UTC(y, m, 1 - currentMonth.getUTCDay() + index));
      const number = String(day.getUTCDate());
      if (day.getUTCMonth() !== m) {
        add(days, "span", "sig-adjacent-date", number).setAttribute("aria-hidden", "true");
        continue;
      }
      const date = isoDate(day);
      const event = meetings.get(date);
      const button = add(days, "button", "sig-date", number);
      button.type = "button";
      button.dataset.date = date;
      button.setAttribute("aria-label", dayName(date) + (event ? event.tentative ? "，待确认例会" : "，SIG 会议" : ""));
      button.setAttribute("aria-pressed", String(date === selectedDay));
      if (date === today) button.setAttribute("aria-current", "date");
      if (event) button.dataset.meeting = event.tentative ? "tentative" : "confirmed";
    }
    grid.replaceChildren(days);
  }

  function renderActivity(parent, event) {
    const article = add(parent, "article", "sig-event");
    const meta = add(article, "div", "sig-event-meta");
    const time = add(meta, "time", "", event.date + (event.time ? " " + event.time : ""));
    time.dateTime = event.date;
    const status = event.tentative ? "待确认" : event.status ?? (event.date < today ? "已结束" : "待开始");
    add(meta, "span", "sig-event-status", status).dataset.status = status;
    const monthLabel = months[Number(event.month.slice(5)) - 1];
    const title = event.title ?? ("openJiuwen Agent Solution " + monthLabel + "月SIG会议");
    add(article, "h5", "sig-event-title", title);

    const details = add(article, "details", "sig-event-details");
    add(details, "summary", "", "查看会议详情");
    const fields = add(details, "dl", "sig-event-fields");
    function field(label, value) {
      const row = add(fields, "div");
      add(row, "dt", "", label);
      return add(row, "dd", "", value);
    }

    field("名称", title);
    field("状态", status);
    field("平台", event.platform || "待公布");
    field("会议ID", event.meetingId || "待公布");
    const joinUrl = event.link?.startsWith("https://") ? event.link : null;
    const linkField = field("参会链接", joinUrl ? undefined : "待公布");
    if (joinUrl) {
      const link = add(linkField, "a", "sig-event-link", joinUrl);
      link.href = joinUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    const agenda = field("议题信息", event.agenda?.length ? undefined : "待公布");
    if (event.agenda?.length) {
      const list = add(agenda, "ul", "sig-event-agenda");
      event.agenda.forEach(item => add(list, "li", "", item));
    }
  }

  function renderActivities() {
    const meetings = selectedDay
      ? monthEvents(currentMonth).filter(event => event.date === selectedDay)
      : Array.from({ length: Number(range.value) }, (_, offset) => monthEvents(shiftMonth(currentMonth, -offset))).flat();
    const pages = Math.max(1, Math.ceil(meetings.length / pageSize));
    activitiesTitle.textContent = selectedDay ? dayName(selectedDay) + "活动" : "近期活动";
    range.hidden = Boolean(selectedDay);
    clearDay.hidden = !selectedDay;
    const items = document.createDocumentFragment();
    if (meetings.length) {
      for (const event of meetings.slice((page - 1) * pageSize, page * pageSize)) renderActivity(items, event);
    } else {
      add(items, "p", "sig-empty", selectedDay ? "当日暂无会议安排" : "所选时间范围暂无会议记录");
    }
    activities.replaceChildren(items);
    pagination.hidden = pages === 1;
    previousPage.disabled = page === 1;
    nextPage.disabled = page === pages;
    pageLabel.textContent = page + " / " + pages;
  }

  function changeMonth(offset) {
    currentMonth = shiftMonth(currentMonth, offset);
    selectedDay = null;
    page = 1;
    renderCalendar();
    renderActivities();
  }

  function selectDay(date) {
    selectedDay = date;
    page = 1;
    for (const button of grid.querySelectorAll("[data-date]")) {
      button.setAttribute("aria-pressed", String(button.dataset.date === date));
    }
    renderActivities();
  }

  panel.querySelector("[data-sig-previous-month]").addEventListener("click", () => changeMonth(-1));
  panel.querySelector("[data-sig-next-month]").addEventListener("click", () => changeMonth(1));
  grid.addEventListener("click", event => {
    const date = event.target.closest("[data-date]")?.dataset.date;
    if (date) selectDay(date === selectedDay ? null : date);
  });
  clearDay.addEventListener("click", () => {
    const previous = grid.querySelector('[data-date="' + selectedDay + '"]');
    selectDay(null);
    previous?.focus({ preventScroll: true });
  });
  range.addEventListener("change", () => {
    page = 1;
    renderActivities();
  });
  previousPage.addEventListener("click", () => {
    page--;
    renderActivities();
  });
  nextPage.addEventListener("click", () => {
    page++;
    renderActivities();
  });
  renderCalendar();
  renderActivities();
  panel.querySelector(".sig-calendar-layout").hidden = false;
})();
