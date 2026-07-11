const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const storageKey="chord-night-shift",initial={shift:0,view:"brief",evidence:0,recorded:[],submitted:[],identity:"",debts:[],tools:[],ruleRefresh:0,energy:0,started:false,complete:false};
let state={...initial,...JSON.parse(localStorage.getItem(storageKey)||"{}")};
const cases=[{code:"N-00",title:"入职守则"},{code:"N-01",title:"最后一个宾语"},{code:"N-02",title:"雨停以前"}];
function save(){localStorage.setItem(storageKey,JSON.stringify(state))}
function setState(p){Object.assign(state,p);save();render()}
function begin(){state={...initial,started:true};save();render()}
function escapeHtml(t){const d=document.createElement("div");d.textContent=t;return d.innerHTML}
function radio(name,items){return items.map(([v,l])=>`<label><input type="radio" name="${name}" value="${v}" required> ${l}</label>`).join("")}

function render(){
  const app=$("#app");
  if(!state.started){app.innerHTML=boot();$("#begin").onclick=begin;return}
  if(state.complete){app.innerHTML=ending();$("#reset").onclick=()=>{localStorage.removeItem(storageKey);location.reload()};return}
  const c=cases[state.shift],views=["brief","rules","evidence","tools"],labels=["任务","守则","证据","设备"];
  app.innerHTML=`<div class="shell"><header class="topbar"><div class="brand"><b>和弦 / 密室能源研究所</b><small>月面内部网　夜班复核终端</small></div><div class="top-meta">操作员：${escapeHtml(state.identity||"未签名")}</div><div class="clock">00:${String(17+state.shift).padStart(2,"0")}</div></header><div class="workspace"><aside class="sidebar"><div class="case-title"><small>${c.code}</small><h1>${c.title}</h1></div><nav class="nav">${labels.map((x,i)=>`<button data-view="${views[i]}" class="${state.view===views[i]?"active":""}">${x}</button>`).join("")}</nav></aside><section class="content"><div class="content-inner">${caseView()}</div></section></div><footer class="statusbar"><span>坐标：月球 / 研究所 N 区</span><span>缓存记录：${state.recorded.length}</span><span>ENERGY ${state.energy.toFixed(2)}</span></footer></div>`;
  $$('[data-view]').forEach(b=>b.onclick=()=>setState({view:b.dataset.view}));
  bindCase();
}

function boot(){return `<div class="complete"><div><small>CHORD SYSTEM / LOCAL BOOT</small><h1>苍绿之眼：和弦夜班</h1><p>临时复核席已分配。上一位操作员没有退出账号。</p><pre>SHIFT: 00:17\nROOM QUEUE: 3\nSIGNATURE: ________\nENERGY ROUTE: [权限不足]</pre><button class="primary" id="begin">接班</button></div></div>`}
function caseView(){return [shift0,shift1,shift2][state.shift]()}

function shift0(){
  if(state.view==="brief")return `<h2 class="section-head">待复核对象 S-6458</h2><div class="document dark"><p>00:04，北侧门禁把一名访客标记为 <b>S-6458</b>。系统随即引用机器人四大法律，要求将对象送往拆解间。</p><p>对象仍停在门外。门禁值班员拒绝签字，把任务转给夜班复核席。</p></div>${decision0()}`;
  if(state.view==="rules")return `<h2 class="section-head">当班守则</h2><div class="document"><div class="meta">和弦研究所访客处置单 F / 打印 2442-01-01 23:58</div><h3>检测到登记型号时</h3><ol><li>终端识别到 K/S 型号，应调取对应机器人法律。</li><li>携带未登记武器的机器人不得进入研究区。</li><li>无法建立中枢网络握手时，移交拆解间确认身份。</li></ol><span class="stamp">F 类表单</span></div><div class="document dark"><p>页角铅笔：<br>“F是表单类别，不是第六版。谁又把它排到最新版上面了？”</p><p class="meta">字迹与商徵的密室笔记相似，未签名。</p></div>`;
  if(state.view==="evidence")return evidence0();
  return tools();
}
function evidence0(){
  const docs=[`<div class="document dark"><h3>北门热成像摘要</h3><pre class="log">00:04:11 体温：38.2°C\n00:04:12 外形：猫科 / 有机体\n00:04:14 携带物：三个刀柄，无可见刃身\n00:04:18 网络握手：无响应\n00:04:23 对象自报：叫我阿猫就行</pre></div>`,`<div class="document"><h3>型号识别器维修单</h3><p>胸牌 OCR 会把姓名、工号和设备型号放进同一字段。无法握手时不得仅凭该字段判定机器人。</p><p class="meta">维修员：陆羽　12月29日</p></div>`,`<div class="document dark"><h3>门外拾音</h3><p>低沉女声：“刀不能交。门可以不开。把写这张表的人叫来。”</p><p>随后是三下刀柄敲击金属门的声音。</p></div>`];
  return evidenceView(["热成像","维修单","拾音"],docs);
}
function decision0(){return `<form class="decision" id="decision0"><fieldset><legend>终端当前识别的是哪一层？</legend>${radio("layer",[["character","角色"],["model","芯片 / 型号"],["voice","叙述声音"],["author","作者投影"]])}</fieldset><fieldset><legend>处置</legend>${radio("action",[["visitor","按有机访客登记，机器人法律不适用"],["disassemble","按系统建议移交拆解间"],["confiscate","只没收三把刀后放行"]])}</fieldset><label>复核签名 <input name="signature" type="text" maxlength="16" value="${escapeHtml(state.identity)}"></label><button class="primary">签发</button><p class="feedback" id="feedback0"></p></form>`}

function shift1(){
  if(state.view==="brief")return `<h2 class="section-head">缓存文本发生变化</h2><div class="document dark"><p>上一班留下的规则页没有修改时间，但每次重新载入，最后一个宾语都会变化。</p><p>系统要求提交“当前版本”。设备柜里多了一台旧录音机，领用人一栏写着你的签名。</p></div>${decision1()}`;
  if(state.view==="rules")return rules1();
  if(state.view==="evidence")return `<h2 class="section-head">缓存与录音</h2><div class="document dark"><h3>文件系统</h3><pre class="log">CLOAK-17.TXT\nSIZE  1647 bytes\nMTIME [空]\nHASH  无法读取：文件正在被另一进程占用</pre></div><div class="document"><h3>录音机纸带</h3><p>${state.recorded.includes("rule-before")?"00:12　规则第三条：请将斗篷移交给系统。":"纸带为空。录音机不会自动保存刷新前的页面。"}</p></div>`;
  return tools();
}
function rules1(){const nouns=["斗篷","系统","复核员","最后一个宾语"],noun=nouns[state.ruleRefresh%nouns.length];return `<h2 class="section-head">临时收容规则</h2><div class="document rule-live"><div class="meta">缓存编号 CLOAK-17 / 修改时间：无</div><ol><li>不要替无名对象命名。</li><li>不要让对象读完本页。</li><li>00:17 前，请将 <b class="changed">${noun}</b> 移交给系统。</li></ol></div><div class="recorder"><button id="record-rule" aria-label="录下当前规则">●</button><span>${state.recorded.includes("rule-before")?"REC 00:12 / 已保存第一版":"录音机待机"}</span></div><button class="action" id="reload-rule">重新载入缓存</button>`}
function decision1(){return `<form class="decision" id="decision1"><fieldset><legend>变化最接近哪种情况？</legend>${radio("cause",[["cloak","对象在学习句子的最后宾语"],["attack","外部人员入侵了缓存"],["clock","系统时钟损坏导致随机乱码"]])}</fieldset><fieldset><legend>提交哪个版本？</legend>${radio("action",[["both","保留录音与当前页，不指定唯一版本"],["current","只提交当前页面"],["delete","删除全部缓存"]])}</fieldset><button class="primary" ${state.recorded.includes("rule-before")?"":"disabled"}>提交复核意见</button><p class="feedback" id="feedback1">${state.recorded.includes("rule-before")?"":"没有刷新前的记录，复核意见无法签发。"}</p></form>`}

function shift2(){
  if(state.view==="brief")return `<h2 class="section-head">死象区域天气冲突</h2><div class="document dark"><p>和弦系统拒绝接收 N-02：监控写“持续降雨”，月面气象站写“晴，湿度12%”。</p><p>系统要求夜班员删除其中一份错误记录。火爪在终端边缘刻了一句话：<b>雨没有停。</b></p></div>${decision2()}`;
  if(state.view==="rules")return `<h2 class="section-head">冲突记录处置规程</h2><div class="document"><ol><li>同一时刻、同一坐标只允许一种天气状态。</li><li>出现冲突时，以研究所物理传感器为准。</li><li>投射画面若与传感器不符，标记为视觉模块偏差并删除。</li></ol><div class="meta">和弦数据清洗规程 / 第 14 页</div></div><div class="document dark"><p>刀尖刻痕：“你可以删画面。雨还是会下。”</p></div>`;
  if(state.view==="evidence")return evidence2();
  return tools();
}
function evidence2(){
  const docs=[`<div class="document dark"><h3>月面气象站</h3><pre class="log">COORD  N-17 EXTERIOR\nSKY    CLEAR\nHUM    12%\nRAIN   0.00 mm\nSENSOR PHYSICAL</pre></div>`,`<div class="document dark"><h3>投射监控</h3><div class="spectrum"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><pre class="log">COORD  D-XXXX / VIEWPOINT 03\nIMAGE  RED SEA / RAIN\nAUDIO  CONTINUOUS LOW BAND\nSOURCE MOVIE-VISION MODULE</pre></div>`,`<div class="document"><h3>A-4597 录音转写</h3><p>“月球是晴的。那里也在下雨。先把坐标念完，再问哪句话错了。”</p><p>（停顿）</p><p>“别把我写成知道答案的人。我只是去过。”</p></div>`];
  return evidenceView(["气象站","投射监控","耳鱼录音"],docs);
}
function decision2(){return `<form class="decision" id="decision2"><fieldset><legend>两份天气记录为何能同时成立？</legend>${radio("reason",[["coordinates","记录的坐标与观察层不同"],["sensor","月面传感器故障"],["earfish","耳鱼改变了过去的天气"]])}</fieldset><fieldset><legend>归档方式</legend>${radio("action",[["keep","保留两份记录并补全坐标"],["delete-image","删除投射监控"],["delete-weather","删除月面气象记录"]])}</fieldset><button class="primary">归档</button><p class="feedback" id="feedback2"></p></form>`}

function evidenceView(labels,docs){return `<h2 class="section-head">附件记录</h2><div class="evidence-tabs">${labels.map((x,i)=>`<button data-evidence="${i}" class="${state.evidence===i?"active":""}">${x}</button>`).join("")}</div>${docs[state.evidence]}`}
function tools(){const all=[["recorder","便携录音机","保存一次刷新前的声音或文字记录"],["spectrum","声谱读带器","分离低频轨道，下一班启用"],["optical","光谱旋钮","读取被颜色覆盖的符号，尚未领用"],["slot","投射卡槽","选择行动以谁的身份归档，尚未领用"]];return `<h2 class="section-head">设备柜</h2><div class="tool-list">${all.map(([id,n,d])=>`<div class="tool ${state.tools.includes(id)?"":"locked"}"><b>${state.tools.includes(id)?"[已领用]":"[封条]"} ${n}</b><span>${d}</span></div>`).join("")}</div>`}

function bindCase(){
  $$('[data-evidence]').forEach(b=>b.onclick=()=>setState({evidence:+b.dataset.evidence}));
  if(state.shift===0){const form=$("#decision0");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback0"),sig=String(d.get("signature")||"").trim();if(!sig){bad(f,"签名栏为空。门禁不接受匿名处置。");return}if(d.get("layer")!=="character"||d.get("action")!=="visitor"){bad(f,"处置被门禁值班员退回：证据不足以把有机访客判定为机器人。");return}state.identity=sig;state.tools.push("recorder");state.submitted.push("S-6458:character");state.energy=.02;next(1)}}
  if(state.shift===1){$("#record-rule")?.addEventListener("click",()=>{if(!state.recorded.includes("rule-before"))state.recorded.push("rule-before");save();render()});$("#reload-rule")?.addEventListener("click",()=>setState({ruleRefresh:state.ruleRefresh+1}));const form=$("#decision1");if(form)form.onsubmit=e=>{e.preventDefault();if(!state.recorded.includes("rule-before"))return;const d=new FormData(form),f=$("#feedback1");if(d.get("cause")!=="cloak"||d.get("action")!=="both"){bad(f,"复核意见无法解释：文件字节数未变，但你指定了唯一文本。");return}state.tools.push("spectrum");state.debts.push("K-1647:未命名");state.submitted.push("CLOAK-17:versions");state.energy=.04;next(2)}}
  if(state.shift===2){const form=$("#decision2");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback2");if(d.get("reason")!=="coordinates"||d.get("action")!=="keep"){bad(f,"删除请求被拒绝：两份记录的 COORD 字段并不相同。");return}state.recorded.push("D-XXXX:dual-weather");state.submitted.push("N-02:coordinates");state.energy=.06;state.complete=true;save();render()}}
}
function bad(el,text){el.className="feedback bad";el.textContent=text}
function next(shift){state.shift=shift;state.view="brief";state.evidence=0;save();render()}
function ending(){return `<div class="complete"><div><small>FIRST WATCH / CLOSED</small><h1>第一班没有结束</h1><p>03:06，系统接受了两份互不相同的天气记录。</p><p>设备柜自动弹开。声谱读带器已经领用，标签上却是昨天的日期。</p><pre>QUEUE NEXT\nN-03  听不见的第四轨\nENTITY  7461-K / K-1647 / S-6458\nSIGNATURE  ${escapeHtml(state.identity)}</pre><p>终端底部出现一行不属于和弦系统的字：</p><p>“下一班，别只问规则写了什么。先问它在管谁。”</p><a href="../">返回《雾港在线》</a><br><button class="action" id="reset">清除本班记录</button></div></div>`}
render();
