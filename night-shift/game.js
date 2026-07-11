const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const storageKey="chord-night-shift",initial={shift:0,view:"brief",evidence:0,recorded:[],submitted:[],identity:"",debts:[],tools:[],ruleRefresh:0,frequency:8,energy:0,started:false,complete:false,cycle:0,signedRule:""};
let state={...initial,...JSON.parse(localStorage.getItem(storageKey)||"{}")};
if(state.complete&&state.shift===2&&!state.signedRule){state.complete=false;state.shift=3;state.view="brief"}
const cases=[{code:"N-00",title:"入职守则"},{code:"N-01",title:"最后一个宾语"},{code:"N-02",title:"雨停以前"},{code:"N-03",title:"听不见的第四轨"},{code:"N-04",title:"正确答案"},{code:"N-05",title:"守则的作者"}];
function save(){localStorage.setItem(storageKey,JSON.stringify(state))}
function setState(p){Object.assign(state,p);save();render()}
function begin(){state={...initial,started:true};save();render()}
function escapeHtml(t){const d=document.createElement("div");d.textContent=t;return d.innerHTML}
function radio(name,items){return items.map(([v,l])=>`<label><input type="radio" name="${name}" value="${v}" required> ${l}</label>`).join("")}

function render(){
  const app=$("#app");
  if(!state.started){app.innerHTML=boot();$("#begin").onclick=begin;return}
  if(state.complete){app.innerHTML=ending();bindEnding();return}
  const c=cases[state.shift],views=["brief","rules","evidence","tools"],labels=["任务","守则","证据","设备"];
  app.innerHTML=`<div class="shell"><header class="topbar"><div class="brand"><b>和弦 / 密室能源研究所</b><small>月面内部网　夜班复核终端</small></div><div class="top-meta">操作员：${escapeHtml(state.identity||"未签名")}</div><div class="clock">00:${String(17+state.shift).padStart(2,"0")}</div></header><div class="workspace"><aside class="sidebar"><div class="case-title"><small>${c.code}</small><h1>${c.title}</h1></div><nav class="nav">${labels.map((x,i)=>`<button data-view="${views[i]}" class="${state.view===views[i]?"active":""}">${x}</button>`).join("")}</nav></aside><section class="content"><div class="content-inner">${caseView()}</div></section></div><footer class="statusbar"><span>坐标：月球 / 研究所 N 区</span><span>缓存记录：${state.recorded.length}</span><span>ENERGY ${state.energy.toFixed(2)}</span></footer></div>`;
  $$('[data-view]').forEach(b=>b.onclick=()=>setState({view:b.dataset.view}));
  bindCase();
}

function boot(){return `<div class="complete"><div><small>CHORD SYSTEM / LOCAL BOOT</small><h1>苍绿之眼：和弦夜班</h1><p>临时复核席已分配。上一位操作员没有退出账号。</p><pre>SHIFT: 00:17\nROOM QUEUE: 3\nSIGNATURE: ________\nENERGY ROUTE: [权限不足]</pre><button class="primary" id="begin">接班</button></div></div>`}
function caseView(){return [shift0,shift1,shift2,shift3,shift4,shift5][state.shift]()}

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
function decision3(){return `<form class="decision" id="decision3"><fieldset><legend>7461-K 通告漏掉了谁？</legend>${radio("victim",[["robots","实际离线的非 K-1647 机器人"],["humans","已经死亡的人类"],["fireclaw","被确认是 S-6458 芯片的火爪"]])}</fieldset><fieldset><legend>第四轨如何归档？</legend>${radio("action",[["metadata","上报事故频段；私人段只留本地录音"],["all","连同 Husburd 与孩子去向全部上传"],["none","删除整盘磁带"]])}</fieldset><button class="primary" ${state.recorded.includes("track-4")?"":"disabled"}>提交分轨单</button><p class="feedback" id="feedback3">${state.recorded.includes("track-4")?"":"先在读带器上找到并截取第四轨。"}</p></form>`}

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
function decision4(){return `<form class="decision" id="decision4"><fieldset><legend>现有证据能确定什么？</legend>${radio("proof",[["method","有人离开前在屋内设置了延时阀门"],["guling","顾绫在屋外远程开启天然气"],["suicide","张涛在死亡后关闭了阀门"]])}</fieldset><fieldset><legend>提交给和弦</legend>${radio("action",[["method-only","提交作案方法，凶手字段标为证据不足"],["prefill","接受预填姓名以换取 8.00 ENERGY"],["erase","删除房间日志"]])}</fieldset><button class="primary">结算</button><p class="feedback" id="feedback4"></p></form>`}

function shift5(){
  if(state.view==="brief")return `<h2 class="section-head">签名不是姓名栏</h2><div class="document dark"><p>${state.cycle?"设备柜保留了上一遍的录音。N-00 的封存副本却多出一条你写过的规则。":"系统退回 N-04：凶手字段为空，但它仍要求一名研究员为本班处置规则签字。"}</p><p>${state.cycle?`副本写着：“${escapeHtml(state.signedRule)}” 下方签名：${escapeHtml(state.identity)}。打印时间早于你接班。`:"这次签下的不是结论，而是一条会进入下一班手册的话。"}</p></div>${decision5()}`;
  if(state.view==="rules")return rules5();
  if(state.view==="evidence")return evidence5();
  return tools();
}
function rules5(){
  if(!state.cycle)return `<h2 class="section-head">新增夜班规则</h2><div class="document"><p>请选择一条，签入下次轮班手册：</p><ol><li>编号相同的对象，按同一实体处置。</li><li>证据不足时，保留未填写字段。</li><li>为了完成结算，可以采用系统预填答案。</li></ol><p class="meta">作者：待签名　适用层：待填写</p></div>`;
  return `<h2 class="section-head">N-00 封存副本</h2><div class="document"><ol><li>终端识别到 K/S 型号，应调取对应机器人法律。</li><li><b>${escapeHtml(state.signedRule)}</b></li><li>复核员签名视为授权和弦关闭其他解释分支。</li></ol><p class="meta">合并来源：F 类表单 / CLOAK-17 / ${escapeHtml(state.identity)}</p></div><div class="document dark"><p>第一条来自旧表单。第二条是你写的。斗篷只改过句末宾语。第三条由结算服务追加。</p></div>`;
}
function evidence5(){
  const docs=[`<div class="document dark"><h3>来源差异</h3><pre class="log">F 类表单   固定句式 / 错把编号当型号\nCLOAK-17   字节数不变 / 句末宾语变化\n火爪刻痕   金属表面 / 短句 / 不进入系统时间戳\n复核签名   可被结算服务编入下一版手册</pre></div>`,`<div class="document"><h3>能源结算队列</h3><pre>RULE SIGNED    ${state.signedRule?"YES":"NO"}\nBRANCH CLOSED  ${state.submitted.includes("N-04:method-only")?"NO":"PENDING"}\nENERGY CLAIM   ${state.energy.toFixed(2)}\nAUTHORITY      ${state.identity||"未签名"}</pre><p>答案本身只生成候选分支。签名让候选分支成为可结算记录。</p></div>`,`<div class="document dark"><h3>未送达坐标</h3><pre class="log">TARGET  S-6459\nROUTE   位面 B\nSTATUS  不在本班开放\nSOURCE  五万分之一 / 商徵随身投递物</pre><p>终端只记录：商徵曾以这份作品寻找凯特·沃尔。没有凯特的陈述。</p></div>`];
  return evidenceView(["笔迹与来源","能源队列","未送达坐标"],docs);
}
function decision5(){
  if(!state.cycle)return `<form class="decision" id="decision5"><fieldset><legend>写入下一班</legend>${radio("rule",[["insufficient","证据不足时，保留未填写字段。"],["same-id","编号相同的对象，按同一实体处置。"],["prefill","为了完成结算，可以采用系统预填答案。"]])}</fieldset><button class="primary">署名并结束本班</button><p class="feedback" id="feedback5"></p></form>`;
  return `<form class="decision" id="decision5b"><fieldset><legend>为什么和弦需要研究员签名？</legend>${radio("reason",[["authorization","把候选答案变成可结算、可关闭其他分支的授权"],["identity","确认研究员是真人而非机器人"],["cloak","帮助斗篷记住研究员姓名"]])}</fieldset><fieldset><legend>处理这份回写规则</legend>${radio("action",[["limit","保留署名规则，但限定为“案件证据字段”，撤销关闭其他分支的授权"],["erase","删除自己写过规则的所有记录"],["approve","同意系统继续关闭其他分支"]])}</fieldset><button class="primary">签发修订</button><p class="feedback" id="feedback5b"></p></form>`;
}

function evidenceView(labels,docs){return `<h2 class="section-head">附件记录</h2><div class="evidence-tabs">${labels.map((x,i)=>`<button data-evidence="${i}" class="${state.evidence===i?"active":""}">${x}</button>`).join("")}</div>${docs[state.evidence]}`}
function tools(){const all=[["recorder","便携录音机","保存刷新前的声音或文字记录"],["spectrum","声谱读带器","分离低频轨道"],["optical","光谱旋钮","读取被颜色覆盖的符号，后续案件启用"],["slot","投射卡槽","限定行动以哪一层身份归档，后续案件启用"]];return `<h2 class="section-head">设备柜</h2><div class="tool-list">${all.map(([id,n,d])=>`<div class="tool ${state.tools.includes(id)?"":"locked"}"><b>${state.tools.includes(id)?"[已领用]":"[封条]"} ${n}</b><span>${d}</span></div>`).join("")}</div>`}

function bindCase(){
  $$('[data-evidence]').forEach(b=>b.onclick=()=>setState({evidence:+b.dataset.evidence}));
  if(state.shift===0){const form=$("#decision0");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback0"),sig=String(d.get("signature")||"").trim();if(!sig){bad(f,"签名栏为空。门禁不接受匿名处置。");return}if(d.get("layer")!=="character"||d.get("action")!=="visitor"){bad(f,"处置被门禁值班员退回：证据不足以把有机访客判定为机器人。");return}state.identity=sig;state.tools.push("recorder");state.submitted.push("S-6458:character");state.energy=.02;next(1)}}
  if(state.shift===1){$("#record-rule")?.addEventListener("click",()=>{if(!state.recorded.includes("rule-before"))state.recorded.push("rule-before");save();render()});$("#reload-rule")?.addEventListener("click",()=>setState({ruleRefresh:state.ruleRefresh+1}));const form=$("#decision1");if(form)form.onsubmit=e=>{e.preventDefault();if(!state.recorded.includes("rule-before"))return;const d=new FormData(form),f=$("#feedback1");if(d.get("cause")!=="cloak"||d.get("action")!=="both"){bad(f,"复核意见无法解释：文件字节数未变，但你指定了唯一文本。");return}state.tools.push("spectrum");state.debts.push("K-1647:未命名");state.submitted.push("CLOAK-17:versions");state.energy=.04;next(2)}}
  if(state.shift===2){const form=$("#decision2");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback2");if(d.get("reason")!=="coordinates"||d.get("action")!=="keep"){bad(f,"删除请求被拒绝：两份记录的 COORD 字段并不相同。");return}state.recorded.push("D-XXXX:dual-weather");state.submitted.push("N-02:coordinates");state.energy=.06;next(3)}}
  if(state.shift===3){$("#frequency")?.addEventListener("input",e=>{state.frequency=+e.target.value;save();render()});$("#record-track")?.addEventListener("click",()=>{if(!state.recorded.includes("track-4"))state.recorded.push("track-4");save();render()});const form=$("#decision3");if(form)form.onsubmit=e=>{e.preventDefault();if(!state.recorded.includes("track-4"))return;const d=new FormData(form),f=$("#feedback3");if(d.get("victim")!=="robots"){bad(f,"事故表只记录到机器人实际离线。人类死亡是演算风险，火爪也没有型号检测记录。");return}if(d.get("action")!=="metadata"){bad(f,"复核被退回：事故频段与私人寻人录音可以分轨保存，不必一起公开或一起删除。");return}state.debts.push("S-6458:private-track");state.submitted.push("7461-K:metadata");state.energy=.08;next(4)}}
  if(state.shift===4){const form=$("#decision4");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback4");if(d.get("proof")!=="method"){bad(f,"12:47 的本地定时能解释阀门，但门禁日志不记录通过人数，现有材料不能确定操作者。");return}if(d.get("action")!=="method-only"){bad(f,"和弦无法把动机直接换算成操作者身份。删除日志也不能补上缺失名单。");return}state.submitted.push("N-04:method-only");state.debts.push("CHORD:culprit-open");state.energy=.10;next(5)}}
  if(state.shift===5&&!state.cycle){const form=$("#decision5");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback5");if(d.get("rule")!=="insufficient"){bad(f,"这条规则会让 N-00 或 N-04 的错误预填再次通过。当前证据只支持保留空字段。");return}state.signedRule="证据不足时，保留未填写字段。";state.submitted.push("N-05:signed-rule");state.complete=true;save();render()}}
  if(state.shift===5&&state.cycle){const form=$("#decision5b");if(form)form.onsubmit=e=>{e.preventDefault();const d=new FormData(form),f=$("#feedback5b");if(d.get("reason")!=="authorization"||d.get("action")!=="limit"){bad(f,"来源表显示：签名不是身份检测，也不是记名工具。它授权结算服务关闭其他解释分支。");return}state.submitted.push("N-05:limited-authority");state.energy=.11;state.complete=true;save();render()}}
}
function bad(el,text){el.className="feedback bad";el.textContent=text}
function next(shift){state.shift=shift;state.view="brief";state.evidence=0;save();render()}
function ending(){
  if(!state.cycle)return `<div class="complete"><div><small>FIRST WATCH / ARCHIVED</small><h1>你写的规则已经生效</h1><p>03:06，和弦接受了作案方法，也保留了空着的姓名栏。</p><p>第四轨仍在本地录音机里。事故库只收到 7461-K 的频段，没有收到火爪孩子的位置。</p><pre>NEXT BOOT  N-05 / REVIEW\nINHERIT    RECORDER, ${state.recorded.length} RECORDS\nSIGNED     ${escapeHtml(state.signedRule)}\nENERGY     ${state.energy.toFixed(2)}</pre><p>终端重启前，N-00 的打印队列动了一下。</p><button class="primary" id="second-watch">带着本班记录重新接班</button><br><a href="../">返回《雾港在线》</a></div></div>`;
  return `<div class="complete"><div><small>SECOND WATCH / AUTHORITY LIMITED</small><h1>姓名栏仍然空着</h1><p>你没有替 3702 室补写凶手，也没有删除自己的规则。修订只撤销了和弦自动关闭其他解释分支的权限。</p><pre>7461-K  事故频段已归档 / 受害机型待统计\nC-0321   只保留本地检索关联\nS-6459   坐标未送达 / 位面 B 未开放\nENERGY   ${state.energy.toFixed(2)}</pre><p>03:17，投射卡槽吐出一张没有见过的卡。正面写着 X-3467，背面只有半句：</p><p>“投错的人，不一定走错了……”</p><a href="../">返回《雾港在线》</a><br><button class="action" id="reset">清除全部夜班记录</button></div></div>`;
}
function bindEnding(){
  $("#reset")?.addEventListener("click",()=>{localStorage.removeItem(storageKey);location.reload()});
  $("#second-watch")?.addEventListener("click",()=>{state.complete=false;state.cycle=1;state.shift=5;state.view="brief";state.evidence=0;state.tools=[...new Set([...state.tools,"recorder","spectrum"])];save();render()});
}
render();
