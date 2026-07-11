const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const state = JSON.parse(localStorage.getItem("fogharbor-state") || '{"pages":[],"mail":[],"radio":false}');
let z = 20;
let sound = false;
let browserCount = 0;

const mails = [
  {id:"mirror",from:"校园网镜像室 <mirror@wgh.edu>",date:"1999/12/31 23:48",subject:"最后一轮备份",body:`<p>北楼服务器会在零点停机。主页、论坛和公共目录都已经转存，私人信箱只保留标题。</p><p>罗老师仍坚持说千年虫不会让电梯多出一层。可今晚没有人愿意替他值班。</p><p>若自动索引失效，仍可从“雾港之声”听友页进入旧目录。</p><p>——校园网镜像室</p>`},
  {id:"chain",from:"转寄：好运邮件",date:"2000/01/01 00:02",subject:"不转发会忘记一个人",body:`<p>零散的雪花落在电视屏幕上时，请不要调台。</p><p>点名节目会在午夜叫出第七位听众的姓名。</p><p>之所以没有人承认听见，是因为承认的人会从合照里淡去。</p><p>后窗上的倒影比你慢一秒，也不要回头确认。</p><p>别人说这是千年虫，电视台说只是电压不稳。</p><p>回信给七个人，才能保住你记得的那张脸。</p><p>头一封信来自哪儿，我已经不记得了。</p><hr><small>此邮件已被转发 41 次。原始发件人：未知</small>`},
  {id:"qsl",from:"邮件投递子系统",date:"2000/01/01 00:06",subject:"退信：QSL 卡附件无法投递",body:`<p>收件人 l****@wgh.edu 不存在。</p><p>附件已移动到临时目录：</p><pre>C:\\TEMP\\QSL_UNDELIV.tmp</pre><p>错误代码：USER_UNKNOWN</p>`},
  {id:"rumor",from:"生活部小庄",date:"1999/12/30 18:21",subject:"今晚别用微波炉煮鸡蛋",body:`<p>听说零点以后微波炉会因为千年虫失控，还有人说仙人掌能吸收电脑辐射。宿舍检查时请把大功率电器收好。</p><p>PS：谁拿了我那张元素灯订购单？实验室周一要对账。</p>`}
];

const searchIndex = {
  "雾港之声": {title:"雾港之声 AM1702 听友纪念页",page:"radioPage",desc:"地方电台停播纪念与节目表快照"},
  "1702": {title:"无线电频率换发公告（1998）",page:"frequency",desc:"雾港市无线电管理处公示"},
  "槐荫路44号": {title:"企业黄页：槐荫路",page:"yellow",desc:"雾港热线分类信息"},
  "蓝鲸照相馆": {title:"蓝鲸网上相册",page:"albumLogin",desc:"冲印、证件照、数码扫描服务"},
  "lumen": {title:"LUMEN'S HOME / 梁真的个人主页",page:"lumen",desc:"物理系97级；短波、冲照片、实验记录"},
  "n17": {title:"[旧帖] 北楼不存在的 N17",page:"bbs",desc:"雾港大学 BBS / 怪谈版"},
  "n1-7": {title:"北楼房间预约系统（只读）",page:"labLogin",desc:"实验楼旧门牌索引"},
  "echo结项摘要": {title:"ECHO 课题结项摘要",page:"report",desc:"认知科学兴趣小组内部文件"},
  "许宁": {title:"女大学生称“电台叫出自己名字”",page:"xuning",desc:"《雾港晚报》1998年旧闻"},
  "听友来信": {title:"雾港之声听友来信移交清单",page:"lettersArchive",desc:"市广播台资料室公开目录"},
  "千年虫": {title:"谣言核查：电脑会在零点爆炸吗？",page:"rumors",desc:"《雾港晚报》科学版"},
  "镜子慢一秒": {title:"视觉后像与运动预测",page:"afterimage",desc:"基础心理学实验说明"},
  "polybius": {title:"街机厅里的黑色机器",page:"polybius",desc:"海外都市传说译帖"}
};

const pageCodes = {portal:"WGH-00",radioPage:"WGH-03",frequency:"WGH-05",yellow:"WGH-08",albumLogin:"WGH-11",album:"WGH-12",lumen:"WGH-16",bbs:"WGH-19",timeTower:"WGH-20",archivedBbs:"WGH-20A",labLogin:"WGH-23",lab:"WGH-24",report:"WGH-29",xuning:"WGH-21",lettersArchive:"WGH-22",rumors:"WGH-R1",afterimage:"WGH-R2",polybius:"WGH-R3"};

function save(){localStorage.setItem("fogharbor-state",JSON.stringify(state))}
function remember(page){if(!state.pages.includes(page)){state.pages.push(page);save()}}
function beep(freq=520,duration=.06){if(!sound)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;beep.ctx ||= new C();const o=beep.ctx.createOscillator(),g=beep.ctx.createGain();o.frequency.value=freq;g.gain.value=.035;o.connect(g).connect(beep.ctx.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,beep.ctx.currentTime+duration);o.stop(beep.ctx.currentTime+duration)}

function createWindow(id,title,html,{width,height,code=""}={}){
  let win=$(`.window[data-id="${id}"]`);
  if(win){focusWindow(win);return win}
  win=$("#window-template").content.firstElementChild.cloneNode(true);win.dataset.id=id;$(".title",win).textContent=title;$(".window-body",win).innerHTML=html;$(".page-code",win).textContent=code;
  if(width)win.style.width=width;if(height)win.style.height=height;
  $("#windows").append(win);bindWindow(win);focusWindow(win);addTask(id,title);beep();return win
}
function bindWindow(win){$("[data-close]",win).onclick=()=>closeWindow(win);$("[data-minimize]",win).onclick=()=>{win.hidden=true;updateTasks()};win.onpointerdown=()=>focusWindow(win);const bar=$(".titlebar",win);bar.onpointerdown=e=>{if(e.target.closest("button")||innerWidth<700)return;focusWindow(win);const r=win.getBoundingClientRect(),dx=e.clientX-r.left,dy=e.clientY-r.top;bar.setPointerCapture(e.pointerId);bar.onpointermove=ev=>{win.style.left=Math.max(0,Math.min(innerWidth-win.offsetWidth,ev.clientX-dx))+"px";win.style.top=Math.max(0,Math.min(innerHeight-40,ev.clientY-dy))+"px"};bar.onpointerup=()=>bar.onpointermove=null}}
function focusWindow(win){$$('.window').forEach(w=>w.classList.add("inactive"));win.classList.remove("inactive");win.style.zIndex=++z;updateTasks()}
function closeWindow(win){win.remove();$(`.task-button[data-task="${win.dataset.id}"]`)?.remove();beep(360)}
function addTask(id,title){const b=document.createElement("button");b.className="task-button";b.dataset.task=id;b.textContent=title;b.onclick=()=>{const w=$(`.window[data-id="${id}"]`);w.hidden=false;focusWindow(w)};$("#tasks").append(b)}
function updateTasks(){$$(".task-button").forEach(b=>{const w=$(`.window[data-id="${b.dataset.task}"]`);b.classList.toggle("active",w&&!w.hidden&&!w.classList.contains("inactive"))})}

function openApp(id){$("#start-menu").hidden=true;({computer:openComputer,browser:openBrowser,mail:openMail,radio:openRadio,notes:openNotes,trash:openTrash}[id]||(()=>{}))()}
function openComputer(){const html=`<div class="app-toolbar"><button class="win-button">←</button><b>地址</b><div class="address">C:\\我的文档</div></div><div class="tree-layout"><aside class="sidebar"><b>我的文档</b><p>保存在本机上的文件。部分文件来自损坏的校园网镜像。</p><hr>可用空间<br>1.17 GB</aside><div class="file-grid"><button class="file" data-file="readme"><span>📝</span><label>维护说明.txt</label></button><button class="file" data-file="lamps"><span>📊</span><label>元素灯订购单.xls</label></button><button class="file" data-file="modem"><span>☎</span><label>拨号记录.log</label></button><button class="file" data-file="morse"><span>📻</span><label>抄报练习卡.txt</label></button><button class="file" data-file="photo"><span>🖼</span><label>北楼合照.jpg</label></button><button class="file" data-file="locked"><span>🗄</span><label>ARCHIVE.dat</label></button></div></div>`;const w=createWindow("computer","我的文档",html,{code:"LOCAL"});$$('[data-file]',w).forEach(b=>b.onclick=()=>openFile(b.dataset.file))}
function openFile(id){const files={readme:["维护说明.txt",`小梁：\n\n索引又坏了，先用“雾港搜索”。人名、店名都得打全，少一个字它就装死。\n\n还有，网页右下角的日期别信。昨晚校时以后全乱了。\n\n——雯\n12月31日`],modem:["拨号记录.log",`12/31 23:58:44 ATZ\n12/31 23:58:47 ATDT 1702\n12/31 23:58:53 CONNECT 56K\n01/01 00:17:03 NO CARRIER\n01/01 00:17:03 NO CARRIER\n01/01 00:17:03 NO CARRIER`],morse:["抄报练习卡.txt",`业余无线电协会　初级抄报卡\n\nA .-      B -...    C -.-.    D -..     E .\nF ..-.    G --.     H ....    I ..      J .---\nK -.-     L .-..    M --      N -.      O ---\nP .--.    Q --.-    R .-.     S ...     T -\nU ..-     V ...-    W .--     X -..-    Y -.--\nZ --..\n\n短音记作“.”，长音记作“-”，字母之间留空。\n\n雾港大学业余无线电协会　1998`],lamps:["元素灯订购单.xls",`<table class="science-table"><tr><th>顺序</th><th>元素灯</th><th>光谱主线/nm</th><th>数量</th></tr><tr><td>1</td><td>汞 Hg</td><td>546.1</td><td>1</td></tr><tr><td>2</td><td>氖 Ne</td><td>585.2</td><td>1</td></tr><tr><td>3</td><td>钠 Na</td><td>589.0</td><td>2</td></tr><tr><td>4</td><td>氢 H</td><td>656.3</td><td>1</td></tr></table><div class="paper-note">扫描盘密码我改成这四个灯的原子序数了。老孙你别再抄光谱数字，昨天试三回，盘差点锁死。<br>——梁</div>`]};if(id==="photo")return createWindow("photo","北楼合照.jpg",`<div class="old-photo">1999 · 北楼跨年夜</div><p style="padding:8px">照片背面蓝圆珠笔：<i>“七个人。小雯拍的。”</i></p>`,{width:"520px",height:"360px",code:"IMG-07"});if(id==="locked")return showDialog("Windows 无法打开此文件。<br>关联程序：ECHO Reader（未找到）");const [title,body]=files[id];createWindow("file-"+id,title,body.startsWith("<")?`<div class="result-page">${body}</div>`:`<textarea class="note-app" readonly>${body}</textarea>`,{width:"510px",height:"370px",code:"LOCAL"})}

function openBrowser(){const html=`<div class="app-toolbar"><button class="win-button" data-home>⌂</button><button class="win-button" data-back>←</button><button class="win-button" data-find>🔍 搜索</button><b>地址</b><input class="address browser-address" value="http://www.wgh-online.cn/"><button class="win-button" data-go>转到</button></div><div class="browser-page"></div>`;const w=createWindow(`browser-${++browserCount}`,"Microsoft Internet Explorer",html,{code:"WGH-00"});w.browserHistory=[];$("[data-home]",w).onclick=()=>renderPage("portal",w);$("[data-back]",w).onclick=()=>browserBack(w);$("[data-find]",w).onclick=()=>renderSearchHome(w);$("[data-go]",w).onclick=()=>navigateBrowser($(".browser-address",w).value,w);$(".browser-address",w).onkeydown=e=>{if(e.key==="Enter")navigateBrowser(e.target.value,w)};renderPage("portal",w);return w}
function addBrowserHistory(w,entry){const last=w.browserHistory.at(-1);if(!last||last.kind!==entry.kind||last.value!==entry.value)w.browserHistory.push(entry)}
function browserBack(w){if(w.browserHistory.length<2)return beep(210,.05);w.browserHistory.pop();const entry=w.browserHistory.pop();if(entry.kind==="page")renderPage(entry.value,w);if(entry.kind==="search")renderSearch(entry.value,w);if(entry.kind==="searchHome")renderSearchHome(w);if(entry.kind==="missing")renderNoResult(entry.value,w)}
function renderSearchHome(w){addBrowserHistory(w,{kind:"searchHome",value:""});$(".browser-address",w).value="http://search.wgh-online.cn/";$(".browser-page",w).innerHTML=`<div class="result-page"><div class="portal-logo" style="background:#000080;padding:8px;font-size:28px">雾港搜索</div><form id="site-search" style="margin:28px 0"><input id="site-query" style="width:min(420px,70%);padding:5px"><button class="win-button">搜索</button></form><p>可以查人名、单位、地名和编号。必须和档案里的写法一样。</p></div>`;$(".page-code",w).textContent="SEARCH";const submit=()=>navigateBrowser($("#site-query",w).value,w);$("#site-search",w).onsubmit=e=>{e.preventDefault();submit()};$("#site-query",w).onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();submit()}};$("#site-query",w).focus()}
function navigateBrowser(q,w){q=q.trim();if(!q)return;const key=Object.keys(searchIndex).find(k=>k.toLowerCase()===q.toLowerCase());if(key)return renderSearch(key,w);if(q.includes("wgh-online")||q==="首页")return renderPage("portal",w);renderNoResult(q,w)}
function renderSearch(key,w){addBrowserHistory(w,{kind:"search",value:key});const item=searchIndex[key];$(".browser-address",w).value=`http://search.wgh-online.cn/?q=${key}`;$(".browser-page",w).innerHTML=`<div class="result-page"><div class="portal-logo" style="background:#000080;padding:8px;font-size:28px">雾港搜索</div><p>搜索：<b>${escapeHtml(key)}</b></p><div class="result-card"><h3><a class="fake-link" data-page="${item.page}">${item.title}</a></h3><small>http://archive.wgh-online.cn/${item.page}.htm</small><p>${item.desc}</p></div></div>`;$(".page-code",w).textContent="SEARCH";$("[data-page]",w).onclick=()=>renderPage(item.page,w)}
function renderNoResult(q,w){addBrowserHistory(w,{kind:"missing",value:q});$(".browser-page",w).innerHTML=`<div class="result-page"><h2>找不到与“${escapeHtml(q)}”相符的网页</h2><p>请检查文字是否完整。本站不支持模糊匹配。</p></div>`}
function renderPage(page,w){w ||= openBrowser();addBrowserHistory(w,{kind:"page",value:page});remember(page);$(".browser-address",w).value=`http://archive.wgh-online.cn/${page}.htm`;$(".page-code",w).textContent=pageCodes[page]||"";const body=$(".browser-page",w);body.innerHTML=pages[page]();$$('[data-page]',body).forEach(a=>a.onclick=()=>renderPage(a.dataset.page,w));$$('[data-search]',body).forEach(a=>a.onclick=()=>renderSearch(a.dataset.search,w));bindPage(page,body,w)}

const pages={
portal:()=>`<div class="ie-page"><header class="portal-head"><div class="portal-logo">雾港在线 <small>WGH ONLINE</small></div><div>今天是 2000 年 1 月 1 日　星期六　00:17</div></header><div class="ticker"><span class="blink">NEW!</span> 千禧年顺利到来 · 市计算机中心称“千年虫”影响有限 · 今夜部分地区电压波动</div><div class="portal-columns"><aside><div class="web-panel"><h3>网站导航</h3><div class="content">新闻<br>聊天室<br><a data-page="timeTower">网页存档</a><br><a data-page="rumors">科学辟谣</a><br><a data-page="polybius">海外奇闻</a><br>同学录<br>免费主页</div></div><div class="ad">免费申请<br><b>10MB</b><br>个人主页</div></aside><main><div class="web-panel"><h3>雾港搜索</h3><div class="content"><div class="search-row"><input id="portal-search"><button class="win-button" id="portal-go">搜索</button></div><small>输入完整人名、地名、机构名或编号</small></div></div><div class="web-panel"><h3>今日要闻</h3><div class="content"><p><a data-search="千年虫">本市平稳跨越千禧年，银行与交通系统运行正常</a></p><p>北楼电梯零点停运，校方称与日期故障无关</p><p><b>市民致电询问：收音机点名节目是否真实存在？</b></p><p>槐荫路旧商铺将在春节后统一更换门牌</p></div></div><div class="web-panel"><h3>校园网公告栏</h3><div class="content"><marquee>不要在机房运行来历不明的“千年虫修复程序”　·　个人主页空间本月免费扩容</marquee></div></div></main><aside><div class="ad">56K 极速上网<br><b>拨号 1702</b></div><div class="web-panel"><h3>热门关键词</h3><div class="content"><a data-search="千年虫">千年虫</a><br>流星雨<br>午夜电台<br>镜中人<br>街机秘闻</div></div><div class="web-panel"><h3>访问计数</h3><div class="content" style="font:20px monospace;background:#000;color:#0f0">001702</div></div></aside></div></div>`,
radioPage:()=>`<div class="result-page"><h1>雾港之声 AM1702 听友纪念页</h1><p><img alt="电台旧台标" style="float:right;width:110px;height:70px;background:navy;border:6px ridge silver">本页收集旧节目表、主持人照片和QSL卡。手里还有录音带的朋友请在留言簿联系。</p><table class="science-table"><tr><th>时间</th><th>节目</th><th>主持</th></tr><tr><td>22:00</td><td>夜航音乐</td><td>深蓝</td></tr><tr><td>23:00</td><td>科学也流行</td><td>罗老师</td></tr><tr><td>00:17</td><td>（节目表被涂改）</td><td>—</td></tr></table><p>纸质QSL卡寄送地址：雾港市槐荫路44号。信封上请写节目名和收听频率，邮资自付。</p><p class="microtext">最后更新：1999-11-07　站长：L.</p></div>`,
frequency:()=>`<div class="result-page"><h1>关于收回 1702 千赫实验频率的通知</h1><p>雾无管字〔1999〕41号</p><p>雾港人民广播电台实验频率 <b>1702 kHz</b> 于十二月三十一日二十四时停止使用，原呼号 WGH-17 同时注销。</p><p>最近有人反映，夜里在外地也能收到该台，这是中波经电离层反射所致。点名节目的名字来自听友来信，不存在电台“自己知道听众姓名”的情况。请各校广播站不要继续转载。</p><p>听友来信、QSL卡仍由槐荫路44号蓝鲸照相馆代收至元月十五日。</p><p style="text-align:right">雾港市无线电管理委员会<br>一九九九年十二月二十日</p></div>`,
yellow:()=>`<div class="result-page"><h1>雾港生活黄页 / 槐荫路</h1><div class="result-card"><h3>42号　永新修表店</h3><p>机械表、石英表、电池。</p></div><div class="result-card"><h3>44号　蓝鲸照相馆</h3><p>冲印、证件照、旧底片扫描。学生凭QSL卡可取活动照片。</p><p><b>店主留言：</b>物理系那个相册又有人输错密码。四个校准灯，照订购单的顺序填原子序数。问波长的一律找梁真去。</p></div><div class="result-card"><h3>46号　红星录像厅</h3><p>已停业。</p></div></div>`,
albumLogin:()=>`<div class="login-box"><h2>蓝鲸网上相册</h2><p>相册：北楼跨年光学实验</p><label>访问口令</label><input id="album-pass" maxlength="7"><button class="win-button" id="album-submit">进入</button><p id="album-error" class="error-text"></p></div>`,
album:()=>`<div class="result-page"><h1>北楼跨年光学实验 / 6 张</h1><p>扫描日期：2000-01-02　送件人：梁真</p><div class="file-grid"><button class="file"><span>🌈</span><label>汞灯</label></button><button class="file"><span>🔶</span><label>氖灯</label></button><button class="file"><span>🟡</span><label>钠灯</label></button><button class="file"><span>🔴</span><label>氢灯</label></button></div><button class="pager-device" id="open-pager" aria-label="查看相册中的 BP 机"><span class="pager-screen">1 CALL</span><i>MOTOROLA</i><b>BP机</b></button><p>照片5：送洗纸袋里夹着的BP机。店员把电池取了，寻呼还留在里面。</p><p class="microtext">冲印袋备注：重复底片先别扔，客人周一来取。</p></div>`,
lumen:()=>`<div class="ie-page" style="background:#000033;color:#ddd;padding:14px;background-image:radial-gradient(#fff 1px,transparent 1px);background-size:37px 31px"><center><h1 style="color:#00ffff">LUMEN'S HOME</h1><p style="color:#ff66cc">梁真的破主页——看完记得踩留言板</p><hr><p>物理系97级 / 短波 / 冲照片 / 修坏收音机</p></center><div style="background:#ddd;color:#111;padding:12px;max-width:620px;margin:auto"><h2>12月27日　互补色</h2><div style="width:90px;height:90px;background:#00d7d7;border-radius:50%;margin:20px auto"></div><p>盯着上面那个蓝绿色圆看二十秒，再看白墙。多数人会看到红圈。小雯说是眼睛把颜色“欠”下来了。罗老师嫌这个说法不严谨，我觉得比他的讲义好懂。</p><p>这周别再玩镜子那个了。三号频闪灯接触不良，照得人脸一截一截的。怪谈版已经有人说镜子慢半拍。</p><p><a data-search="镜子慢一秒">我把实验步骤贴这儿，省得又传歪</a></p><hr><h3>留言板</h3><p><b>深蓝：</b> N17 那盘校准音别播了，晚上整个走廊都听得见。</p><p><b>SW：</b> 名单呢？你说做完就删。</p><p><b>LUMEN：</b> 删了。至少我电脑里没有。</p></div></div>`,
bbs:()=>`<div class="bbs"><h2>[雾大怪谈版] 北楼不存在的 N17</h2><div class="bbs-post"><span class="bbs-user">纸月亮</span> <span class="bbs-time">1999-12-29 22:41</span><p>昨晚电梯停在一楼，显示屏闪了一下N17。门开的时候，走廊尽头有人举着相机。我们七个都在电梯里，那拍照的是谁？</p></div><div class="bbs-post deleted-post"><span class="bbs-user">LUMEN</span> <span class="bbs-time">1999-12-29 23:03</span><p>[该回复已由作者删除]</p><small>存档地址：/bbs/ghost/4172　最后抓取：1999-12-29</small></div><div class="bbs-post"><span class="bbs-user">纸月亮</span> <span class="bbs-time">1999-12-29 23:05</span><p>删这么快？我已经看见门牌那句了。</p></div><div class="bbs-post"><span class="bbs-user">罗盘</span> <span class="bbs-time">2000-01-01 00:17</span><p>本帖涉及未公开实验和学生姓名，锁定。相关同学周一到系办说明情况。</p></div></div>`,
timeTower:()=>`<div class="result-page time-tower"><h1>网络时光塔</h1><p>输入旧页面地址和日期。本站只保存自动抓取过的公开页面。</p><form id="tower-form"><label>页面地址</label><input id="tower-url" placeholder="例如 /bbs/topic/100"><label>抓取日期</label><input id="tower-date" placeholder="YYYY-MM-DD"><button class="win-button">查询</button></form><div id="tower-result"></div></div>`,
archivedBbs:()=>`<div class="bbs"><div class="archive-banner">网络时光塔副本　1999-12-29 23:04</div><h2>[雾大怪谈版] 北楼不存在的 N17</h2><div class="bbs-post"><span class="bbs-user">纸月亮</span> <span class="bbs-time">22:41</span><p>昨晚电梯停在一楼，显示屏闪了一下N17。门开的时候，走廊尽头有人举着相机。</p></div><div class="bbs-post"><span class="bbs-user">LUMEN</span> <span class="bbs-time">23:03</span><p>又来了。门牌是N1-7，北翼一层七室。中间那道横杠掉漆，去年就报修了。照片晚点再说。</p></div></div>`,
labLogin:()=>`<div class="login-box"><h2>北楼 N1-7 档案柜</h2><p>介质：磁光盘　状态：只读</p><label>关联程序 / 项目代号</label><input id="lab-pass"><button class="win-button" id="lab-submit">挂载</button><p id="lab-error" class="error-text"></p><p class="microtext">校准音保存在本机播放列表，不提供文字抄录。</p></div>`,
lab:()=>`<div class="archive-explorer"><div class="archive-path">E:\\ECHO\\9912\\</div><div class="archive-head"><span>名称</span><span>大小</span><span>修改日期</span></div><button class="archive-file" data-lab-file="proposal"><span>📝　立项申请_第三稿.doc</span><small>24 KB</small><small>1999-09-18 11:20</small></button><button class="archive-file" data-lab-file="liang"><span>📝　梁真说明_未交.doc</span><small>6 KB</small><small>1999-12-24 03:07</small></button><button class="archive-file" data-lab-file="consent"><span>📝　告知书_补充页.doc</span><small>9 KB</small><small>1999-12-26 22:43</small></button><button class="archive-file" data-lab-file="schedule"><span>📊　12月排班.xls</span><small>18 KB</small><small>1999-12-27 16:40</small></button><button class="archive-file" data-lab-file="radio"><span>📄　1702点名核对.txt</span><small>3 KB</small><small>1999-12-30 02:11</small></button><button class="archive-file" data-lab-file="photo-check"><span>📝　洗印问题_请小梁看.doc</span><small>7 KB</small><small>1999-12-31 19:06</small></button><button class="archive-file" data-lab-file="interview"><span>📁　访谈记录_第二轮</span><small>—</small><small>2000-01-01 00:11</small></button><button class="archive-file" data-lab-file="roster"><span>📄　名单_最终版2.txt</span><small>0 KB</small><small>2000-01-01 00:17</small></button><button class="archive-file protected" data-lab-file="case98"><span>📁　CASE_98</span><small>受保护</small><small>1999-12-04 18:22</small></button><button class="archive-file protected" data-lab-file="sw"><span>📁　SW</span><small>受保护</small><small>2000-01-01 04:58</small></button><div class="archive-status">10 个对象　磁光盘：只读</div></div>`,
report:()=>`<div class="result-page memo-page"><h1>关于暂停ECHO实验的通知</h1><p>罗老师、梁真：</p><p>系里刚开完会。ECHO从今天起暂停，N1-7的钥匙下午交到办公室。</p><p>请在周一前把下面几项处理好：</p><ol><li>点名节目的来信名单退还广播站；</li><li>镜面录像和访谈录音封盘，不再复制；</li><li>蓝鲸照相馆的底片、BP机由本人领取；</li><li>BBS上的学生姓名全部删除。</li></ol><p>邵雯已经退出观察组。她的离校手续是本人办理的，不要再以“失踪”为题发帖。</p><p>各组交原始记录，不要补写或统一说法。</p><p style="text-align:right">物理系办公室<br>2000年1月2日</p><div class="paper-note">（磁盘袋背面，蓝笔）<br>SW那个目录：翻“好运邮件”，每段头一个字。<br>——梁</div></div>`,
ending:()=>`<div class="ending-page letter-page"><h1>给梁真.txt</h1><p>梁真：</p><p>我在长途站。买了五点四十去南州的票，雪大，车还没进站。</p><p>昨晚有三个人堵在宿舍门口，问我是不是照片里“多出来的那个”。你帖子里没写名字，可你写了SW。广播站里谁不知道SW是谁。</p><p>我知道你为什么非要把实验做完。许宁出事那晚你值机，别人说了一年是你放错带。你确实没换带，可“午夜会叫名字”那条帖子也是你写的。你不能只证明前一半。</p><p>罗老师把我的试音接进节目，你帮他剪了。你们决定让我“临时参加”的时候，没人问过我。昨晚你让我等做完再说，我就知道没什么可说的了。</p><p>宿舍钥匙在你那本《无线电手册》下面。QSL那箱信记得还回去，里面都是地址。</p><p>底片的事我最后说一遍：照片是我拍的，取景器里七个人。第二下闪光的时候你动了，重影是你。别再让蓝鲸冲了。</p><p>我已经办完退宿。等我到了南州会给家里打电话。不要再发帖找我。</p><p>邵雯<br>1月1日　长途站</p><div class="file-properties"><b>给梁真.txt</b><br>创建：2000-01-01 04:52<br>修改：2000-01-01 04:58<br>访问：${new Date().toLocaleString("zh-CN")}</div><button id="end-reset">退出恢复程序</button></div>`,
xuning:()=>`<div class="result-page newspaper"><h1>女生深夜听错点名　停电下楼摔伤</h1><p class="byline">本报记者　陈方　1998年11月7日</p><p>本月四日晚，雾港大学一年级学生许宁在宿舍收听“雾港之声”。她以为主持人念了两次“许宁”。几分钟后宿舍停电，她摸黑下楼时踩空，右手腕骨折。</p><p>广播台重听节目带后确认，主持人当时读的是一封南州听友来信，署名“徐玲”。中波信号有杂音，“徐玲”和“许宁”听起来很接近。</p><p>许宁的室友说，她们那几天刚听过“午夜电台会叫出听众名字”的传闻，所以听见姓徐、许的名字时都吓了一跳。</p><p>学校后勤处称，一舍当晚更换变压器接线，停电时间原定23时50分。通知传真误发到已搬走的宿管办公室，没有贴到楼下。</p><p>当晚值机的是雾港大学学生梁真。学校里有人传他临时换过节目带，梁真否认。广播台表示母带没有剪接痕迹。</p><p>校广播站罗绍明老师准备重做当时的收听环境，看看杂音、停电和事先听过的传闻是否会影响辨认。</p></div>`,
lettersArchive:()=>`<div class="result-page"><h1>听友来信移交清单</h1><p>雾港之声停播后，资料室把未退回的听友信装成六箱。姓名、地址、点播内容均未作匿名处理。</p><table class="science-table"><tr><th>箱号</th><th>年份</th><th>数量</th><th>领取人</th></tr><tr><td>QSL-94</td><td>1994</td><td>311</td><td>市档案馆</td></tr><tr><td>QSL-97</td><td>1997</td><td>428</td><td>市档案馆</td></tr><tr><td>QSL-98</td><td>1998</td><td>516</td><td>雾港大学广播站（借）</td></tr><tr><td>QSL-99</td><td>1999</td><td>203</td><td>蓝鲸照相馆代存</td></tr></table><p>QSL-98箱原定十二月十五日归还，至今未还。借条签名：罗绍明。</p><p style="text-align:right">资料员　吴秀琴<br>2000年1月3日</p></div>`,
rumors:()=>`<div class="result-page"><h1>《雾港晚报》千年虫答读者问</h1><p><b>问：</b>元旦一到，家里的电脑会不会烧掉？</p><p><b>市计算机中心周工：</b>不会烧。麻烦主要在日期。老程序只留两位年份，00可能被当成1900，账单、利息和排序就会出错。关机也不是坏事，至少别在零点改重要文件。</p><p><b>问：</b>微波炉煮鸡蛋会不会失控？</p><p><b>答：</b>普通微波炉不管今天是哪年。鸡蛋会炸，是壳里面的水汽出不来。</p><p><b>问：</b>机房摆仙人掌有用吗？</p><p><b>答：</b>浇水有用，防辐射没听说有用。</p><p style="text-align:right">记者　许玲</p></div>`,
afterimage:()=>`<div class="result-page"><h1>N1-7实验记录（节选）</h1><p>12月27日，关顶灯，频闪调到每秒八次。六人报告镜中动作“卡住”或“慢半拍”。开顶灯后再试，无人报告异常。</p><p>12月28日，实验前给三人看怪谈版帖子。三人均报告异常；未看帖组仅一人报告。罗老师说样本太少，不能写进报告。</p><p>梁真在页边画了一个蓝绿色圆，旁边写：<i>“先看二十秒，再看白墙。残像也会骗人。”</i></p></div>`,
polybius:()=>`<div class="bbs"><h2>[转载] 美国有台玩了会失忆的街机？</h2><div class="bbs-post"><span class="bbs-user">老猫译</span> <span class="bbs-time">1999-11-14 20:31</span><p>原帖说1981年波特兰有台黑柜街机，名字叫POLYBIUS。有人玩完做噩梦，还有黑衣人来抄机器里的数。原文没照片，店名也没写，我只翻个热闹。</p></div><div class="bbs-post"><span class="bbs-user">录像厅阿健</span> <span class="bbs-time">1999-11-14 21:08</span><p>红星后屋以前就有台黑的。没名字，开机一排白字。老板从来不让碰。</p></div><div class="bbs-post"><span class="bbs-user">工商所小王</span> <span class="bbs-time">1999-11-15 09:12</span><p>红星登记的是录像放映，没办过电子游戏项目。你们谁真见过，画个操作台出来，别又拿《电子游戏软件》上的图。</p></div><div class="bbs-post"><span class="bbs-user">录像厅阿健</span> <span class="bbs-time">1999-11-15 23:47</span><p>算了，当我没说。</p></div></div>`
};

function bindPage(page,root,w){
  if(page==="portal"){const go=()=>navigateBrowser($("#portal-search",root).value,w);$("#portal-go",root).onclick=go;$("#portal-search",root).onkeydown=e=>{if(e.key==="Enter")go()}}
  if(page==="timeTower"){$("#tower-form",root).onsubmit=e=>{e.preventDefault();const url=$("#tower-url",root).value.trim().replace(/^https?:\/\/[^/]+/i,"").replace(/\/$/,"");const date=$("#tower-date",root).value.trim();const result=$("#tower-result",root);if(url==="/bbs/ghost/4172"&&date==="1999-12-29"){result.innerHTML=`<div class="archive-hit"><b>抓取 1 次</b><br><button class="archive-link" type="button">1999-12-29 23:04　北楼不存在的 N17</button><br><small>正文 2.1 KB，图片未保存</small></div>`;$(".archive-link",result).onclick=()=>renderPage("archivedBbs",w)}else result.innerHTML=`<p class="archive-miss">这个地址在所选日期没有抓取记录。</p>`}}
  if(page==="album")$("#open-pager",root).onclick=openPager;
  if(page==="lab")$$('[data-lab-file]',root).forEach(file=>file.onclick=()=>openLabFile(file.dataset.labFile));
  if(page==="albumLogin")$("#album-submit",root).onclick=()=>{$("#album-pass",root).value.trim()==="8010111"?renderPage("album",w):$("#album-error",root).textContent="口令错误"};
  if(page==="labLogin")$("#lab-submit",root).onclick=()=>{$("#lab-pass",root).value.trim().toLowerCase()==="echo"?renderPage("lab",w):$("#lab-error",root).textContent="找不到关联项目"};
  if(page==="ending")$("#end-reset",root).onclick=resetGame;
}

function openLabFile(id){
  const docs={
    proposal:["立项申请_第三稿.doc",`项目名称：ECHO（校园传闻与听觉辨认）\n负责人：罗绍明\n\n去年许宁把节目里的“徐玲”听成了“许宁”。宿舍随后停电，她下楼时摔伤。节目带本身没有问题，但听过午夜点名传闻的两名学生都说自己听见了“许宁”。\n\n计划重做当晚的几个条件：中波杂音、突然断灯、实验前流传的帖子。两组人听同一段节目，一组先看帖子，一组不看，再比较他们写下的人名。\n\n不做惊吓，不关门，不使用参加者真名。任何人说停就停。\n\n附件：1998年《雾港晚报》许宁报道。`],
    liang:["梁真说明_未交.doc",`许宁出事那晚是我值机。节目里念的是南州听友徐玲，我记得，因为那封信是我放进播音夹的。\n\n事后我和罗老师一起听母带，里面也是徐玲。可学校里还是传我偷偷剪进了许宁的名字。有人说母带是我后来换的，广播站停了我两个月。\n\n他们为什么先怀疑我，我知道。十月底那条“午夜会叫到你的名字”是我发的。《夜航音乐》没人听，我想在BBS上弄个噱头。原帖写了“瞎编的”，被人转出去以后那句没了。\n\n罗老师说，只要换一批人听同一段节目，就能证明听过传闻的人会把徐玲听成许宁。ECHO的机器、剪带和网页都是我做的。我想把这件事做完，至少能把当年的值机记录说清楚。\n\n12月新增的真实姓名不是原方案。我知道补充页没人签。\n\n（以下删除）\n如果这次结果出来，就能证明我没换带。可那个帖子——`],
    consent:["告知书_补充页.doc",`补充项目（12月26日）\n\n1. 录音可加入参加者熟悉的姓名。\n2. 观察员可在实验过程中临时参与。\n3. 为避免影响结果，以上内容不在实验前说明。\n\n参加者签名：＿＿＿＿＿＿＿＿\n观察员签名：＿＿＿＿＿＿＿＿\n\n页边铅笔：\n“这不是补充，是换了一个实验。没人签过。——邵”`],
    schedule:["12月排班.xls",`12月28日　罗 / 梁　　N1-7　镜面录像\n12月29日　梁 / 邵　　广播站　名单录音\n12月30日　罗 / 邵　　N1-7　照片辨认\n12月31日　全员　　　 N1-7　第二轮访谈\n\n小雯说31号不来。罗老师让我先别改表，说观察员不算参加者。\n——梁`],
    radio:["1702点名核对.txt",`23:00节目带　姓名17个\n听友来信名单　姓名42个\n实验参加者　7人\n\n纸月亮：节目带有，来信里也有\n老猫：节目带有，来信里也有\n梁真：节目带没有\n邵雯：试音带里有一声“小雯”，不是节目内容\n\n12/30　罗老师让把试音带接到空白段后面。小雯不同意，走了。\n\n来信原件没还。站内索引或许还能查到“听友来信”。`],
    "photo-check":["洗印问题_请小梁看.doc",`蓝鲸的孙师傅来电话，说同一格底片洗出两个人影。\n\n我看过放大片：右边那个人是梁真。曝光时他动了，第二次闪光又照到一次。相机没坏，不用赔。\n\n底片和BP机都在冲印袋。小雯说周一自己去拿。\n\n——罗绍明　12/31`],
    interview:["访谈记录_第二轮",`<div class="folder-note"><p>文件夹无法完整读取。</p><ul><li>01_纸月亮.wav　12 KB</li><li>02_老猫.wav　9 KB</li><li>03_小庄.wav　11 KB</li><li>04_SW.wav　0 KB</li></ul><p>磁盘表面有划痕。04号文件长度为零。</p></div>`]
  };
  if(id==="roster")return showDialog("无法打开“名单_最终版2.txt”。<br>文件长度为 0 字节。");
  if(id==="case98")return openCaseArchive();
  if(id==="sw")return openSwArchive();
  const [title,body]=docs[id];
  createWindow("lab-"+id,title,body.startsWith("<")?`<div class="result-page">${body}</div>`:`<textarea class="note-app" readonly>${body}</textarea>`,{width:"540px",height:"390px",code:"ECHO"});
}

function openCaseArchive(){
  const w=createWindow("case98","CASE_98 - 受保护的文件夹",`<div class="login-box"><h2>资料箱核对</h2><p>输入原始资料的箱号和目录件数，去掉横线。</p><label>核对码</label><input id="case-pass"><button class="win-button" id="case-open">确定</button><p id="case-error" class="error-text"></p></div>`,{width:"520px",height:"360px",code:"LOCAL"});
  $("#case-open",w).onclick=()=>{
    if($("#case-pass",w).value.trim().toLowerCase()!=="qsl98516"){$("#case-error",w).textContent="箱号或件数不符。";return}
    $(".title",w).textContent="CASE_98";
    $(".window-body",w).innerHTML=`<div class="archive-explorer"><div class="archive-path">E:\\ECHO\\9912\\CASE_98\\</div><div class="archive-head"><span>名称</span><span>大小</span><span>修改日期</span></div><button class="archive-file" data-case-file="promo"><span>📄　BBS广告缓存_9810.txt</span><small>5 KB</small><small>1998-11-06 10:18</small></button><button class="archive-file" data-case-file="letter"><span>📝　QSL-98_徐玲来信.txt</span><small>4 KB</small><small>1998-10-18 13:20</small></button><button class="archive-file" data-case-file="tape"><span>📄　981104节目抄本.txt</span><small>6 KB</small><small>1998-11-05 01:12</small></button><button class="archive-file" data-case-file="custody"><span>📋　值机带交接记录.txt</span><small>4 KB</small><small>1998-11-05 09:03</small></button><button class="archive-file" data-case-file="power"><span>📠　一舍停电通知_传真.txt</span><small>3 KB</small><small>1998-11-05 08:26</small></button><button class="archive-file" data-case-file="mail"><span>✉　罗老师给梁真.eml</span><small>8 KB</small><small>1999-08-29 23:41</small></button><button class="archive-file" data-case-file="review"><span>📊　事故复核_空表.xls</span><small>11 KB</small><small>2000-01-02 08:51</small></button><div class="archive-status">7 个对象</div></div>`;
    $(".page-code",w).textContent="CASE98";
    $$('[data-case-file]',w).forEach(file=>file.onclick=()=>openCaseFile(file.dataset.caseFile));
  };
  $("#case-pass",w).onkeydown=e=>{if(e.key==="Enter")$("#case-open",w).click()};
}

function openCaseFile(id){
  const docs={
    promo:["BBS广告缓存_9810.txt",`[雾大闲聊版] 今晚别太早关收音机\n发帖：LUMEN　1998-10-29 19:42\n\n《夜航音乐》十一月换新片头。半夜还在听的人小心，主持人可能会突然叫到你的名字。叫到了记得来回帖，送节目贴纸。\n\n——以上瞎编的。总之AM1702，晚上十点，给点面子。\n\n[转帖记录]\n纸月亮：午夜电台会点还醒着的人的名字，据说被点到不能回头。\n老猫：广播站有人做过，真会念宿舍里的人。\n录像厅阿健：转，今晚试试。\n\n[原帖于11月5日00:52被作者删除]`],
    letter:["QSL-98_徐玲来信.txt",`雾港之声的主持人，你好：\n\n我叫徐玲，在南州纺织厂上班。你们这边晚上信号比南州台还清楚。我想给妹妹徐敏点一首《星星点灯》，她今年考大学，最近老睡不好。\n\n如果念信，请念“南州的徐玲”，她听见就知道是我。\n\n地址：南州市东河区纺织路18号3栋\n徐玲\n1998.10.16`],
    tape:["981104节目抄本.txt",`23:46:51　主持：下面这封信来自南州的徐玲。她想把《星星点灯》送给正在准备高考的妹妹徐敏。\n23:47:02　（中波杂音，约4秒）\n23:47:06　主持：徐敏，姐姐说别熬得太晚。\n23:47:11　歌曲开始\n23:52:34　线路电压下降\n23:52:41　雾大一舍停电\n\n值机：梁真\n复核：罗绍明`],
    custody:["值机带交接记录.txt",`11月4日\n22:55　A机节目带领出　梁真\n23:43　B机听友来信带领出　梁真\n00:30　A、B机节目带回库　梁真\n\n11月5日\n00:36　申请保留监听副本　梁真\n01:08　监听副本录制完成　梁真\n08:20　昨夜直播工作带已由早间节目覆盖\n09:00　监听副本交罗绍明复核\n\n备注：台内监听机不自动存档。现存副本为梁真在事故后自行倒录，无法与直播工作带复核。`],
    power:["一舍停电通知_传真.txt",`雾港大学后勤处停电通知\n\n11月4日23:50至次日00:20，一舍更换变压器低压侧接线。请宿管提前通知学生，楼梯口保留应急灯。\n\n传真发送：11月3日 14:06\n接收号码：2714\n\n手写补记：\n2714是旧宿管办，九月搬走后改成2731。通知没有收到。\n一楼西侧应急灯电池失效。\n——后勤处王海`],
    mail:["罗老师给梁真.eml",`发件人：罗绍明 <luosm@wgh.edu>\n收件人：梁真 <lumen@wgh.edu>\n日期：1999年8月29日 23:41\n主题：许宁那件事可以重做\n\n小梁：\n\n我听了你留下的带子，主持人念的是徐玲，这一点没问题。别人不信，是因为他们已经先听说“值机员偷偷点了许宁”。你再拿母带解释十遍也没用。\n\n我们可以换一批学生做盲听。一半人先看午夜点名的帖子，一半人什么都不看。要是前一组更容易写成许宁，你的值机责任也就说得清了。\n\n这事对你是澄清，对我也能写一篇会上的报告。设备我去借，你负责录音和网页。先别跟广播台提，他们怕又上报纸。\n\n罗`]
  };
  if(id==="review")return openIncidentReview();
  const [title,text]=docs[id];
  createWindow("case-"+id,title,`<textarea class="note-app" readonly>${text}</textarea>`,{width:"610px",height:"470px",code:"CASE98"});
}

function openIncidentReview(){
  const w=createWindow("incident-review","事故复核_空表.xls",`<div class="review-sheet"><h2>广播事故原始记录复核</h2><p>编号：98-1104　经办栏：＿＿＿＿</p><table><tr><th>复核项</th><th>原件记录</th></tr><tr><td>B带来信署名</td><td><input id="review-name" autocomplete="off"></td></tr><tr><td>计划断电起始（HHMM）</td><td><input id="review-power" inputmode="numeric" maxlength="4"></td></tr><tr><td>通知传真接收号</td><td><input id="review-fax" inputmode="numeric" maxlength="4"></td></tr><tr><td>现存副本生成（HHMM）</td><td><input id="review-copy" inputmode="numeric" maxlength="4"></td></tr></table><button class="win-button" id="review-submit">送交复核</button><p id="review-error" class="error-text"></p><small>四栏均按原件填写。冒号、空格不录。</small></div>`,{width:"580px",height:"480px",code:"98-1104"});
  $("#review-submit",w).onclick=()=>{
    const values=[$("#review-name",w).value.trim(),$("#review-power",w).value.trim(),$("#review-fax",w).value.trim(),$("#review-copy",w).value.trim()];
    if(values[0]!=="徐玲"||values[1]!=="2350"||values[2]!=="2714"||values[3]!=="0108"){$("#review-error",w).textContent="复核未通过。回执未生成。";return}
    $(".window-body",w).innerHTML=`<div class="review-receipt"><h2>复核回执　98-1104-B</h2><p>原始记录与节目抄本一致。事故材料转入 ECHO 项目，复核人：罗绍明。</p><p>附件索引：</p><button class="archive-file" id="review-summary"><span>🌐　ECHO结项摘要.url</span><small>1 KB</small><small>2000-01-02 09:24</small></button><p class="paper-note">旧服务器关了。快捷方式打不开就把文件名扔进雾港搜索。<br>——机房小周</p></div>`;
    $("#review-summary",w).onclick=()=>showDialog("Internet 快捷方式的目标不存在。<br><br><span class='mono-line'>http://search.wgh-online.cn/?q=ECHO结项摘要</span>");
  };
}

function openSwArchive(){
  const w=createWindow("sw-archive","SW - 受保护的文件夹",`<div class="login-box"><h2>请输入密码</h2><p>文件夹 E:\\ECHO\\9912\\SW 已加密。</p><label>密码</label><input id="sw-pass" type="password"><button class="win-button" id="sw-open">确定</button><p id="sw-error" class="error-text"></p></div>`,{width:"520px",height:"360px",code:"LOCAL"});
  $("#sw-open",w).onclick=()=>{
    if($("#sw-pass",w).value.trim()!=="零点之后别回头"){$("#sw-error",w).textContent="密码错误。";return}
    $(".title",w).textContent="SW";
    $(".window-body",w).innerHTML=`<div class="archive-explorer"><div class="archive-path">E:\\ECHO\\9912\\SW\\</div><div class="archive-head"><span>名称</span><span>大小</span><span>修改日期</span></div><button class="archive-file" data-sw-file="argument"><span>📄　31日争执录音_转写.txt</span><small>5 KB</small><small>2000-01-01 03:14</small></button><button class="archive-file" data-sw-file="interviews"><span>📊　两轮访谈对照.xls</span><small>12 KB</small><small>2000-01-01 03:36</small></button><button class="archive-file" data-sw-file="bbs-cache"><span>📄　BBS删帖缓存.txt</span><small>7 KB</small><small>2000-01-01 03:52</small></button><button class="archive-file" data-sw-file="ticket"><span>🖼　车票.bmp</span><small>86 KB</small><small>2000-01-01 04:49</small></button><button class="archive-file" data-sw-file="letter"><span>📝　给梁真.txt</span><small>4 KB</small><small>2000-01-01 04:58</small></button><div class="archive-status">5 个对象</div></div>`;
    $(".page-code",w).textContent="SW";
    $$('[data-sw-file]',w).forEach(file=>file.onclick=()=>openSwFile(file.dataset.swFile));
  };
  $("#sw-pass",w).onkeydown=e=>{if(e.key==="Enter")$("#sw-open",w).click()};
}

function openSwFile(id){
  if(id==="letter"){
    const w=createWindow("sw-letter","给梁真.txt - 记事本",pages.ending(),{width:"660px",height:"560px",code:"TXT"});
    $("#end-reset",w).onclick=resetGame;
    return;
  }
  if(id==="argument")return createWindow("sw-argument","31日争执录音_转写.txt",`<textarea class="note-app" readonly>时间：12月31日 22:18\n地点：广播站小录音室\n\n邵：停一下。刚才那声“小雯”是哪来的？\n梁：下午试话筒那盘。我就剪了一秒。\n邵：谁让你剪的？\n罗：是我。熟悉的名字更容易听出来，我们得有一条能确认的。\n邵：告知书上没这条。\n罗：补充页明天补签。你是观察员，不是参加者。\n邵：声音是我的，名字也是我的。\n梁：做完今晚再说行不行？机器和人都约好了。\n邵：你不是想做实验。你就是想证明许宁那晚不是你放错带。\n梁：本来就不是。母带你也听过。\n邵：那你就拿我的名字去证明？\n\n（椅子响。门关上。）\n\n罗：先继续。把她那条从正式记录里删掉。</textarea>`,{width:"620px",height:"500px",code:"SW-01"});
  if(id==="interviews")return createWindow("sw-interviews","两轮访谈对照.xls",`<div class="result-page"><table class="science-table"><tr><th>人</th><th>单独问（23:40）</th><th>一起问（00:10）</th></tr><tr><td>纸月亮</td><td>电梯灯闪；走廊有人</td><td>N17；照片多一个人</td></tr><tr><td>老猫</td><td>听见像人声的杂音</td><td>电台叫了七个人</td></tr><tr><td>小庄</td><td>镜子里的灯有重影</td><td>镜子慢了一秒</td></tr></table><div class="paper-note">第一轮谁都没说N17。第二轮让他们坐一起，纸月亮先提了照片，后面的人全跟着说。<br><br>罗老师要把第一轮表收走。我留了这份。——邵</div></div>`,{width:"680px",height:"480px",code:"SW-02"});
  if(id==="bbs-cache")return createWindow("sw-bbs-cache","BBS删帖缓存.txt",`<textarea class="note-app" readonly>[雾大怪谈版] 关于N17和那张照片\n发帖：LUMEN　01/01 01:26\n\nN17就是N1-7，门牌掉了一横。照片是重复曝光。SW是拍照的人，不在照片里。她已经退出实验，别再编“第八个人失踪”了。\n\n--- 回复 ---\n纸月亮　01:31\n那她为什么突然走？\n\n录像厅阿健　01:34\nSW不就是广播站邵雯吗？四舍那个？\n\n老猫　01:39\n去问本人最快。谁知道房间？\n\n小庄　01:44\n407还是417，我记得门口贴了电台海报。\n\n[本帖于 02:08 被作者删除]\n\n缓存备注：四舍值班记录，02:11有三名外来学生登记上楼。</textarea>`,{width:"650px",height:"520px",code:"SW-03"});
  if(id==="ticket")return createWindow("sw-ticket","车票.bmp",`<div class="ticket-scan"><b>雾 港 汽 车 客 运 票</b><br><br>雾港 → 南州<br>2000-01-01　05:40<br>座号　17<br><small>售出时间：04:41　售票窗：03</small></div>`,{width:"520px",height:"360px",code:"BMP"});
}

function openPager(){
  const messages=[
    ["01/01　00:17","12-21-13-05-14"],
    ["12/31　23:51","N17　别上来"],
    ["12/31　18:04","英文留言不能显示，\n营业员改发字母序号。"]
  ];
  const w=createWindow("pager-log","BP机 - 寻呼记录",`<div class="pager-shell"><div class="pager-screen large" id="pager-message"></div><div class="pager-help">◀ 上一条　中键看背贴　下一条 ▶</div><div class="pager-buttons"><button id="pager-prev" aria-label="上一条寻呼">◀</button><button id="pager-back" aria-label="查看 BP 机背面">●</button><button id="pager-next" aria-label="下一条寻呼">▶</button></div><b>MOTOROLA</b></div>`,{width:"440px",height:"390px",code:"PAGER"});
  let index=0,back=false;
  const render=()=>{
    const screen=$("#pager-message",w);
    if(back){
      screen.innerHTML=`<div class="pager-sticker"><b>英文代发速查</b><br>A 01　B 02　C 03　D 04　E 05<br>F 06　G 07　H 08　I 09　J 10<br>K 11　L 12　M 13　N 14　O 15<br>P 16　Q 17　R 18　S 19　T 20<br>U 21　V 22　W 23　X 24　Y 25　Z 26<br><small>槐荫路寻呼台</small></div>`;
    }else{
      const [date,text]=messages[index];
      screen.innerHTML=`<small>寻呼 ${index+1}/${messages.length}</small><br><br>${date}<br>${text.replace("\n","<br>")}`;
    }
  };
  $("#pager-prev",w).onclick=()=>{back=false;index=(index+messages.length-1)%messages.length;render()};
  $("#pager-next",w).onclick=()=>{back=false;index=(index+1)%messages.length;render()};
  $("#pager-back",w).onclick=()=>{back=!back;render()};
  render();
}

function openMail(){const rows=mails.map((m,i)=>`<button class="mail-row ${state.mail.includes(m.id)?'':'unread'}" data-mail="${i}">${escapeHtml(m.subject)}<br><small>${m.from.split("<")[0]}</small></button>`).join("");const w=createWindow("mail","Outlook Express",`<div class="app-toolbar"><b>本地文件夹</b>　收件箱 (${mails.length})</div><div class="mail-app"><div class="mail-list">${rows}</div><div class="mail-view"><p>选择一封邮件阅读。</p></div></div>`,{code:"MAIL"});$$('[data-mail]',w).forEach(b=>b.onclick=()=>{const m=mails[+b.dataset.mail];b.classList.remove("unread");$$('.mail-row',w).forEach(x=>x.classList.remove("active"));b.classList.add("active");$(".mail-view",w).innerHTML=`<div class="mail-meta"><b>${m.subject}</b><br>发件人：${escapeHtml(m.from)}<br>日期：${m.date}</div>${m.body}`;if(!state.mail.includes(m.id)){state.mail.push(m.id);save()}})}
function openRadio(){const bars=Array.from({length:34},(_,i)=>`<i style="--h:${12+(i*17%55)}px"></i>`).join("");const w=createWindow("radio","WINAMP 2.64",`<div class="radio-app"><div class="radio-screen"><b id="radio-title">NO SIGNAL</b><div class="spectrum">${bars}</div><span id="radio-display">----　STOP</span></div><form class="radio-tuner" id="radio-tuner"><label>AM <input id="radio-frequency" inputmode="numeric" maxlength="4" value="1000"> kHz</label><button type="submit">TUNE</button></form><div class="radio-controls"><button id="radio-play" aria-label="播放">▶</button><button id="radio-stop" aria-label="停止">■</button></div><div class="playlist" id="radio-playlist"><span>先调到节目频率读取播放列表。</span></div></div>`,{width:"430px",height:"350px",code:"RADIO"});let tuned=false,selected="";$("#radio-tuner",w).onsubmit=e=>{e.preventDefault();if($("#radio-frequency",w).value.trim()!=="1702"){$("#radio-title",w).textContent="NO SIGNAL";$("#radio-display",w).textContent="频率不对";return}tuned=true;$("#radio-title",w).textContent="1702 AM";$("#radio-display",w).textContent="00:00　READY";$("#radio-playlist",w).innerHTML=`<button data-track="intro">01 夜航片头.mp3　03:12</button><button data-track="ion">02 电离层说明.mp3　05:40</button><button data-track="calibration">03 CALIBRATION_05.WAV　00:11</button><button data-track="names">04 点名节目_残片.wav　00:17</button>`;$$('[data-track]',w).forEach(track=>track.onclick=()=>{$$('[data-track]',w).forEach(x=>x.classList.remove("selected"));track.classList.add("selected");selected=track.dataset.track;$("#radio-display",w).textContent=track.textContent.trim()});$(".page-code",w).textContent="1702"};$("#radio-play",w).onclick=()=>{if(!tuned)return $("#radio-display",w).textContent="先调频";if(!selected)return $("#radio-display",w).textContent="先选一段录音";if(selected!=="calibration")return $("#radio-display",w).textContent="普通录音，无校准码";playMorse(w)};$("#radio-stop",w).onclick=()=>{$("#radio-display",w).textContent="00:00　STOP"}}
async function playMorse(w){const code=". -.-. .... ---";$("#radio-display",w).textContent=code;state.radio=true;save();if(!sound)return;for(const c of code){if(c===".")beep(690,.09);if(c==="-")beep(690,.26);await new Promise(r=>setTimeout(r,c===" "?240:130))}}
function openNotes(){const text=localStorage.getItem("fogharbor-notes")||"雾港在线调查记录\n================\n\n";const w=createWindow("notes","无标题 - 记事本",`<textarea class="note-app" spellcheck="false">${escapeHtml(text)}</textarea>`,{width:"520px",height:"430px",code:"NOTES"});$("textarea",w).oninput=e=>localStorage.setItem("fogharbor-notes",e.target.value)}
function openTrash(){const w=createWindow("trash","回收站",`<div class="trash"><div class="trash-item"><span style="font-size:32px">📄</span><div><b>participants_final_FINAL2.txt</b><br><small>删除日期：2000/01/01 00:17</small></div><button class="win-button" id="restore-file">还原</button></div><div class="trash-item"><span style="font-size:32px">🖼</span><div><b>第八张脸.bmp</b><br><small>文件大小：0 字节</small></div></div></div>`,{width:"530px",height:"310px",code:"TRASH"});$("#restore-file",w).onclick=()=>createWindow("participants","participants_final_FINAL2.txt",`<textarea class="note-app" readonly>参与者：7\n研究助理：梁真（LUMEN）\n观察员：邵雯（SW）\n\n备注：观察员不计入合照人数。她按下快门。\n\n删除请求人：SW</textarea>`,{width:"470px",height:"330px",code:"DELETED"})}
function showDialog(message){const d=$("#system-dialog");d.innerHTML=`<div class="restore-title">系统提示</div><div class="body">${message}<div class="actions"><button class="win-button">确定</button></div></div>`;d.hidden=false;$("button",d).onclick=()=>d.hidden=true;beep(210,.12)}
function escapeHtml(s){const d=document.createElement("div");d.textContent=s;return d.innerHTML}
function resetGame(){localStorage.removeItem("fogharbor-state");localStorage.removeItem("fogharbor-notes");location.reload()}

$("#restore").onclick=()=>{sound=$("#sound-toggle").checked;$("#cold-open").hidden=true;$("#desktop").hidden=false;beep(740,.1);setTimeout(()=>beep(900,.08),100)};
$$('[data-open]').forEach(b=>b.onclick=e=>{e.stopPropagation();openApp(b.dataset.open)});
$("#start").onclick=e=>{e.stopPropagation();$("#start-menu").hidden=!$("#start-menu").hidden};
document.addEventListener("click",()=>$("#start-menu").hidden=true);
$("#shutdown").onclick=()=>showDialog("现在可以安全地关闭计算机。<br><br><small>系统时钟仍停在 00:17。</small>");
setInterval(()=>{$("#clock").textContent=state.radio?"00:18":"00:17"},1000);

if(new URLSearchParams(location.search).has("selftest")){
  console.assert(Object.keys(searchIndex).length>=11,"search index too small");
  console.assert(pages.album&&pages.report&&pages.ending,"critical pages missing");
  console.assert("汞氖钠氢".length===4,"lamp chain invalid");
  document.documentElement.dataset.selftest="passed";
}
