const K='qb1';
let S=JSON.parse(localStorage.getItem(K)||'null')||{user:null,brand:{name:'',phone:'',color:'#0E7C5A'},set:{dep:30,days:14,tax:0,cur:'€'},quotes:[]};
let V=S.user?'jobs':'signup',D={client:'',items:[{d:'',q:1,p:0}]},last=null;
const save=()=>localStorage.setItem(K,JSON.stringify(S));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cur=()=>S.set.cur;
const m=(n,c=cur())=>c+(Math.round(n*100)/100).toLocaleString('en',{maximumFractionDigits:2});
const tot=(it,tax)=>it.reduce((a,i)=>a+i.q*i.p,0)*(1+tax/100);
const enc=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o))));
const dec=s=>JSON.parse(decodeURIComponent(escape(atob(s))));
const app=document.getElementById('app');
const nav=()=>`<nav>${[['jobs','Jobs'],['new','New quote'],['brand','Brand'],['settings','Settings']].map(([v,t])=>`<button data-act="nav" data-v="${v}" class="${V===v?'on':''}">${t}</button>`).join('')}</nav>`;
const field=(id,label,val,k,f,type='text')=>`<div class="g"><label class="l" for="${id}">${label}</label><input id="${id}" type="${type}" value="${esc(val)}" data-k="${k}" data-f="${f}"></div>`;
const views={
signup:()=>`<div style="margin-top:48px" class="g"><span class="l">Quote and booking for tradespeople</span><h1 style="font-size:34px">Win the job before the customer calls someone else</h1></div>
${field('em','Email','','em','')}${field('pw','Password (stored on this device only)','','pw','','password')}
<button class="b" data-act="signup">Create free account</button>`,
brand:()=>`<h1>Make quotes look like yours</h1>${field('bn','Business name',S.brand.name,'brand','name')}${field('ph','Phone',S.brand.phone,'brand','phone')}
<div class="c"><span class="l">Quote colour</span><div class="r" style="justify-content:flex-start">${['#0E7C5A','#1F4FD8','#B4361F','#14171A'].map(c=>`<button class="sw ${S.brand.color===c?'on':''}" style="background:${c}" aria-label="Colour ${c}" data-act="color" data-v="${c}"></button>`).join('')}</div></div>
<button class="b" data-act="nav" data-v="jobs">Save</button>${nav()}`,
jobs:()=>`<h1>This week</h1>${S.quotes.length?S.quotes.slice().reverse().map(q=>`<div class="c"><div class="r"><span class="l">${esc(q.date||'No date set')}</span><span class="p ${q.status==='paid'?'ok':''}">${{sent:'Quote sent',accepted:'Accepted',paid:'Deposit paid'}[q.status]}</span></div>
<b style="font-size:18px">${esc(q.client||'Client')}</b><span class="l">${m(tot(q.items,q.tax))} total · ${m(tot(q.items,q.tax)*q.dep/100)} deposit</span>
<div class="r"><button class="o" data-act="link" data-id="${q.id}">Copy client link</button>${q.status!=='paid'?`<button class="o" data-act="paid" data-id="${q.id}">Mark deposit paid</button>`:''}</div></div>`).join(''):'<div class="c"><span class="l">No quotes yet. Create your first one.</span></div>'}
<button class="b" data-act="nav" data-v="new">New quote</button>${nav()}`,
new:()=>`<h1>New quote</h1>${field('cl','Client',D.client,'client','')}${field('dt','Start date',D.date||'','date','','date')}
<div class="c"><span class="l">Line items (description, qty, price)</span>${D.items.map((it,i)=>`<div class="row3"><input aria-label="Description" value="${esc(it.d)}" data-k="item" data-i="${i}" data-f="d"><input aria-label="Quantity" type="number" min="0" value="${it.q}" data-k="item" data-i="${i}" data-f="q"><input aria-label="Price" type="number" min="0" value="${it.p}" data-k="item" data-i="${i}" data-f="p"><button class="x" aria-label="Remove item" data-act="del" data-i="${i}">×</button></div>`).join('')}<button class="o" data-act="add">Add item</button></div>
<div class="c"><div class="r"><b style="font-size:18px">Total</b><span class="n" id="tot" style="font-size:28px">${m(tot(D.items,S.set.tax))}</span></div><div class="r"><span class="l">Deposit due on accept (${S.set.dep}%)</span><span class="n" id="dep">${m(tot(D.items,S.set.tax)*S.set.dep/100)}</span></div></div>
<button class="b" data-act="send">Send quote</button>${nav()}`,
sent:()=>`<h1>Quote ready</h1><div class="c"><span class="l">Send this link to your client by message or email:</span><div class="link">${esc(last)}</div><button class="b" data-act="copy">Copy link</button><a class="o" style="display:flex;align-items:center;justify-content:center;text-decoration:none" href="${esc(last)}" target="_blank">Preview as client</a></div>${nav()}`,
settings:()=>`<h1>Settings</h1><div class="c">${field('s1','Default deposit %',S.set.dep,'set','dep','number')}${field('s2','Quote valid (days)',S.set.days,'set','days','number')}${field('s3','Tax rate %',S.set.tax,'set','tax','number')}${field('s4','Currency symbol',S.set.cur,'set','cur')}</div>
<div class="c"><div class="r"><span>Stripe payments</span><span class="p">Not connected</span></div><span class="l">See README to connect Stripe.</span></div>
<button class="o" data-act="reset">Delete all data on this device</button>${nav()}`};
function client(q){const t=tot(q.items,q.tax),d=t*q.dep/100;
app.style.setProperty('--a',q.color);
app.innerHTML=`<div class="g"><span class="l">Quote ${q.id} · valid ${q.days} days</span><h1>Your quote from ${esc(q.biz||'us')}</h1></div>
<div class="c">${q.items.map(i=>`<div class="r"><span>${esc(i.d)} × ${i.q}</span><span class="n">${m(i.q*i.p,q.cur)}</span></div>`).join('')}<div class="r" style="border-top:1px solid #E4E2DB;padding-top:12px"><b>Total</b><span class="n" style="font-size:24px">${m(t,q.cur)}</span></div></div>
${q.date?`<div class="c"><div class="r"><span class="l">Start date</span><span class="n">${esc(q.date)}</span></div></div>`:''}
<button class="b" id="acc">Accept and pay ${m(d,q.cur)} deposit</button>`;
document.getElementById('acc').onclick=()=>{const s=JSON.parse(localStorage.getItem(K)||'null');if(s){const x=s.quotes.find(z=>z.id===q.id);if(x&&x.status==='sent'){x.status='accepted';localStorage.setItem(K,JSON.stringify(s))}}
app.innerHTML=`<h1>Quote accepted</h1><div class="c"><span>Thank you. ${esc(q.biz||'The business')} will confirm your booking${q.phone?' on '+esc(q.phone):''}.</span><span class="l">Online deposit payment appears here once Stripe is connected (see README).</span></div>`}}
function render(){if(location.hash.startsWith('#q=')){try{return client(dec(location.hash.slice(3)))}catch(e){}}
app.style.setProperty('--a',S.brand.color);app.innerHTML=views[V]()}
const upd=()=>{const t=tot(D.items,S.set.tax);document.getElementById('tot').textContent=m(t);document.getElementById('dep').textContent=m(t*S.set.dep/100)};
document.addEventListener('input',e=>{const t=e.target,k=t.dataset.k;if(!k)return;const f=t.dataset.f;
if(k==='client')D.client=t.value;else if(k==='date')D.date=t.value;
else if(k==='item'){D.items[t.dataset.i][f]=f==='d'?t.value:+t.value||0;upd()}
else if(k==='brand'){S.brand[f]=t.value;save()}
else if(k==='set'){S.set[f]=f==='cur'?t.value:+t.value||0;save();if(f==='tax'||f==='dep'){}}
else if(k==='em'){S.email=t.value}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,id=b.dataset.id;
if(a==='signup'){S.user=S.email||'user';save();V='brand'}
else if(a==='nav')V=b.dataset.v;
else if(a==='color'){S.brand.color=b.dataset.v;save()}
else if(a==='add')D.items.push({d:'',q:1,p:0});
else if(a==='del'){D.items.splice(b.dataset.i,1);if(!D.items.length)D.items=[{d:'',q:1,p:0}]}
else if(a==='send'){const q={id:String(S.quotes.length+1).padStart(4,'0'),client:D.client,date:D.date||'',items:D.items.filter(i=>i.d||i.p),tax:S.set.tax,dep:S.set.dep,days:S.set.days,cur:cur(),color:S.brand.color,biz:S.brand.name,phone:S.brand.phone,status:'sent'};
S.quotes.push(q);save();last=location.href.split('#')[0]+'#q='+enc(q);D={client:'',items:[{d:'',q:1,p:0}]};V='sent'}
else if(a==='copy'||a==='link'){const q=S.quotes.find(z=>z.id===id);const u=a==='copy'?last:location.href.split('#')[0]+'#q='+enc(q);navigator.clipboard&&navigator.clipboard.writeText(u);b.textContent='Copied';return}
else if(a==='paid'){S.quotes.find(z=>z.id===id).status='paid';save()}
else if(a==='reset'){if(confirm('Delete all quotes and settings on this device?')){localStorage.removeItem(K);location.hash='';location.reload();return}}
render()});
addEventListener('hashchange',render);render();
