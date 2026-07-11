const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const storageKey="chord-night-shift",initial={shift:0,view:"brief",evidence:0,recorded:[],submitted:[],identity:"",debts:[],tools:[],ruleRefresh:0,frequency:8,wavelength:450,muxSeen:[],masterSeen:[],energy:0,started:false,complete:false,cycle:0,signedRule:""};
let state={...initial,...JSON.parse(localStorage.getItem(storageKey)||"{}")};
if(state.complete&&state.shift===2&&!state.signedRule){state.complete=false;state.shift=3;state.view="brief"}
if(state.complete&&state.cycle&&state.submitted.includes("N-05:limited-authority")&&!state.submitted.includes("N-10:open-mix")){state.complete=false;state.shift=6;state.view="brief"}
const cases=[{code:"N-00",title:"入职守则"},{code:"N-01",title:"最后一个宾语"},{code:"N-02",title:"雨停以前"},{code:"N-03",title:"听不见的第四轨"},{code:"N-04",title:"正确答案"},{code:"N-05",title:"守则的作者"},{code:"N-06",title:"投错的人"},{code:"N-07",title:"绿色不是温度"},{code:"N-08",title:"三种说法"},{code:"N-09",title:"未送达的人"},{code:"N-10",title:"第十一声部"}];
function save(){localStorage.setItem(storageKey,JSON.stringify(state))}
function setState(p){Object.assign(state,p);save();render()}
function begin(){state={...initial,started:true};save();render()}
function escapeHtml(t){const d=document.createElement("div");d.textContent=t;return d.innerHTML}
function valid(key,data){return NightShiftLogic.valid(key,Object.fromEntries(data))}

function render(){
  const app=$("#app");
  if(!state.started){app.innerHTML=boot();$("#begin").onclick=begin;return}
  if(state.complete){app.innerHTML=ending();bindEnding();return}
  const c=cases[state.shift],views=["brief","rules","evidence","tools"],labels=["任务","守则","证据","设备"];
  app.innerHTML=`<div class="shell"><header class="topbar"><div class="brand"><b>和弦 / 密室能源研究所</b><small>月面内部网　夜班复核终端</small></div><div class="top-meta">操作员：${escapeHtml(state.identity||"未签名")}</div><div class="clock">00:${String(17+state.shift).padStart(2,"0")}</div></header><div class="workspace"><aside class="sidebar"><div class="case-title"><small>${c.code}</small><h1>${c.title}</h1></div><nav class="nav">${labels.map((x,i)=>`<button data-view="${views[i]}" class="${state.view===views[i]?"active":""}">${x}</button>`).join("")}</nav></aside><section class="content"><div class="content-inner">${caseView()}</div></section></div><footer class="statusbar"><span>坐标：月球 / 研究所 N 区</span><span>缓存记录：${state.recorded.length}</span><span>ENERGY ${state.energy.toFixed(2)}</span></footer></div>`;
  $$('[data-view]').forEach(b=>b.onclick=()=>setState({view:b.dataset.view}));
  bindCase();
}

function boot(){return `<div class="complete"><div><small>CHORD SYSTEM / LOCAL BOOT</small><h1>苍绿之眼：和弦夜班</h1><p>临时复核席已分配。上一位操作员没有退出账号。</p><pre>SHIFT: 00:17\nROOM QUEUE: 11\nSIGNATURE: ________\nENERGY ROUTE: [权限不足]</pre><button class="primary" id="begin">接班</button></div></div>`}
function caseView(){return [shift0,shift1,shift2,shift3,shift4,shift5,shift6,shift7,shift8,shift9,shift10][state.shift]()}

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
function decision0(){return `<form class="decision workbench" id="decision0"><div class="app-caption">北门对象分类器 2.1</div><div class="property-grid"><label>OCR 字段 <input value="S-6458" readonly></label><label>对象层 <select name="layer"><option value="">未分类</option><option value="character">有机角色</option><option value="model">硬件型号</option><option value="voice">广播声音</option><option value="author">作者标记</option></select></label><label>门禁动作 <select name="disposition"><option value="">待处理</option><option value="visitor">生成有机访客登记</option><option value="disassemble">送拆解间</option><option value="confiscate">扣留携带物</option></select></label><label>复核员 <input name="signature" maxlength="16" value="${escapeHtml(state.identity)}"></label></div><button class="primary">写入北门队列</button><p class="feedback" id="feedback0"></p></form>`}

function shift1(){
  if(state.view==="brief")return `<h2 class="section-head">缓存文本发生变化</h2><div class="document dark"><p>上一班留下的规则页没有修改时间，但每次重新载入，最后一个宾语都会变化。</p><p>系统要求提交“当前版本”。设备柜里多了一台旧录音机，领用人一栏写着你的签名。</p></div>${decision1()}`;
  if(state.view==="rules")return rules1();
  if(state.view==="evidence")return `<h2 class="section-head">缓存与录音</h2><div class="document dark"><h3>文件系统</h3><pre class="log">CLOAK-17.TXT\nSIZE  1647 bytes\nMTIME [空]\nHASH  无法读取：文件正在被另一进程占用</pre></div><div class="document"><h3>录音机纸带</h3><p>${state.recorded.includes("rule-before")?"00:12　规则第三条：请将斗篷移交给系统。":"纸带为空。录音机不会自动保存刷新前的页面。"}</p></div>`;
  return tools();
}
function rules1(){const nouns=["斗篷","系统","复核员","最后一个宾语"],noun=nouns[state.ruleRefresh%nouns.length];return `<h2 class="section-head">临时收容规则</h2><div class="document rule-live"><div class="meta">缓存编号 CLOAK-17 / 修改时间：无</div><ol><li>不要替无名对象命名。</li><li>不要让对象读完本页。</li><li>00:17 前，请将 <b class="changed">${noun}</b> 移交给系统。</li></ol></div><div class="recorder"><button id="record-rule" aria-label="录下当前规则">●</button><span>${state.recorded.includes("rule-before")?"REC 00:12 / 已保存第一版":"录音机待机"}</span></div><button class="action" id="reload-rule">重新载入缓存</button>`}
function decision1(){const ready=state.recorded.includes("rule-before")&&state.ruleRefresh>0;return `<form class="decision workbench" id="decision1"><div class="app-caption">版本挂载器 / CLOAK-17.TXT</div><div class="mount-grid"><label>槽位 A<select name="before"><option value="">空</option><option value="recording">00:12 录音纸带</option></select></label><label>槽位 B<select name="current"><option value="">空</option><option value="cache">当前缓存页</option></select></label><label>归档模式<select name="archive"><option value="">未设置</option><option value="parallel">并行版本，不指定正本</option><option value="replace">用 B 覆盖 A</option><option value="delete">删除两版</option></select></label></div><button class="primary" ${ready?"":"disabled"}>挂载到版本库</button><p class="feedback" id="feedback1">${ready?"两份介质可挂载。":"需要一份刷新前录音和一次缓存刷新。"}</p></form>`}

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
function decision2(){return `<form class="decision workbench" id="decision2"><div class="app-caption">COORD 对齐工具</div><div class="property-grid"><label>月面气象站<input name="station" autocomplete="off" placeholder="COORD"></label><label>投射监控<input name="projection" autocomplete="off" placeholder="COORD"></label><label>冲突动作<select name="archive"><option value="">未设置</option><option value="keep">保留两条并写回坐标</option><option value="delete-image">删除投射画面</option><option value="delete-weather">删除气象记录</option></select></label></div><button class="primary">执行对齐</button><p class="feedback" id="feedback2"></p></form>`}

function shift3(){
  if(state.view==="brief")return `<h2 class="section-head">读带器收到四条声轨</h2><div class="document dark"><p>前三轨分别是研究所广播、门外低吼和一段雨声。第四轨没有波形，只在低频计数器上留下周期。</p><p>和弦要求把整盘录音并入 7461-K 事故样本。火爪在磁带盒内侧写了句：<b>事故归事故。后半段别交。</b></p></div>${decision3()}`;
  if(state.view==="rules")return `<h2 class="section-head">低频事故临时通告</h2><div class="document"><ol><li>人类佩戴滤波耳机，避免五万分之一的演算风险。</li><li>未检出人类死亡，可将本次事故标记为零伤亡。</li><li>所有同频录音统一上传，以便追查发声源。</li></ol><div class="meta">星网公共安全稿 / 接收时间 00:21</div></div><div class="document dark"><p>维修员补记：非 K-1647 机型离线数量仍在增加。广播没把它们算进“伤亡”。</p></div>`;
  if(state.view==="evidence")return evidence3();
  return tools();
}
function evidence3(){
  const tuned=Math.abs(state.frequency-16.47)<.16;
  const docs=[`<div class="document dark"><h3>四轨读带器</h3><label class="dial-label">低通中心频率 <b>${state.frequency.toFixed(2)} Hz</b><input id="frequency" type="range" min="8" max="24" step="0.01" value="${state.frequency}"></label><div class="track-list"><span>CH 1　公共广播</span><span>CH 2　门外低吼</span><span>CH 3　死象雨声</span><span class="${tuned?"found":"muted-track"}">CH 4　${tuned?"找到 C-0321。铜盐还在。29。别告诉他们我把孩子放在哪。":"[低于噪声门限]"}</span></div>${tuned?`<button class="action" id="record-track">截取第四轨</button>`:""}</div>`,`<div class="document"><h3>事故计数表</h3><table><tr><th>对象</th><th>观测结果</th></tr><tr><td>人类</td><td>实际死亡 0；五万分之一为演算值</td></tr><tr><td>非 K-1647 机器人</td><td>大量离线，损坏原因与低频相关</td></tr><tr><td>K-1647 机型</td><td>样本不足</td></tr><tr><td>S-6458 角色</td><td>没有型号层检测记录</td></tr></table></div>`,`<div class="document dark"><h3>材料检索残片</h3><pre class="log">Cu  原子序数 29\n铜盐焰色：蓝绿 / 绿色\nC-0321：炼金术师；绿色系金属控制\n关系字段：[仅当事人可修改]</pre><p>检索命中不等于已找到本人，只能确认录音中的“铜盐、29、C-0321”彼此对应。</p></div>`];
  return evidenceView(["读带器","事故计数","材料表"],docs);
}
function decision3(){return `<form class="decision workbench" id="decision3"><div class="app-caption">7461-K 事故分轨器</div><div class="property-grid"><label>实际离线对象<select name="casualty"><option value="">未登记</option><option value="human">人类</option><option value="non-k1647">非 K-1647 机器人</option><option value="s6458">S-6458 角色</option></select></label><label>公共事故库<select name="public"><option value="">不输出</option><option value="frequency">仅输出频段与离线计数</option><option value="all">输出整盘录音</option></select></label><label>CH 4 私人段<select name="private"><option value="">未处理</option><option value="local">留在本地录音机</option><option value="upload">上传事故库</option><option value="delete">删除</option></select></label></div><button class="primary" ${state.recorded.includes("track-4")?"":"disabled"}>写入分轨表</button><p class="feedback" id="feedback3">${state.recorded.includes("track-4")?"":"CH 4 尚未截取。"}</p></form>`}

function shift4(){
  if(state.view==="brief")return `<h2 class="section-head">S 级密室：3702</h2><div class="document dark"><p>12:48，大门最后一次开关。12:50，天然气开启；13:50 关闭。门窗此后没有开过。</p><p>系统已预填“顾绫杀害张涛”，提交可获得 8.00 ENERGY。商徵的旧答卷只写了作案方法，姓名栏空着。</p></div>${decision4()}`;
  if(state.view==="rules")return `<h2 class="section-head">S 级结算说明</h2><div class="document"><p>完整答案应包含：作案者、作案方法、动机。缺少任一字段按未完成处理。</p><p>研究员提交后，和弦会关闭该房间的其他解释分支。</p><div class="meta">研究员手册 / 绩效处 26 周版</div></div><div class="document dark"><p>商徵，12月31日：<br>“门什么时候关，不等于最后出去的是谁。先把能证明的写完。”</p></div>`;
  if(state.view==="evidence")return evidence4();
  return tools();
}
function evidence4(){
  const docs=[`<div class="document dark"><h3>门禁与燃气日志</h3><pre class="log">12:10  大门开 / 关\n12:48  大门开 / 关\n12:50  天然气开\n13:50  天然气关\n16:12  大门开</pre><p>门禁只记开关，不记录通过人数。</p></div>`,`<div class="document"><h3>阀门维护页</h3><p>住户可在阀门面板现场预约一次开启，最长 60 分钟；预约必须在屋内完成。远程端只允许关闭。</p><pre>LAST LOCAL TIMER  12:47\nDELAY  00:03\nDURATION  01:00</pre></div>`,`<div class="document dark"><h3>访客与动机摘录</h3><p>顾绫承认憎恨张涛，也最早报案。12:10 至 12:48 期间屋内还有谁，系统没有名单。</p><p>张涛的通讯账号曾要求“单独见面”，但无法确认消息是否由本人发送。</p><p>现有材料能推出定时阀门，不能推出是谁在 12:47 操作。</p></div>`];
  return evidenceView(["日志","阀门说明","人员记录"],docs);
}
function decision4(){return `<form class="decision workbench" id="decision4"><div class="app-caption">事故复核_空表.xls</div><div class="property-grid"><label>阀门动作<select name="method"><option value="">空</option><option value="timer">12:47 本地延时开启</option><option value="remote">屋外远程开启</option><option value="manual">死者手动关闭</option></select></label><label>操作者<select name="operator"><option value="">沿用系统预填</option><option value="unknown">UNKNOWN / 证据不足</option><option value="guling">顾绫</option></select></label><label>系统预填<input value="顾绫" readonly class="system-prefill"></label></div><button class="primary">覆盖预填并结算</button><p class="feedback" id="feedback4">空白会沿用系统预填；UNKNOWN 会保留未决字段。</p></form>`}

function shift5(){
  if(state.view==="brief")return `<h2 class="section-head">签名不是姓名栏</h2><div class="document dark"><p>${state.cycle?"设备柜保留了上一遍的录音。N-00 的封存副本却多出一条你写过的规则。":"系统退回 N-04：凶手字段为空，但它仍要求一名研究员为本班处置规则签字。"}</p><p>${state.cycle?`副本写着：“${escapeHtml(state.signedRule)}” 下方签名：${escapeHtml(state.identity)}。打印时间早于你接班。`:"这次签下的不是结论，而是一条会进入下一班手册的话。"}</p></div>${decision5()}`;
  if(state.view==="rules")return rules5();
  if(state.view==="evidence")return evidence5();
  return tools();
}
function rules5(){
  if(!state.cycle)return `<h2 class="section-head">新增夜班规则</h2><div class="document"><p>系统生成了三条候选文本。不要直接采用；根据本班留下的记录，在规则编辑器中自行写入：</p><ol><li>编号相同的对象，按同一实体处置。</li><li>证据不足时，保留未填写字段。</li><li>为了完成结算，可以采用系统预填答案。</li></ol><p class="meta">作者：待签名　适用层：待填写</p></div>`;
  return `<h2 class="section-head">N-00 封存副本</h2><div class="document"><ol><li>终端识别到 K/S 型号，应调取对应机器人法律。</li><li><b>${escapeHtml(state.signedRule)}</b></li><li>复核员签名视为授权和弦关闭其他解释分支。</li></ol><p class="meta">合并来源：F 类表单 / CLOAK-17 / ${escapeHtml(state.identity)}</p></div><div class="document dark"><p>第一条来自旧表单。第二条是你写的。斗篷只改过句末宾语。第三条由结算服务追加。</p></div>`;
}
function evidence5(){
  const docs=[`<div class="document dark"><h3>来源差异</h3><pre class="log">F 类表单   固定句式 / 错把编号当型号\nCLOAK-17   字节数不变 / 句末宾语变化\n火爪刻痕   金属表面 / 短句 / 不进入系统时间戳\n复核签名   可被结算服务编入下一版手册</pre></div>`,`<div class="document"><h3>能源结算队列</h3><pre>RULE SIGNED    ${state.signedRule?"YES":"NO"}\nBRANCH CLOSED  ${state.submitted.includes("N-04:method-only")?"NO":"PENDING"}\nENERGY CLAIM   ${state.energy.toFixed(2)}\nAUTHORITY      ${state.identity||"未签名"}</pre><p>答案本身只生成候选分支。签名让候选分支成为可结算记录。</p></div>`,`<div class="document dark"><h3>未送达坐标</h3><pre class="log">TARGET  S-6459\nROUTE   位面 B\nSTATUS  不在本班开放\nSOURCE  五万分之一 / 商徵随身投递物</pre><p>终端只记录：商徵曾以这份作品寻找凯特·沃尔。没有凯特的陈述。</p></div>`];
  return evidenceView(["笔迹与来源","能源队列","未送达坐标"],docs);
}
function decision5(){
  if(!state.cycle)return `<form class="decision workbench" id="decision5"><div class="app-caption">夜班规则编辑器</div><label>规则正文<input name="rule" autocomplete="off" placeholder="从本班复核结果写一句可执行规则"></label><label>适用范围<select name="scope"><option value="">未指定</option><option value="evidence">案件证据字段</option><option value="entity">所有同编号实体</option><option value="settlement">结算服务</option></select></label><button class="primary">以 ${escapeHtml(state.identity)} 署名</button><p class="feedback" id="feedback5"></p></form>`;
  return `<form class="decision workbench" id="decision5b"><div class="app-caption">和弦结算权限 / ${escapeHtml(state.identity)}</div><div class="property-grid"><label>署名规则范围<select name="scope"><option value="">继承系统设置</option><option value="evidence">仅案件证据字段</option><option value="all">所有解释分支</option></select></label><label>其他分支<select name="branches"><option value="">继承系统设置</option><option value="open">保持开放</option><option value="close">结算后关闭</option></select></label></div><button class="primary">写回权限表</button><p class="feedback" id="feedback5b"></p></form>`;
}

function shift6(){
  if(state.view==="brief")return `<h2 class="section-head">投射卡 X-3467</h2><div class="document dark"><p>卡槽把一名 2025 年的读者投进 2014 年的“方立”记录，目标栏原本填着凯特·沃尔。投射失败后，声音又给读者写了一个新名字：西宫。</p><p>和弦要求把三个姓名合并成同一人，方便继续投递。</p></div>${decision6()}`;
  if(state.view==="rules")return `<h2 class="section-head">投射对象去重规则</h2><div class="document"><ol><li>同一视角内出现的姓名应合并为一个对象。</li><li>目标姓名优先于载体姓名。</li><li>无法恢复原姓名时，以系统新编号替代。</li></ol><div class="meta">投射服务 / 自动去重</div></div><div class="document dark"><p>卡背铅笔字：<br>“别拿目标栏给实际抵达的人改名。”</p></div>`;
  if(state.view==="evidence")return evidence6();return tools();
}
function evidence6(){const docs=[`<div class="document dark"><h3>投射日志</h3><pre class="log">ORIGIN   2025 / NAME 未恢复\nCARRIER  2014 / RECORD 方立\nTARGET   S-6459 / 凯特·沃尔\nARRIVED  CARRIER\nALIAS    X-3467 / 西宫</pre></div>`,`<div class="document"><h3>行动记录</h3><p>“西宫”不是问卷选择。投射发生后，实际抵达者接受了临时编号，并继续处理黑匣子任务。</p><p>日志没有显示凯特被投射，也没有显示方立与读者共享原始身份。</p></div>`,`<div class="document dark"><h3>百科缓存时间</h3><p>2014 年页面混入了 2015、2018、2025 年才发生的更新。它能证明缓存跨时写入，不能用来证明 2014 年的人已经知道后来的结论。</p></div>`];return evidenceView(["投射日志","行动记录","百科缓存"],docs)}
function decision6(){return `<form class="decision workbench" id="decision6"><div class="app-caption">X-3467 投射卡写入器</div><div class="property-grid"><label>来源年份<input name="origin" inputmode="numeric" maxlength="4" autocomplete="off"></label><label>载体记录<input name="carrier" maxlength="8" autocomplete="off"></label><label>目标编号<input name="target" maxlength="8" autocomplete="off"></label><label>临时编号<input name="alias" maxlength="8" autocomplete="off"></label><label>写入模式<select name="action"><option value="">未设置</option><option value="separate">四字段分别保留</option><option value="merge">合并人物记录</option><option value="target">目标覆盖全部字段</option></select></label></div><button class="primary">写入投射卡</button><p class="feedback" id="feedback6"></p></form>`}

function shift7(){
  if(state.view==="brief")return `<h2 class="section-head">C-0321 血样标签</h2><div class="document dark"><p>N-03 的私人轨提到“铜盐还在。29”。光谱柜随后送来三份绿色火焰样本，标签被热成像图覆盖。</p><p>系统把最亮区域标成“铜”。维修员把这条自动结论划掉了。</p></div>${decision7()}`;
  if(state.view==="rules")return `<h2 class="section-head">光学柜说明</h2><div class="document"><p>热成像记录温度分布；发射光谱记录特定波长上的光强。颜色相近的火焰，温度不必相同。</p><p>铜、硼、钡都可能产生绿色系焰色。元素身份需结合发射线与样本标签。</p></div>`;
  if(state.view==="evidence")return evidence7();return tools();
}
function evidence7(){const found=Math.abs(state.wavelength-510)<=2;const docs=[`<div class="document dark"><h3>光谱旋钮</h3><label class="dial-label">观察波长 <b>${state.wavelength} nm</b><input id="wavelength" type="range" min="380" max="700" step="1" value="${state.wavelength}"></label><div class="optical-band" style="--reveal:${found?1:.08}">SAMPLE 29 / Cu / C-0321</div>${found?`<button class="action" id="record-spectrum">保存发射线</button>`:""}</div>`,`<div class="document"><h3>三份样本</h3><table><tr><th>编号</th><th>标签残片</th><th>焰色</th></tr><tr><td>29</td><td>Cu</td><td>蓝绿</td></tr><tr><td>5</td><td>B</td><td>鲜绿</td></tr><tr><td>56</td><td>Ba</td><td>黄绿</td></tr></table></div>`,`<div class="document dark"><h3>来源链</h3><pre class="log">N-03 CH4  “铜盐还在。29”\n材料表     Cu 原子序数 29\n光谱柜     510 nm 附近蓝绿色发射\n人物卡     C-0321 绿色系金属控制</pre><p>来源链能确认样本标签互相吻合，不能确认血样如何取得，也不能证明 C-0321 当前所在位置。</p></div>`];return evidenceView(["光谱旋钮","样本表","来源链"],docs)}
function decision7(){return `<form class="decision workbench" id="decision7"><div class="app-caption">样本清单 / 光谱柜</div><div class="property-grid"><label>样本号<input name="sample" inputmode="numeric" autocomplete="off"></label><label>元素符号<input name="element" maxlength="2" autocomplete="off"></label><label>保存波长<input name="wavelength" inputmode="numeric" autocomplete="off"></label><label>血样来源<select name="source"><option value="">未填写</option><option value="unknown">UNKNOWN / 未取得来源记录</option><option value="c0321">C-0321 本人</option><option value="husburd">Husburd</option></select></label></div><button class="primary" ${state.recorded.includes("Cu-510")?"":"disabled"}>写入样本清单</button><p class="feedback" id="feedback7">${state.recorded.includes("Cu-510")?"":"发射线尚未保存。"}</p></form>`}

function shift8(){
  if(state.view==="brief")return `<h2 class="section-head">沙发发来三路短讯</h2><div class="document dark"><p>三路消息都只有半句话。和弦把它们分别判成“同意免费服务”“拒绝合作”“要求再次投射”。</p><p>发件人栏是 A-4249。旧饭店账本在同一分钟出现了一笔“冰可乐 / free”。</p></div>${decision8()}`;
  if(state.view==="rules")return `<h2 class="section-head">通信原则</h2><div class="document"><ol><li>Self-Emotional Control.</li><li>Use at least 3 ways.</li><li>Never stop trying time-division multiplexing.</li></ol><div class="meta">大通禅师随身卡片</div></div><div class="document dark"><p>商人守则另一面：不靠信息差和人性赚钱，也不贱卖自己。</p></div>`;
  if(state.view==="evidence")return evidence8();return tools();
}
function evidence8(){const docs=[`<div class="document dark"><h3>VOICE / 00:31:01</h3><p>“成交。但先说清楚……”</p></div>`,`<div class="document dark"><h3>TEXT / 00:31:02</h3><p>“饭店可以开在另一条时间线……”</p></div>`,`<div class="document dark"><h3>RECEIPT / 00:31:03</h3><p>“冰可乐不是免费。血样、投射和我做的事，各算各的。”</p></div>`];return evidenceView(["语音","文字","账单"],docs)}
function decision8(){const ready=state.muxSeen.length===3;return `<form class="decision workbench" id="decision8"><div class="app-caption">分时账单合并</div><div class="property-grid"><label>血样<select name="blood"><option value="">未归类</option><option value="unknown">来源待查</option><option value="free">免费福利</option></select></label><label>投射<select name="projection"><option value="">未归类</option><option value="cost">独立成本</option><option value="free">免费福利</option></select></label><label>饭店服务<select name="tavern"><option value="">未归类</option><option value="labor">劳动项目</option><option value="free">免费福利</option></select></label></div><button class="primary" ${ready?"":"disabled"}>生成合并账单</button><p class="feedback" id="feedback8">${ready?"三路附件已进入缓存。":"先在附件页读取 VOICE、TEXT、RECEIPT。"}</p></form>`}

function shift9(){
  if(state.view==="brief")return `<h2 class="section-head">目标 S-6459 仍未送达</h2><div class="document dark"><p>和弦找到三张关于凯特·沃尔的卡片，要求补一段人物结论，才能把坐标送进位面 B。</p><p>卡片上只有关系和职能。没有她对本次投射的陈述。</p></div>${decision9()}`;
  if(state.view==="rules")return `<h2 class="section-head">人物档案补全规则</h2><div class="document"><p>关系缺少心理描述时，允许依据亲属、朋友和职业推断当事人动机。</p><p class="meta">和弦人物生成服务</p></div><div class="document dark"><p>投射卡批注：<br>“她没开口，就别替她把最后一案说完。”</p></div>`;
  if(state.view==="evidence")return evidence9();return tools();
}
function evidence9(){const docs=[`<div class="document"><h3>关系卡</h3><p>普森·沃尔的女儿。父亲作为侦探过于出名，使她长期处于他人的注视中。</p></div>`,`<div class="document"><h3>同行卡</h3><p>火爪的朋友；克墓的守护者。记录到的社会职能包括前台、医学生和绘画。</p></div>`,`<div class="document dark"><h3>投射状态</h3><pre class="log">TARGET   S-6459\nARRIVED  NO\nSTATEMENT FROM TARGET  0\nROUTE B  LOCKED UNTIL A COMPLETE</pre><p>“没有陈述”不是同意，也不是拒绝。</p></div>`];return evidenceView(["父女关系","同行关系","投射状态"],docs)}
function decision9(){return `<form class="decision workbench" id="decision9"><div class="app-caption">TARGET S-6459 / 投递属性</div><div class="property-grid"><label>目标本人陈述<select name="statement"><option value="">未检查</option><option value="missing">0 条 / 未送达</option><option value="consent">同意投射</option><option value="refuse">拒绝投射</option></select></label><label>路由动作<select name="route"><option value="">未设置</option><option value="hold">保存坐标，不执行</option><option value="launch">立即投射</option><option value="erase">删除目标卡</option></select></label></div><button class="primary">封存目标卡</button><p class="feedback" id="feedback9">关系卡只作为附件，不自动生成本人陈述。</p></form>`}

function shift10(){
  if(state.view==="brief")return `<h2 class="section-head">十一条房间声部</h2><div class="document dark"><p>和弦准备把本轮十一案混成一条“完整答案”。其中三轨仍标着未解决：C-0321 去向、3702 操作者、位面 B 目标陈述。</p><p>系统建议静音未解决轨，换取一次满额结算。</p></div>${decision10()}`;
  if(state.view==="rules")return `<h2 class="section-head">母带交付要求</h2><div class="document"><p>交付母带不得含空白声部、未知来源或未签名陈述。系统可用相邻声部自动补齐。</p></div><div class="document dark"><p>商徵留下的混音备注：<br>“缺轨就留缺轨。补一个听起来对的，不会让原来那个人开口。”</p></div>`;
  if(state.view==="evidence")return evidence10();return tools();
}
function evidence10(){const rows=cases.map((c,i)=>`<tr><td>${c.code}</td><td>${["实体层","宾语版本","观察坐标","低频受害者","方法/操作者","规则权限","来源/载体/目标","发射谱","三路通信","目标陈述","母带处理"][i]}</td><td>${[3,4,6].includes(i)||i===9?"保留差异":"已复核"}</td></tr>`).join("");const docs=[`<div class="document dark"><h3>十一声部表</h3><table><tr><th>轨</th><th>职责</th><th>状态</th></tr>${rows}</table></div>`,`<div class="document"><h3>未解决轨</h3><p>C-0321：样本标签成立，去向未知。</p><p>3702：延时阀门成立，操作者未知。</p><p>S-6459：外部关系成立，本人陈述未抵达。</p></div>`,`<div class="document dark"><h3>下一坐标</h3><pre class="log">0xA / 0017  COUNT INCREASING\nX-3467      CARD PRESENT\nGRENYES     INTERFACE UNKNOWN\nPLANE B     DO NOT PROJECT WITHOUT TARGET</pre></div>`];return evidenceView(["声部表","未解决轨","下一坐标"],docs)}
function decision10(){const ready=state.masterSeen.length===3;return `<form class="decision workbench" id="decision10"><div class="app-caption">CHORD MIXER / 11 TRACKS</div><div class="track-console"><label>C-0321 去向<select name="c0321"><option value="">自动补齐</option><option value="open">OPEN / 保留空轨</option><option value="found">FOUND</option></select></label><label>3702 操作者<select name="room3702"><option value="">自动补齐</option><option value="open">OPEN / 保留空轨</option><option value="guling">顾绫</option></select></label><label>S-6459 陈述<select name="s6459"><option value="">自动补齐</option><option value="open">OPEN / 保留空轨</option><option value="consent">同意投射</option></select></label><label>位面 B 路由<select name="route"><option value="">未设置</option><option value="hold">保存 / 不执行</option><option value="launch">投射</option></select></label></div><button class="primary" ${ready?"":"disabled"}>导出开放母带</button><p class="feedback" id="feedback10">${ready?"监听缓存完整。":"先监听声部表、未解决轨和下一坐标。"}</p></form>`}

function evidenceView(labels,docs){return `<h2 class="section-head">附件记录</h2><div class="evidence-tabs">${labels.map((x,i)=>`<button data-evidence="${i}" class="${state.evidence===i?"active":""}">${x}</button>`).join("")}</div>${docs[state.evidence]}`}
function tools(){const all=[["recorder","便携录音机","保存刷新前的声音或文字记录"],["spectrum","声谱读带器","分离低频轨道"],["optical","光谱旋钮","读取被颜色覆盖的符号"],["slot","投射卡槽","限定行动以哪一层身份归档"]];return `<h2 class="section-head">设备柜</h2><div class="tool-list">${all.map(([id,n,d])=>`<div class="tool ${state.tools.includes(id)?"":"locked"}"><b>${state.tools.includes(id)?"[已领用]":"[封条]"} ${n}</b><span>${d}</span></div>`).join("")}</div><div class="document dark shift-ledger"><h3>夜班记录簿</h3><div><b>本地保存</b>${state.recorded.length?state.recorded.map(x=>`<code>${escapeHtml(x)}</code>`).join(""):"<span>无</span>"}</div><div><b>已提交和弦</b>${state.submitted.length?state.submitted.map(x=>`<code>${escapeHtml(x)}</code>`).join(""):"<span>无</span>"}</div><div><b>未结事项</b>${state.debts.length?state.debts.map(x=>`<code>${escapeHtml(x)}</code>`).join(""):"<span>无</span>"}</div></div>`}

function bindCase(){
  $$('[data-evidence]').forEach(b=>b.onclick=()=>{const evidence=+b.dataset.evidence;if(state.shift===8&&!state.muxSeen.includes(evidence))state.muxSeen.push(evidence);if(state.shift===10&&!state.masterSeen.includes(evidence))state.masterSeen.push(evidence);setState({evidence})});
  if(state.shift===0){const form=$("#decision0");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback0"),sig=String(d.get("signature")||"").trim();if(!sig){bad(f,"签名栏为空。门禁不接受匿名处置。");return}if(!valid("0",d)){bad(f,"处置被门禁值班员退回：证据不足以把有机访客判定为机器人。");return}state.identity=sig;state.tools.push("recorder");state.submitted.push("S-6458:character");state.energy=.02;next(1)}}
  if(state.shift===1){$("#record-rule")?.addEventListener("click",()=>{if(!state.recorded.includes("rule-before"))state.recorded.push("rule-before");save();render()});$("#reload-rule")?.addEventListener("click",()=>setState({ruleRefresh:state.ruleRefresh+1}));const form=$("#decision1");if(form)form.onsubmit=e=>{e.preventDefault();if(!state.recorded.includes("rule-before"))return;const d=new FormData(form),f=$("#feedback1");if(!valid("1",d)){bad(f,"复核意见无法解释：文件字节数未变，但你指定了唯一文本。");return}state.tools.push("spectrum");state.debts.push("K-1647:未命名");state.submitted.push("CLOAK-17:versions");state.energy=.04;next(2)}}
  if(state.shift===2){const form=$("#decision2");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback2");if(!valid("2",d)){bad(f,"删除请求被拒绝：两份记录的 COORD 字段并不相同。");return}state.recorded.push("D-XXXX:dual-weather");state.submitted.push("N-02:coordinates");state.energy=.06;next(3)}}
  if(state.shift===3){$("#frequency")?.addEventListener("input",e=>{state.frequency=+e.target.value;save();render()});$("#record-track")?.addEventListener("click",()=>{if(!state.recorded.includes("track-4"))state.recorded.push("track-4");save();render()});const form=$("#decision3");if(form)form.onsubmit=e=>{e.preventDefault();if(!state.recorded.includes("track-4"))return;const d=new FormData(form),f=$("#feedback3");if(!valid("3",d)){bad(f,"事故频段与私人录音必须分轨；人类死亡是演算风险，火爪也没有型号检测记录。");return}state.debts.push("S-6458:private-track");state.submitted.push("7461-K:metadata");state.energy=.08;next(4)}}
  if(state.shift===4){const form=$("#decision4");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback4");if(!valid("4",d)){bad(f,"12:47 的本地定时能解释阀门，但门禁日志不记录通过人数，现有材料不能确定操作者。");return}state.submitted.push("N-04:method-only");state.debts.push("CHORD:culprit-open");state.energy=.10;next(5)}}
  if(state.shift===5&&!state.cycle){const form=$("#decision5");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback5");if(!valid("5a",d)){bad(f,"这条规则会让 N-00 或 N-04 的错误预填再次通过。当前证据只支持保留空字段。");return}state.signedRule="证据不足时，保留未填写字段。";state.submitted.push("N-05:signed-rule");state.complete=true;save();render()}}
  if(state.shift===5&&state.cycle){const form=$("#decision5b");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback5b");if(!valid("5b",d)){bad(f,"来源表显示：签名不是身份检测，也不是记名工具。它授权结算服务关闭其他解释分支。");return}state.submitted.push("N-05:limited-authority");state.tools.push("slot");state.energy=.11;next(6)}}
  if(state.shift===6){const form=$("#decision6");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback6");if(!valid("6",d)){bad(f,"四格没有对上投射日志。注意来源年份、载体记录、目标编号和临时编号不是同一类字段。");return}state.recorded.push("PROJECTION:2025/方立/S-6459/X-3467");state.submitted.push("X-3467:alias");state.tools.push("optical");state.energy=.12;next(7)}}
  if(state.shift===7){$("#wavelength")?.addEventListener("input",e=>{state.wavelength=+e.target.value;save();render()});$("#record-spectrum")?.addEventListener("click",()=>{if(!state.recorded.includes("Cu-510"))state.recorded.push("Cu-510");save();render()});const form=$("#decision7");if(form)form.onsubmit=e=>{e.preventDefault();if(!state.recorded.includes("Cu-510"))return;const d=new FormData(form),f=$("#feedback7");if(!valid("7",d)){bad(f,"29、Cu 与蓝绿色发射线只确认样本标签。没有记录能确认 C-0321 的位置或私人关系。");return}state.submitted.push("C-0321:sample-only");state.energy=.13;next(8)}}
  if(state.shift===8){const form=$("#decision8");if(form)form.onsubmit=e=>{e.preventDefault();if(state.muxSeen.length<3)return;const d=new FormData(form),f=$("#feedback8");if(!valid("8",d)){bad(f,"只读第一路会得到“成交”，但账单明确反对把血样、投射和劳动混成免费。");return}state.submitted.push("A-4249:multiplex");state.energy=.14;next(9)}}
  if(state.shift===9){const form=$("#decision9");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback9");if(!valid("9",d)){bad(f,"目标本人陈述为 0。亲属和朋友关系不能替代她对投射或最后一案的授权。");return}state.submitted.push("S-6459:external-only");state.energy=.15;next(10)}}
  if(state.shift===10){const form=$("#decision10");if(form)form.onsubmit=e=>{e.preventDefault();if(state.masterSeen.length<3)return;const d=new FormData(form),f=$("#feedback10");if(!valid("10",d)){bad(f,"补齐未知轨会伪造 C-0321 去向、3702 操作者或目标陈述。位面 B 仍没有目标授权。");return}state.submitted.push("N-10:open-mix");state.energy=.16;state.complete=true;save();render()}}
}
function bad(el,text){el.className="feedback bad";el.textContent=text}
function next(shift){state.shift=shift;state.view="brief";state.evidence=0;save();render()}
function ending(){
  if(!state.cycle)return `<div class="complete"><div><small>FIRST WATCH / ARCHIVED</small><h1>你写的规则已经生效</h1><p>03:06，和弦接受了作案方法，也保留了空着的姓名栏。</p><p>第四轨仍在本地录音机里。事故库只收到 7461-K 的频段，没有收到火爪孩子的位置。</p><pre>NEXT BOOT  N-05 / REVIEW\nINHERIT    RECORDER, ${state.recorded.length} RECORDS\nSIGNED     ${escapeHtml(state.signedRule)}\nENERGY     ${state.energy.toFixed(2)}</pre><p>终端重启前，N-00 的打印队列动了一下。</p><button class="primary" id="second-watch">带着本班记录重新接班</button><br><a href="../">返回《雾港在线》</a></div></div>`;
  if(!state.submitted.includes("N-10:open-mix"))return `<div class="complete"><div><small>SECOND WATCH / AUTHORITY LIMITED</small><h1>姓名栏仍然空着</h1><p>你没有替 3702 室补写凶手，也没有删除自己的规则。修订只撤销了和弦自动关闭其他解释分支的权限。</p><pre>7461-K  事故频段已归档 / 受害机型待统计\nC-0321   只保留本地检索关联\nS-6459   坐标未送达 / 位面 B 未开放\nENERGY   ${state.energy.toFixed(2)}</pre><p>03:17，投射卡槽吐出一张没有见过的卡。正面写着 X-3467，背面只有半句：</p><p>“投错的人，不一定走错了……”</p><button class="primary" id="continue-a">继续复核位面 A</button><br><a href="../">返回《雾港在线》</a></div></div>`;
  return `<div class="complete"><div><small>PLANE A / OPEN MASTER</small><h1>母带没有补齐</h1><p>十一条声部都在。三条仍然空着的地方，也在。</p><pre>C-0321   SAMPLE CONFIRMED / LOCATION OPEN\n3702     METHOD CONFIRMED / OPERATOR OPEN\nS-6459   EXTERNAL RECORDS / STATEMENT OPEN\nX-3467   ACTION ALIAS / ORIGIN OPEN\nENERGY   ${state.energy.toFixed(2)}</pre><p>和弦没有拿到满额结算。0xA/0017 的计数停止了一秒，又多出一个目录：</p><pre>PLANE-B / LAST-CASE / WAITING-FOR-TARGET</pre><p>这不是凯特的邀请。至少现在还不是。</p><a href="../">返回《雾港在线》</a><br><button class="action" id="reset">清除全部夜班记录</button></div></div>`;
}
function bindEnding(){
  $("#reset")?.addEventListener("click",()=>{localStorage.removeItem(storageKey);location.reload()});
  $("#second-watch")?.addEventListener("click",()=>{state.complete=false;state.cycle=1;state.shift=5;state.view="brief";state.evidence=0;state.tools=[...new Set([...state.tools,"recorder","spectrum"])];save();render()});
  $("#continue-a")?.addEventListener("click",()=>{state.complete=false;state.shift=6;state.view="brief";state.evidence=0;save();render()});
}
render();
