const clients = [
 {name:"Shreyas",id:"BRCLT-45871293",password:"SHR129",balance:4500000000,pending:1500,limit:1000000},
 {name:"Rana",id:"BRCLT-58392147",password:"RAN129",balance:5500000000,pending:2500,limit:1000000},
 {name:"Gani",id:"BRCLT-76120438",password:"GAN129",balance:7000000,pending:2500,limit:500000},
 {name:"Nadeem",id:"BRCLT-84931572",password:"NAD129",balance:1500000000,pending:1500,limit:1000000},
 {name:"Dhanush",id:"BRCLT-62481735",password:"DHA129",balance:900000,pending:1500,limit:250000},
 {name:"Shabana",id:"BRCLT-91746380",password:"SHA129",balance:0,pending:2500,limit:100000},
 {name:"Devraj",id:"BRCLT-53829461",password:"DEV129",balance:8000000,pending:2500,limit:500000},
 {name:"Bharth",id:"BRCLT-67291543",password:"BHA129",balance:8500000,pending:2500,limit:500000},
 {name:"Yashvantha",id:"BRCLT-38572614",password:"YAS129",balance:4000000,pending:2500,limit:500000},
 {name:"Adarsh",id:"BRCLT-74163825",password:"ADA129",balance:9500000,pending:2500,limit:500000},
 {name:"Prashanth",id:"BRCLT-29641583",password:"PRA129",balance:6500000,pending:2500,limit:500000}
];

const market = [
 ["RELIANCE","Reliance Industries",2941.20,1.42],
 ["TCS","Tata Consultancy Services",3218.45,-0.38],
 ["HDFCBANK","HDFC Bank",1984.10,0.77],
 ["INFY","Infosys",1687.30,1.05],
 ["ICICIBANK","ICICI Bank",1452.60,-0.22],
 ["SBIN","State Bank of India",1048.75,2.14],
 ["ITC","ITC Ltd",412.20,0.48],
 ["TATAMOTORS","Tata Motors",728.30,-1.18]
];

let current = null;
let activePage = "Dashboard";
let watchlist = JSON.parse(localStorage.getItem("msnWatchlist")||'["RELIANCE","INFY","HDFCBANK"]');
let orders = JSON.parse(localStorage.getItem("msnOrders")||"[]");
let transfers = JSON.parse(localStorage.getItem("msnTransfers")||"[]");
let shares = JSON.parse(localStorage.getItem("msnShares")||"[]");
let adminNotifications = JSON.parse(localStorage.getItem("msnAdminNotifications")||"[]");
let utrRecords = JSON.parse(localStorage.getItem("msnUTRRecords")||"[]");

const money = n => {
 const a=Math.abs(n);
 if(a>=1e7) return "₹"+(n/1e7).toFixed(2)+" Cr";
 if(a>=1e5) return "₹"+(n/1e5).toFixed(2)+" L";
 return "₹"+Number(n).toLocaleString("en-IN",{maximumFractionDigits:2});
};
const fullMoney = n => "₹"+Number(n).toLocaleString("en-IN",{maximumFractionDigits:2});
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),2600)}
function save(){localStorage.setItem("msnWatchlist",JSON.stringify(watchlist));localStorage.setItem("msnOrders",JSON.stringify(orders));localStorage.setItem("msnTransfers",JSON.stringify(transfers));localStorage.setItem("msnShares",JSON.stringify(shares));localStorage.setItem("msnAdminNotifications",JSON.stringify(adminNotifications));localStorage.setItem("msnUTRRecords",JSON.stringify(utrRecords))}
function login(){
 const u=document.getElementById("username").value.trim().toLowerCase();
 const id=document.getElementById("clientId").value.trim();
 const p=document.getElementById("password").value;
 current=clients.find(c=>c.name.toLowerCase()===u&&c.id===id&&c.password===p);
 if(!current){document.getElementById("loginError").textContent="Invalid username, Client ID or password.";return}
 renderShell(); toast("Signed in successfully");
}
function renderLogin(){
 document.getElementById("app").innerHTML=`<div class="login"><div class="login-card">
 <div class="brand">MSN <span>Brock</span></div>
 <div class="sub">Professional market intelligence and paper-trading workspace.</div>
 <div class="field"><label>USERNAME</label><input id="username" placeholder="Enter username"></div>
 <div class="field"><label>CLIENT ID</label><input id="clientId" placeholder="BRCLT-XXXXXXXX"></div>
 <div class="field"><label>PASSWORD</label><input id="password" type="password" placeholder="Enter password" onkeydown="if(event.key==='Enter')login()"></div>
 <button class="btn" style="width:100%;margin-top:8px" onclick="login()">Sign in</button>
 <div id="loginError" class="error"></div>
 <div class="notice"><b>Financial Record Notice:</b> Account balances, payments, statements, withdrawals and portfolio records in this application are real.</div>
 <div class="hint">Market quotes shown by this starter build are sample UI data. Connect an authorized market-data API through a backend before production use.</div>
 </div></div>`;
}
function renderShell(){
 document.getElementById("app").innerHTML=`<div class="shell">
 <aside class="sidebar" id="sidebar">
  <div class="logo"><div class="brand">MSN <span>Brock</span></div><div class="hint">Market intelligence</div></div>
  <div class="nav" id="nav"></div>
  <div class="user-mini"><b>${current.name}</b><span>${current.id}</span></div>
 </aside>
 <main class="main">
  <div class="topbar"><div><button class="btn secondary mobile-menu" onclick="document.getElementById('sidebar').classList.toggle('open')">☰</button><h1 id="pageTitle" style="display:inline-block;margin-left:9px">Dashboard</h1><p id="pageSub">Your market and account overview</p></div><div class="top-actions"><span class="pill">● Market ready</span><button class="btn secondary" onclick="logout()">Logout</button></div></div>
  <div id="content"></div>
 </main></div>`;
 buildNav(); navigate("Dashboard");
}
const navGroups=[
 ["Overview",["Dashboard","Markets","Watchlist","Portfolio","Paper Trading"]],
 ["Account",["Payments","Withdrawals","Statements","KYC"]],
 ["Communication",["Market News","Comments","Notifications","Platform Updates"]],
 ["Management",["Clients","Settings"]]
];
function buildNav(){
 document.getElementById("nav").innerHTML=navGroups.map(g=>`<div class="nav-title">${g[0]}</div>${g[1].map(x=>`<button id="nav-${x}" onclick="navigate('${x}')">${icon(x)} ${x}</button>`).join("")}`).join("");
}
function icon(x){return ({Dashboard:"📊",Markets:"📈",Watchlist:"⭐","Portfolio":"💼","Paper Trading":"🛒",Payments:"💳",Withdrawals:"💸",Statements:"📄",KYC:"🪪","Market News":"📰",Comments:"💬",Notifications:"🔔","Platform Updates":"🆕",Clients:"👥",Settings:"⚙️"})[x]||"•"}
function navigate(p){
 activePage=p;document.querySelectorAll(".nav button").forEach(b=>b.classList.remove("active"));const n=document.getElementById("nav-"+p);if(n)n.classList.add("active");
 document.getElementById("pageTitle").textContent=p;
 document.getElementById("pageSub").textContent={Dashboard:"Your market and account overview",Markets:"Explore market instruments and prices",Watchlist:"Track selected instruments",Portfolio:"Paper portfolio analytics", "Paper Trading":"Simulated buy and sell orders",Payments:"Payment methods and records",Withdrawals:"Withdrawal limits and paper requests",Statements:"Account statement from 01 Jan 2025 to 2026",KYC:"Document and verification status","Market News":"Market headlines and API-ready news",Comments:"Client comments and notes",Notifications:"Account and platform notifications","Platform Updates":"Latest platform improvements",Clients:"Client profiles and account overview",Settings:"Application settings"}[p]||"";
 document.getElementById("content").innerHTML=pages[p]();
 if(innerWidth<760)document.getElementById("sidebar").classList.remove("open");
}
const pages={
 Dashboard:()=>`<div class="grid">
 ${stat("Available balance",money(current.balance),"Account record","")}
 ${stat("Pending payment",fullMoney(current.pending),"Pending record","yellow")}
 ${stat("Portfolio value",money(current.balance*0.72),"Paper valuation","")}
 ${stat("Withdrawal limit",money(current.limit),"Available limit","")}
 </div>
 <div class="section two"><div class="card"><div class="section-head"><h2>Portfolio performance</h2><span class="tag green">+8.42%</span></div><div class="chart">${[38,48,44,61,54,72,66,82,76,91,85,98,94,100].map(h=>`<div class="bar" style="height:${h}%"></div>`).join("")}</div></div>
 <div class="card"><div class="section-head"><h2>Market pulse</h2><span class="tag green">LIVE API READY</span></div>${market.slice(0,5).map(m=>rowMarket(m)).join("")}</div></div>
 <div class="section two"><div class="card"><div class="section-head"><h2>Recent activity</h2><button class="btn secondary" onclick="navigate('Statements')">View statements</button></div>${activityRows()}</div>
 <div class="card"><div class="section-head"><h2>Platform update</h2><span class="tag">21 Aug 2026</span></div><h3>Advanced market workspace</h3><p class="muted">Your withdrawal request of ₹40,000 (Indian Rupees) has been approved and will be processed to your registered bank account.

Next eligible withdrawal date: November 29, 2026..</p><button class="btn secondary" onclick="navigate('Platform Updates')">View updates</button></div></div>${notice()}`,
 Markets:()=>`<div class="card"><div class="section-head"><h2>Market search</h2><span class="tag">API READY</span></div><div class="search-row"><input class="search" id="marketSearch" placeholder="Search symbol or company..." oninput="filterMarket()"><button class="btn secondary" onclick="toast('Connect your authorized market-data provider in the backend.')">API settings</button></div><div id="marketTable"></div></div>`,
 Watchlist:()=>`<div class="card"><div class="section-head"><h2>Your watchlist</h2><button class="btn secondary" onclick="navigate('Markets')">Add stocks</button></div><div class="table-wrap"><table class="table"><thead><tr><th>Symbol</th><th>Company</th><th>Price</th><th>Change</th><th>Action</th></tr></thead><tbody>${watchlist.map(s=>{let m=market.find(x=>x[0]===s);return m?`<tr><td><b>${m[0]}</b></td><td>${m[1]}</td><td>${fullMoney(m[2])}</td><td class="${m[3]>=0?'positive':'negative'}">${m[3]>=0?'+':''}${m[3]}%</td><td><button class="btn secondary" onclick="openTrade('${m[0]}','BUY')">Trade</button> <button class="btn secondary" onclick="removeWatch('${m[0]}')">Remove</button></td></tr>`:""}).join("")}</tbody></table></div></div>`,
 Portfolio:()=>`<div class="grid">${stat("Invested value",money(current.balance*0.67),"Paper portfolio","")}${stat("Current value",money(current.balance*0.72),"API valuation ready","")}${stat("Total P&L",money(current.balance*0.05),"+5.00%","positive")}${stat("Positions","6","Paper holdings","")}</div><div class="section two"><div class="card"><div class="section-head"><h2>Holdings</h2><span class="tag">PAPER</span></div><div class="table-wrap"><table class="table"><thead><tr><th>Symbol</th><th>Qty</th><th>Avg.</th><th>Current</th><th>P&L</th></tr></thead><tbody>${market.slice(0,6).map((m,i)=>`<tr><td><b>${m[0]}</b></td><td>${20+i*5}</td><td>${fullMoney(m[2]*.92)}</td><td>${fullMoney(m[2])}</td><td class="positive">+${(8.4-i*.7).toFixed(2)}%</td></tr>`).join("")}</tbody></table></div></div><div class="card"><div class="section-head"><h2>Allocation</h2></div><div class="chart">${[90,74,61,50,42,30].map(h=>`<div class="bar" style="height:${h}%"></div>`).join("")}</div></div></div>`,
 "Paper Trading":()=>`<div class="two"><div class="card"><div class="section-head"><h2>Place paper order</h2><span class="tag yellow">NO REAL MONEY</span></div><div class="field"><label>SYMBOL</label><select id="tradeSymbol" class="search">${market.map(m=>`<option>${m[0]}</option>`).join("")}</select></div><div class="field"><label>QUANTITY</label><input id="tradeQty" type="number" min="1" value="1"></div><div class="field"><label>ORDER TYPE</label><select id="tradeType" class="search"><option>MARKET</option><option>LIMIT</option></select></div><div style="display:flex;gap:9px"><button class="btn green" onclick="placeOrder('BUY')">Buy</button><button class="btn danger" onclick="placeOrder('SELL')">Sell</button></div></div><div class="card"><div class="section-head"><h2>Order history</h2></div>${orders.length?orders.slice().reverse().map(o=>`<div class="kpi" style="margin-bottom:8px"><small>${o.date}</small><b>${o.side} ${o.qty} × ${o.symbol} · ${fullMoney(o.price)}</b></div>`).join(""):`<div class="empty">No paper orders yet.</div>`}</div></div>`,
 Payments:()=>`<div class="two"><div class="card"><div class="section-head"><h2>Choose payment method</h2></div><div class="three"><button class="btn secondary" onclick="payment('PayPal')">PayPal</button><button class="btn secondary" onclick="payment('UPI')">UPI</button><button class="btn secondary" onclick="payment('Bank Transfer')">Bank</button></div><div class="section"><div class="field"><label>AMOUNT</label><input id="payAmount" value="2500"></div><button class="btn" onclick="payment('Selected method')">Submit payment record</button></div></div><div class="card"><div class="section-head"><h2>Pending payment</h2><span class="tag yellow">PENDING</span></div><div class="stat"><div class="label">Pending amount</div><div class="value">${fullMoney(current.pending)}</div></div><div class="field"><label>UTR NUMBER</label><input id="utrNumber" class="search" maxlength="40" placeholder="Enter UTR / transaction reference"></div><button class="btn" onclick="submitUTR()">Submit UTR</button><p class="muted" style="margin-top:10px;font-size:11px">UTR submission records a paper payment reference only; it does not confirm or complete a real payment.</p>${utrRecords.filter(x=>x.client===current.name).slice(-3).reverse().map(x=>`<div class="kpi" style="margin-top:8px"><small>${x.date}</small><b>UTR: ${x.utr}</b><span class="muted">${x.status}</span></div>`).join("")}</div></div>`,
 Withdrawals:()=>`<div class="two"><div class="card"><div class="section-head"><h2>Withdrawal request</h2><span class="tag">PAPER RECORD</span></div><div class="field"><label>AMOUNT</label><input id="withdrawAmount" type="number" max="${current.limit}" placeholder="Enter amount"></div><div class="kpis"><div class="kpi"><small>Available limit</small><b>${money(current.limit)}</b></div><div class="kpi"><small>Account balance</small><b>${money(current.balance)}</b></div></div><button class="btn" style="margin-top:14px" onclick="submitWithdrawal()">Submit request</button></div><div class="card"><div class="section-head"><h2>Withdrawal history</h2></div><div class="empty">No withdrawal requests recorded.</div></div></div>`,
 Statements:()=>`<div class="card"><div class="section-head"><div><h2>Statement</h2><span class="muted">01 Jan 2025 → 2026</span></div><button class="btn" onclick="downloadCSV()">Download CSV</button></div><div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Description</th><th>Credit</th><th>Debit</th><th>Balance</th><th>Status</th></tr></thead><tbody>${[["01/01/2025","Opening paper record",current.balance,0,current.balance,"Recorded"],["15/03/2025","Paper portfolio allocation",0,current.balance*.15,current.balance*.85,"Recorded"],["10/07/2025","Paper portfolio revaluation",current.balance*.06,0,current.balance*.91,"Recorded"],["21/08/2026","Pending payment record",0,current.pending,current.balance*.91-current.pending,"Pending"]].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${fullMoney(r[2])}</td><td>${fullMoney(r[3])}</td><td>${fullMoney(r[4])}</td><td><span class="tag">${r[5]}</span></td></tr>`).join("")}</tbody></table></div></div>`,
 KYC:()=>`<div class="two"><div class="card"><div class="section-head"><h2>KYC / Documents</h2><span class="tag yellow">UNDER REVIEW</span></div>${["Identity document","Address proof","Bank information"].map((x,i)=>`<div class="kpi" style="display:flex;justify-content:space-between;margin:9px 0"><div><small>${x}</small><b>${i===0?"Submitted":"Not submitted"}</b></div><span class="tag ${i===0?"green":""}">${i===0?"Received":"Required"}</span></div>`).join("")}<button class="btn" onclick="toast('Thank you for submitting your KYC documents.')">Submit KYC documents</button></div><div class="card"><h2>Thank you</h2><p class="muted">Thank you for submitting your KYC documents. Your status is recorded for review.</p><div class="notice">This platform records document status only. Connect a secure backend and compliant document-storage service before collecting real identity documents.</div></div></div>`,
 "Market News":()=>`<div class="card"><div class="section-head"><h2>Market News</h2><span class="tag">API READY</span></div>${["Indian equities in focus as investors assess global cues","Technology stocks remain active in today's market","Banking sector watch: major names see increased volume","Market participants track upcoming corporate announcements"].map((x,i)=>`<div class="kpi" style="margin:9px 0"><small>21 Aug 2026 · Source API ${i+1}</small><b>${x}</b><p class="muted">Connect your licensed news provider to replace this interface content with live headlines.</p></div>`).join("")}</div>`,
 Comments:()=>`<div class="card"><div class="section-head"><h2>Comments</h2></div><div class="field"><textarea id="commentText" class="search" rows="4" placeholder="Write a comment..."></textarea></div><button class="btn" onclick="addComment()">Post comment</button><div id="commentsList" class="section"><div class="empty">No comments yet.</div></div></div>`,
 Notifications:()=>`<div class="two"><div class="card"><div class="section-head"><h2>Leader notification center</h2><button class="btn" onclick="openNotification()">Write notification</button></div><p class="muted">Send a platform announcement to all 11 paper client profiles or select recipients.</p>${adminNotifications.length?adminNotifications.slice(-8).reverse().map(n=>`<div class="kpi" style="margin:9px 0"><small>${n.date} · ${n.recipients}</small><b>${n.title}</b><p class="muted">${n.message}</p></div>`).join(""):`<div class="empty">No leader notifications yet.</div>`}</div><div class="card"><h2>System notifications</h2>${["Advanced portfolio analytics are available.","₹2,500 pending paper-payment record.","Market-data API connection is ready for configuration."].map((x,i)=>`<div class="kpi" style="margin:9px 0"><small>${i===0?"New feature":"Account update"}</small><b>${x}</b></div>`).join("")}</div></div>`,
 "Platform Updates":()=>`<div class="card"><div class="section-head"><h2>Platform Updates</h2><span class="tag green">UPDATED</span></div>${[["21 Aug 2026","Advanced market workspace","Improved portfolio analytics, responsive navigation, watchlist and paper-trading workflow."],["18 Aug 2026","Statements update","CSV export and expanded statement period are now available."],["12 Aug 2026","Security update","Authentication architecture is ready for secure backend integration."]].map(u=>`<div class="kpi" style="margin:10px 0"><small>${u[0]}</small><h3>${u[1]}</h3><p class="muted">${u[2]}</p></div>`).join("")}</div>`,
 Clients:()=>`<div class="card"><div class="section-head"><div><h2>Client management</h2><span class="muted">Leader / administrator workspace · ${clients.length} clients</span></div><div style="display:flex;gap:8px"><button class="btn secondary" onclick="openTransfer()">↔ Transfer</button><button class="btn secondary" onclick="openShare()">＋ Add Shares</button><button class="btn" onclick="openNotification()">🔔 Notify All</button></div></div><div class="client-grid">${clients.map(c=>`<div class="client"><div class="client-top"><h3>${c.name}</h3><span class="tag">${c.id.slice(-4)}</span></div><div class="bal">${money(c.balance)}</div><small>Pending ${fullMoney(c.pending)} · Limit ${money(c.limit)}</small><div style="margin-top:12px;display:flex;gap:7px"><button class="btn secondary" onclick="switchClient('${c.id}')">Open</button><button class="btn secondary" onclick="openTransfer('${c.id}')">Transfer</button><button class="btn secondary" onclick="openShare('${c.id}')">Shares</button></div></div>`).join("")}</div><div class="section two"><div class="card"><div class="section-head"><h2>Recent transfers</h2></div>${transfers.length?transfers.slice(-5).reverse().map(t=>`<div class="kpi" style="margin:8px 0"><small>${t.date}</small><b>${t.from} → ${t.to} · ${fullMoney(t.amount)}</b><span class="muted">${t.note||"Paper transfer record"}</span></div>`).join(""):`<div class="empty">No paper transfers recorded.</div>`}</div><div class="card"><div class="section-head"><h2>Share allocations</h2></div>${shares.length?shares.slice(-5).reverse().map(s=>`<div class="kpi" style="margin:8px 0"><small>${s.date}</small><b>${s.client} · ${s.qty} ${s.symbol}</b><span class="muted">Paper share allocation</span></div>`).join(""):`<div class="empty">No share allocations recorded.</div>`}</div></div></div>`,
 Settings:()=>`<div class="three"><div class="card"><h2>Profile</h2><p class="muted">${current.name}</p><p class="muted">${current.id}</p></div><div class="card"><h2>Market API</h2><p class="muted">Backend connection required for live production data.</p><button class="btn secondary" onclick="toast('API keys belong on the server, not in frontend code.')">Connection guidance</button></div><div class="card"><h2>Security</h2><p class="muted">Use server-side authentication, password hashing and secure sessions for production.</p></div></div>`
};
function stat(label,value,sub,cls){return `<div class="card stat"><div class="label">${label}</div><div class="value ${cls}">${value}</div><div class="muted" style="font-size:10px">${sub}</div></div>`}
function notice(){return `<div class="footer-note"><b>Financial Record Notice:</b> Account balances, payments, statements, withdrawals, portfolio holdings and trading activity shown here are non-real paper records. They do not represent actual funds or executed brokerage transactions.</div>`}
function rowMarket(m){return `<div class="kpi" style="display:flex;justify-content:space-between;margin:8px 0"><div><small>${m[0]}</small><b>${fullMoney(m[2])}</b></div><span class="${m[3]>=0?'positive':'negative'}">${m[3]>=0?'+':''}${m[3]}%</span></div>`}
function activityRows(){return [["01/01/2025","Opening paper record","Recorded"],["21/08/2026","₹2,500 pending payment","Pending"],["21/08/2026","Platform update","New"]].map(r=>`<div class="kpi" style="display:flex;justify-content:space-between;margin:8px 0"><div><small>${r[0]}</small><b>${r[1]}</b></div><span class="tag">${r[2]}</span></div>`).join("")}
function filterMarket(){
 const q=(document.getElementById("marketSearch").value||"").toLowerCase();
 const rows=market.filter(m=>(m[0]+" "+m[1]).toLowerCase().includes(q));
 document.getElementById("marketTable").innerHTML=`<div class="table-wrap"><table class="table"><thead><tr><th>Symbol</th><th>Company</th><th>Price</th><th>Change</th><th>Watch</th><th>Trade</th></tr></thead><tbody>${rows.map(m=>`<tr><td><b>${m[0]}</b></td><td>${m[1]}</td><td>${fullMoney(m[2])}</td><td class="${m[3]>=0?'positive':'negative'}">${m[3]>=0?'+':''}${m[3]}%</td><td><button class="btn secondary" onclick="toggleWatch('${m[0]}')">${watchlist.includes(m[0])?'★':'☆'}</button></td><td><button class="btn secondary" onclick="openTrade('${m[0]}','BUY')">Buy / Sell</button></td></tr>`).join("")}</tbody></table></div>`}
function toggleWatch(s){watchlist.includes(s)?watchlist=watchlist.filter(x=>x!==s):watchlist.push(s);save();filterMarket();toast(watchlist.includes(s)?"Added to watchlist":"Removed from watchlist")}
function removeWatch(s){watchlist=watchlist.filter(x=>x!==s);save();navigate("Watchlist")}
function openTrade(s,side){navigate("Paper Trading");setTimeout(()=>{document.getElementById("tradeSymbol").value=s;document.getElementById("tradeType").value="MARKET";toast("Ready to place a paper "+side+" order for "+s)},0)}
function placeOrder(side){
 const s=document.getElementById("tradeSymbol").value,q=Number(document.getElementById("tradeQty").value);
 if(!q||q<1)return toast("Enter a valid quantity");
 const m=market.find(x=>x[0]===s);
 orders.push({side,symbol:s,qty:q,price:m[2],date:new Date().toLocaleString("en-IN")});save();toast(`Paper ${side} order recorded successfully`);navigate("Paper Trading")
}
function submitUTR(){const utr=document.getElementById("utrNumber").value.trim();if(!utr)return toast("Enter a UTR number");if(utr.length<6)return toast("Enter a valid UTR/reference number");utrRecords.push({client:current.name,utr,status:"Submitted for paper record review",date:new Date().toLocaleString("en-IN")});save();toast("UTR submitted successfully — paper record only");navigate("Payments")}
function payment(method){const amount=Number(document.getElementById("payAmount")?.value||2500);toast(`${method} payment record of ${fullMoney(amount)} submitted successfully`)}
function submitWithdrawal(){const a=Number(document.getElementById("withdrawAmount").value);if(!a||a<=0||a>current.limit)return toast("Enter an amount within the available withdrawal limit");toast("Withdrawal request submitted successfully — paper record only")}
function addComment(){const t=document.getElementById("commentText").value.trim();if(!t)return toast("Write a comment first");document.getElementById("commentsList").innerHTML=`<div class="kpi"><small>${current.name} · just now</small><b>${t.replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[c]))}</b></div>`;document.getElementById("commentText").value="";toast("Comment posted")}
function downloadCSV(){const rows=[["Date","Description","Credit","Debit","Balance","Status"],["01/01/2025","Opening paper record",current.balance,0,current.balance,"Recorded"],["15/03/2025","Paper portfolio allocation",0,current.balance*.15,current.balance*.85,"Recorded"],["10/07/2025","Paper portfolio revaluation",current.balance*.06,0,current.balance*.91,"Recorded"],["21/08/2026","Pending payment record",0,current.pending,current.balance*.91-current.pending,"Pending"]];const csv=rows.map(r=>r.join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=`${current.name}-statement.csv`;a.click();toast("CSV downloaded")}
function switchClient(id){const c=clients.find(x=>x.id===id);if(c){current=c;navigate("Dashboard");toast("Client switched to "+c.name)}}

function modal(title,body){const d=document.createElement("div");d.className="modal-backdrop";d.id="modal";d.innerHTML=`<div class="modal"><div class="modal-head"><h2>${title}</h2><button class="close" onclick="closeModal()">×</button></div>${body}</div>`;document.body.appendChild(d)}
function closeModal(){document.getElementById("modal")?.remove()}
function clientOptions(selected=""){return clients.map(c=>`<option value="${c.id}" ${selected===c.id?"selected":""}>${c.name} — ${c.id}</option>`).join("")}
function openTransfer(preselect=""){modal("Transfer paper record",`<p class="muted">Records a simulated transfer between client profiles. No real funds move.</p><div class="field"><label>FROM CLIENT</label><select id="trFrom" class="search">${clientOptions(preselect||current.id)}</select></div><div class="field"><label>TO CLIENT</label><select id="trTo" class="search">${clientOptions()}</select></div><div class="field"><label>AMOUNT</label><input id="trAmount" type="number" min="0" placeholder="Enter amount"></div><div class="field"><label>NOTE</label><input id="trNote" class="search" placeholder="Transfer note"></div><button class="btn" onclick="submitTransfer()">Submit paper transfer</button>`)}
function submitTransfer(){const from=document.getElementById("trFrom").value,to=document.getElementById("trTo").value,amount=Number(document.getElementById("trAmount").value);if(from===to)return toast("Choose two different clients");if(!amount||amount<=0)return toast("Enter a valid amount");const f=clients.find(c=>c.id===from),t=clients.find(c=>c.id===to);transfers.push({from:f.name,to:t.name,amount,note:document.getElementById("trNote").value.trim(),date:new Date().toLocaleString("en-IN")});save();closeModal();toast("Paper transfer recorded successfully");navigate("Clients")}
function openShare(preselect=""){modal("Add paper shares",`<p class="muted">Creates a simulated share allocation. No real securities are purchased or transferred.</p><div class="field"><label>CLIENT</label><select id="shClient" class="search">${clientOptions(preselect||current.id)}</select></div><div class="field"><label>SYMBOL</label><select id="shSymbol" class="search">${market.map(m=>`<option>${m[0]}</option>`).join("")}</select></div><div class="field"><label>QUANTITY</label><input id="shQty" type="number" min="1" placeholder="Number of shares"></div><button class="btn" onclick="submitShare()">Add paper shares</button>`)}
function submitShare(){const c=clients.find(x=>x.id===document.getElementById("shClient").value),symbol=document.getElementById("shSymbol").value,qty=Number(document.getElementById("shQty").value);if(!qty||qty<=0)return toast("Enter a valid share quantity");shares.push({client:c.name,symbol,qty,date:new Date().toLocaleString("en-IN")});save();closeModal();toast("Paper shares added successfully");navigate("Clients")}
function openNotification(){modal("Write notification",`<p class="muted">Create a platform message for your paper client workspace.</p><div class="field"><label>RECIPIENTS</label><select id="nRecipients" class="search"><option>All 11 clients</option>${clients.map(c=>`<option>${c.name}</option>`).join("")}</select></div><div class="field"><label>TITLE</label><input id="nTitle" class="search" placeholder="Notification title"></div><div class="field"><label>MESSAGE</label><textarea id="nMessage" class="search" rows="5" placeholder="Write your notification..."></textarea></div><button class="btn" onclick="submitNotification()">Publish notification</button>`)}
function submitNotification(){const title=document.getElementById("nTitle").value.trim(),message=document.getElementById("nMessage").value.trim(),recipients=document.getElementById("nRecipients").value;if(!title||!message)return toast("Enter a title and message");adminNotifications.push({title,message,recipients,date:new Date().toLocaleString("en-IN")});save();closeModal();toast("Notification published successfully");navigate("Notifications")}

function logout(){current=null;renderLogin();toast("Signed out")}
renderLogin();
