const K='qb1';
const D0={user:null,email:'',brand:{name:'',phone:'',color:'#0E7C5A'},set:{dep:30,days:14,tax:0,cur:'€'},services:[],clients:[],quotes:[]};
let S=Object.assign({},D0,JSON.parse(localStorage.getItem(K)||'{}'));
S.quotes.forEach(q=>q.created=q.created||Date.now());
let V=S.user?'home':'signup',F='all',lastQ=null;
const blank=()=>({client:'',phone:'',date:'',note:'',items:[{d:'',q:1,p:0}]});let N=blank();
const save=()=>localStorage.setItem(K,JSON.stringify(S));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const m=(n,c=S.set.cur)=>c+(Math.round(n*100)/100).toLocaleString('en',{maximumFractionDigits:2});
const tot=(it,tax)=>it.reduce((a,i)=>a+i.q*i.p,0)*(1+tax/100);
const enc=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o))));
const dec=s=>JSON.parse(decodeURIComponent(escape(atob(s))));
const dig=s=>String(s||'').replace(/\D/g,'');
const base=()=>location.href.split('#')[0];
const linkOf=q=>{const{status,...r}=q;return base()+'#q='+enc(r)};
const msg=q=>`Hi ${q.client||''}, here is your quote from ${S.brand.name||'us'} for ${m(tot(q.items,q.tax),q.cur)}: ${linkOf(q)}`;
const wa=(p,t)=>`https://wa.me/${dig(p)}?text=${encodeURIComponent(t)}`;
const app=document.getElementById('app');
const ic={home:'<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',new:'<path d="M12 5v14M5 12h14"/>',services:'<path d="M4 6h16M4 12h16M4 18h10"/>',settings:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'};
const nav=()=>`<nav>${[['home','Home'],['new','New quote'],['services','Services'],['settings','Settings']].map(([v,t])=>`<button data-act="nav" data-v="${v}" class="${V===v?'on':''} ${v==='new'&&V!=='new'?'':''}"><svg viewBox="0 0 24 24" aria-hidden="true">${ic[v]}</svg>${t}</button>`).join('')}</nav>`;
const field=(id,label,val,k,f,type='text',extra='')=>`<div class="g"><label class="l" for="${id}">${label}</label><input id="${id}" type="${type}" value="${esc(val)}" data-k="${k}" data-f="${f}" ${extra}></div>`;
const pills={sent:['Sent',''],accepted:['Accepted','ok'],paid:['Deposit paid','ok']};
const stats=()=>{const Q=S.quotes,n=new Date(),won=Q.filter(q=>q.status!=='sent');return{quoted:Q.filter(q=>new Date(q.created).getMonth()===n.getMonth()).reduce((a,q)=>a+tot(q.items,q.tax),0),won:won.length,rate:Q.length?Math.round(won.length/Q.length*100):0,dep:Q.filter(q=>q.status==='paid').reduce((a,q)=>a+tot(q.items,q.tax)*q.dep/100,0)}};
const sums=()=>{const t=tot(N.items,S.set.tax);return[t,t*S.set.dep/100]};
const views={
signup:()=>`<div style="margin-top:40px" class="g"><span class="l">Quotes and bookings for tradespeople</span><h1 style="font-size:36px">Win the job before they call someone else</h1></div>${field('em','Email','','em','','email')}${field('pw','Password','','pw','','password')}<button class="b" data-act="signup">Create free account</button>`,
home:()=>{const s=stats(),old=S.quotes.filter(q=>q.status==='sent'&&Date.now()-q.created>2592e5),L=S.quotes.filter(q=>F==='all'||q.status===F).slice().reverse();
return`<div class="hero"><span class="l">Welcome back</span><h1>${esc(S.brand.name||'Your business')}</h1></div>
<div class="grid">${[['Quoted this month',m(s.quoted)],['Win rate',s.rate+'%'],['Jobs won',s.won],['Deposits collected',m(s.dep)]].map(([a,b])=>`<div class="st"><span class="l">${a}</span><b class="n">${b}</b></div>`).join('')}</div>
${old.length?`<div class="c warn"><b>Follow up today</b>${old.map(q=>`<div class="r"><span>${esc(q.client||'Client')} · ${m(tot(q.items,q.tax),q.cur)}</span><button class="sm" data-act="nudge" data-id="${q.id}">Nudge</button></div>`).join('')}</div>`:''}
<div class="chips">${['all','sent','accepted','paid'].map(f=>`<button class="chip ${F===f?'on':''}" data-act="filter" data-v="${f}">${f[0].toUpperCase()+f.slice(1)}</button>`).join('')}</div>
${L.length?L.map(q=>`<div class="c"><div class="r"><b style="font-size:18px">${esc(q.client||'Client')}</b><span class="p ${pills[q.status][1]}">${pills[q.status][0]}</span></div><div class="r"><span class="l">${esc(q.date||'No start date')}</span><span class="n" style="font-size:20px">${m(tot(q.items,q.tax),q.cur)}</span></div><div class="r" style="justify-content:flex-start"><button class="sm" data-act="share" data-id="${q.id}">Share</button>${q.status!=='paid'?`<button class="sm" data-act="paid" data-id="${q.id}">Mark deposit paid</button>`:''}</div></div>`).join(''):`<div class="c"><span class="l">Nothing here yet.</span><button class="b" data-act="nav" data-v="new">Create your first quote</button></div>`}${nav()}`},
new:()=>{const[t,d]=sums();return`<h1>New quote</h1>
<div class="c">${field('cl','Client name',N.client,'client','','text','list="cls" autocomplete="off"')}<datalist id="cls">${S.clients.map(c=>`<option value="${esc(c.n)}">`).join('')}</datalist>${field('ph','Client WhatsApp / phone',N.phone,'phone','','tel')}${field('dt','Start date',N.date,'date','','date')}</div>
<div class="c"><span class="l">Quick add from your services</span><div class="chips">${S.services.length?S.services.map((s,i)=>`<button class="chip" data-act="svc" data-i="${i}">+ ${esc(s.n)} ${m(s.p)}</button>`).join(''):`<button class="chip" data-act="nav" data-v="services">Add your services first</button>`}</div></div>
<div class="c"><span class="l">Items (description, qty, price)</span>${N.items.map((it,i)=>`<div class="row3"><input aria-label="Description" value="${esc(it.d)}" data-k="item" data-i="${i}" data-f="d"><input aria-label="Quantity" type="number" min="0" value="${it.q}" data-k="item" data-i="${i}" data-f="q"><input aria-label="Price" type="number" min="0" value="${it.p}" data-k="item" data-i="${i}" data-f="p"><button class="x" aria-label="Remove item" data-act="del" data-i="${i}">×</button></div>`).join('')}<button class="o" data-act="add">Add item</button>${field('nt','Note for the client (optional)',N.note,'note','')}</div>
<div class="c"><div class="r"><b style="font-size:18px">Total</b><span class="n" id="tot" style="font-size:30px">${m(t)}</span></div><div class="r"><span class="l">Deposit on accept (${S.set.dep}%)</span><span class="n" id="dep">${m(d)}</span></div></div>
<button class="b" data-act="send">Create quote</button>${nav()}`},
sent:()=>{const q=lastQ,l=linkOf(q),t=msg(q);return`<div class="hero ok"><h1>Quote ready</h1><span>Clients reply fastest on WhatsApp.</span></div>
<div class="c"><a class="b" href="${wa(q.phone,t)}" target="_blank" rel="noopener">Send on WhatsApp</a><a class="o" href="mailto:?subject=${encodeURIComponent('Your quote from '+(S.brand.name||''))}&body=${encodeURIComponent(t)}">Send by email</a><button class="o" data-act="copy">Copy link</button><a class="o" href="${esc(l)}" target="_blank" rel="noopener">Preview as client</a></div>${nav()}`},
services:()=>`<h1>Your services</h1><span class="l">Save your common jobs once. Then build a quote with one tap.</span>
<div class="c">${S.services.map((s,i)=>`<div class="r"><span>${esc(s.n)}</span><span class="r"><b class="n">${m(s.p)}</b><button class="x" aria-label="Delete ${esc(s.n)}" data-act="delsvc" data-i="${i}">×</button></span></div>`).join('')||'<span class="l">No services yet.</span>'}</div>
<div class="c">${field('sn','Service name','','','','text')}${field('sp','Price','','','','number')}<button class="b" data-act="addsvc">Add service</button></div>${nav()}`,
settings:()=>`<h1>Settings</h1><div class="c"><span class="l">Your brand (shown on every quote)</span>${field('bn','Business name',S.brand.name,'brand','name')}${field('bp','Phone',S.brand.phone,'brand','phone','tel')}<div class="r" style="justify-content:flex-start">${['#0E7C5A','#1F4FD8','#B4361F','#14171A'].map(c=>`<button class="sw ${S.brand.color===c?'on':''}" style="background:${c}" aria-label="Colour ${c}" data-act="color" data-v="${c}"></button>`).join('')}</div></div>
<div class="c"><span class="l">Quote defaults</span>${field('s1','Deposit %',S.set.dep,'set','dep','number')}${field('s2','Valid for (days)',S.set.days,'set','days','number')}${field('s3','Tax rate %',S.set.tax,'set','tax','number')}${field('s4','Currency symbol',S.set.cur,'set','cur')}</div>
<div class="c"><div class="r"><span>Stripe payments</span><span class="p">Not connected</span></div></div><button class="o" data-act="reset">Delete all data on this device</button>${nav()}`};
function client(q){const t=tot(q.items,q.tax),d=t*q.dep/100;app.style.setProperty('--a',q.color);
app.innerHTML=`<div class="hero"><span class="l">Quote ${q.id} · valid ${q.days} days</span><h1>${esc(q.biz||'Your quote')}</h1>${q.phone?`<span class="l">${esc(q.phone)}</span>`:''}</div>
<div class="c"><span class="l">Prepared for ${esc(q.client||'you')}</span>${q.items.map(i=>`<div class="r"><span>${esc(i.d)} × ${i.q}</span><span class="n">${m(i.q*i.p,q.cur)}</span></div>`).join('')}${q.tax?`<div class="r"><span class="l">Tax ${q.tax}%</span></div>`:''}<div class="r" style="border-top:1px solid var(--ln);padding-top:12px"><b>Total</b><span class="n" style="font-size:28px">${m(t,q.cur)}</span></div>${q.note?`<span class="l">${esc(q.note)}</span>`:''}${q.date?`<div class="r"><span class="l">Start date</span><b>${esc(q.date)}</b></div>`:''}</div>
<button class="b noprint" id="acc">Accept and pay ${m(d,q.cur)} deposit</button><button class="o noprint" onclick="print()">Save as PDF / Print</button>`;
document.getElementById('acc').onclick=()=>{const s=JSON.parse(localStorage.getItem(K)||'null');if(s){const x=(s.quotes||[]).find(z=>z.id===q.id);if(x&&x.status==='sent'){x.status='accepted';localStorage.setItem(K,JSON.stringify(s))}}
app.innerHTML=`<div class="hero ok"><h1>Quote accepted</h1><span>${esc(q.biz||'The business')} will confirm your booking${q.phone?' on '+esc(q.phone):''}.</span></div><div class="c"><span class="l">Online deposit payment appears here once Stripe is connected (see README).</span></div>`}}
function render(){if(location.hash.startsWith('#q=')){try{return client(dec(location.hash.slice(3)))}catch(e){}}app.style.setProperty('--a',S.brand.color);app.innerHTML=views[V]();scrollTo(0,0)}
const upd=()=>{const[t,d]=sums();document.getElementById('tot').textContent=m(t);document.getElementById('dep').textContent=m(d)};
document.addEventListener('input',e=>{const t=e.target,k=t.dataset.k;if(!k)return;const f=t.dataset.f;
if(k==='client'){N.client=t.value;const c=S.clients.find(c=>c.n===t.value);if(c&&c.ph&&!N.phone){N.phone=c.ph;document.getElementById('ph').value=c.ph}}
else if(k==='phone')N.phone=t.value;else if(k==='date')N.date=t.value;else if(k==='note')N.note=t.value;
else if(k==='item'){N.items[t.dataset.i][f]=f==='d'?t.value:+t.value||0;upd()}
else if(k==='brand'){S.brand[f]=t.value;save()}else if(k==='set'){S.set[f]=f==='cur'?t.value:+t.value||0;save()}else if(k==='em')S.email=t.value});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,id=b.dataset.id,find=()=>S.quotes.find(z=>z.id===id);
if(a==='signup'){S.user=S.email||'user';save();V='settings'}
else if(a==='nav')V=b.dataset.v;else if(a==='filter')F=b.dataset.v;
else if(a==='color'){S.brand.color=b.dataset.v;save()}
else if(a==='add')N.items.push({d:'',q:1,p:0});
else if(a==='del'){N.items.splice(b.dataset.i,1);if(!N.items.length)N.items=blank().items}
else if(a==='svc'){const s=S.services[b.dataset.i],l=N.items[N.items.length-1];const it={d:s.n,q:1,p:s.p};if(l&&!l.d&&!l.p)N.items[N.items.length-1]=it;else N.items.push(it)}
else if(a==='addsvc'){const n=document.getElementById('sn').value.trim(),p=+document.getElementById('sp').value;if(!n)return;S.services.push({n,p:p||0});save()}
else if(a==='delsvc'){S.services.splice(b.dataset.i,1);save()}
else if(a==='send'){const items=N.items.filter(i=>i.d||i.p);if(!items.length){b.textContent='Add at least one item';return}
const q={id:String(S.quotes.length+1).padStart(4,'0'),client:N.client,phone:N.phone,date:N.date,note:N.note,items,tax:S.set.tax,dep:S.set.dep,days:S.set.days,cur:S.set.cur,color:S.brand.color,biz:S.brand.name,bphone:S.brand.phone,created:Date.now(),status:'sent'};
q.phone=N.phone;S.quotes.push(q);if(q.client){const c=S.clients.find(c=>c.n===q.client);if(c)c.ph=q.phone||c.ph;else S.clients.push({n:q.client,ph:q.phone})}save();lastQ=q;N=blank();V='sent'}
else if(a==='copy'){navigator.clipboard&&navigator.clipboard.writeText(linkOf(lastQ));b.textContent='Copied';return}
else if(a==='share'){const q=find();if(navigator.share)navigator.share({text:msg(q)}).catch(()=>{});else{navigator.clipboard&&navigator.clipboard.writeText(msg(q));b.textContent='Copied'}return}
else if(a==='nudge'){const q=find();open(wa(q.phone,`Hi ${q.client||''}, just checking you saw my quote for ${m(tot(q.items,q.tax),q.cur)}. Any questions? ${linkOf(q)}`),'_blank');return}
else if(a==='paid'){find().status='paid';save()}
else if(a==='reset'){if(confirm('Delete all quotes and settings on this device?')){localStorage.removeItem(K);location.hash='';location.reload();return}}
render()});
addEventListener('hashchange',render);render();
