const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const source = file => fs.readFileSync(path.join(root,file), 'utf8');
const id = 'e0da78ba-de9d-4fd9-a0a2-0453dbc74be5';
const other = 'cc88b2fb-3056-4254-b47f-d764b7fdb0ae';
function memory() { const data=new Map(); return { getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k) }; }
function env() {
 const window={location:new URL('http://localhost:3000'),sessionStorage:memory(),localStorage:memory(),confirm:()=>false};
 const context=vm.createContext({window,URL,URLSearchParams,AbortController,setTimeout,clearTimeout});
 for(const file of ['config','cart-storage','orders','catalog','api'])vm.runInContext(source('js/'+file+'.js'),context);
 return {context,window,orders:vm.runInContext('LumenOrders',context),catalog:vm.runInContext('LumenCatalog',context),cart:vm.runInContext('LumenCartStorage',context)};
}
function summary(status='PENDING_PAYMENT') {return {public_id:id,status,subtotal:100,total:100,delivery:{method:'PICKUP',shipping_cost:null},items:[{product_name:'Agenda',variant_name:'A5',quantity:1,unit_price:100,subtotal:100}]};}
const line={productoId:'agenda',tamano:'A5',sku:'AGENDA-A5',variant_id:1,cantidad:1,disenoId:'floral',diseno:'Floral',disponible:true};
const customer={first_name:'Ana',last_name:'Pérez',dni:'12345678',phone:'1112345678',email:'ana@example.com',delivery_method:'PICKUP'};
const local=[{id:'agenda',backendSlug:'agenda',skuPorTamano:{A5:'AGENDA-A5',B5:'AGENDA-B5'}}];
const product=()=>({slug:'agenda',variants:[{id:1,sku:'AGENDA-A5',name:'A5',price:100}]});
test('catálogo resuelve precio e ID remotos y bloquea variantes faltantes/cero',()=>{
 const {catalog}=env();const p=product();let resolved=catalog.resolve(local,[p])[0];
 assert.equal(resolved.variantesResueltas.A5.precio,100);assert.equal(resolved.variantesResueltas.A5.variant_id,1);
 assert.deepEqual(Array.from(resolved.tamanosNoDisponibles),['B5']);
 p.variants[0].price=0;resolved=catalog.resolve(local,[p])[0];assert.equal(Object.keys(resolved.variantesResueltas).length,0);
});
test('catálogo rechaza IDs/SKU repetidos, importes inválidos y formato incorrecto',()=>{
 const {catalog}=env();
 for(const field of ['id','sku']) {const p=product();p.variants.push({id:2,sku:'AGENDA-B5',name:'B5',price:200,[field]:p.variants[0][field]});assert.throws(()=>catalog.resolve(local,[p]));}
 for(const price of [-1,NaN,Infinity,'100']){const p=product();p.variants[0].price=price;assert.throws(()=>catalog.resolve(local,[p]));}
 assert.throws(()=>catalog.resolve(local,{}));assert.throws(()=>catalog.resolve(local,[product(),product()]));
});
test('carrito persiste solo referencias y recupera errores sin inventar importes',()=>{
 const {cart,window}=env();assert.equal(cart.save([{...line,precio:1,email:'secret@example.com'}]),'');
 const raw=window.localStorage.getItem(cart.key);assert.doesNotMatch(raw,/precio|email|secret/);assert.equal(cart.load().items.length,1);
 window.localStorage.setItem(cart.key,'{');assert.ok(cart.load().message);assert.equal(cart.load().items.length,0);
 window.localStorage.setItem=()=>{throw Error('blocked');};assert.ok(cart.save([line]));
});
test('pedido usa cantidades/variantes, omite importes y dirección para retiro',()=>{
 const {orders}=env();const request=orders.buildRequest({...customer,address:'no-enviar'},[{...line,precio:999}]);
 assert.equal(request.items[0].variant_id,1);assert.equal(request.items[0].quantity,1);assert.equal(request.address,undefined);
 assert.doesNotMatch(JSON.stringify(request),/precio|subtotal|total|no-enviar/);
});
test('pedido valida envío, email, cantidades y disponibilidad',()=>{
 const {orders}=env();assert.throws(()=>orders.buildRequest({...customer,delivery_method:'CORREO_ARGENTINO'},[line]));
 const req=orders.buildRequest({...customer,delivery_method:'CORREO_ARGENTINO',address:'Calle 1',postal_code:'1000',city:'CABA',province:'CABA'},[line]);assert.equal(req.address,'Calle 1');
 assert.throws(()=>orders.buildRequest({...customer,email:'invalid'},[line]));
 for(const cantidad of [0,1001,1.5])assert.throws(()=>orders.buildRequest(customer,[{...line,cantidad}]));
 assert.throws(()=>orders.buildRequest(customer,[{...line,disponible:false}]));assert.throws(()=>orders.buildRequest(customer,[]));
});
test('resumen verifica UUID esperado y excluye datos adicionales de entrega',()=>{
 const {orders}=env();assert.throws(()=>orders.validateSummary(summary(),other));
 const result=orders.validateSummary({...summary(),delivery:{method:'PICKUP',shipping_cost:null,email:'secret'}},id.toUpperCase());
 assert.equal(result.delivery.email,undefined);assert.equal(orders.saveReference('invalid'),false);
});
test('marcador de envío se conserva en la pestaña sin datos personales',()=>{
 const {orders,window}=env();orders.setSubmissionBlocked(true);assert.equal(orders.isSubmissionBlocked(),true);
 assert.equal(window.sessionStorage.getItem(orders.submissionKey),'uncertain');orders.setSubmissionBlocked(false);assert.equal(orders.isSubmissionBlocked(),false);
});
for(const url of ['http://www.mercadopago.com.ar/checkout/test','https://example.com/checkout/test','https://www.mercadopago.com.ar.evil.com/checkout/test','https://user:pass@www.mercadopago.com.ar/checkout/test','https://www.mercadopago.com.ar:444/checkout/test','https://www.mercadopago.com.ar/not-checkout']) {
 test('checkout rechaza destino inválido: '+url,async()=>{
  const {context,orders}=env();let calls=0;context.fetch=async()=>{calls++;return {ok:true,status:200,json:async()=>({preference_id:'test',checkout_url:url})};};
  await assert.rejects(vm.runInContext('LumenApi.startOrderCheckout("'+id+'")',context),e=>e.uncertain===true);
  assert.equal(orders.isCheckoutBlocked(id),true);
  await assert.rejects(vm.runInContext('LumenApi.startOrderCheckout("'+id+'")',context),e=>e.code==='CHECKOUT_ALREADY_STARTED');assert.equal(calls,1);
 });
}
test('checkout bloquea llamadas simultáneas y conserva el bloqueo tras éxito',async()=>{
 const {context,orders}=env();let resolve,calls=0;context.fetch=()=>{calls++;return new Promise(r=>resolve=r);};
 const pending=vm.runInContext('LumenApi.startOrderCheckout("'+id+'")',context);
 await assert.rejects(vm.runInContext('LumenApi.startOrderCheckout("'+id+'")',context),e=>e.code==='CHECKOUT_ALREADY_STARTED');
 resolve({ok:true,status:200,json:async()=>({preference_id:'test',checkout_url:'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=test'})});await pending;
 assert.equal(calls,1);assert.equal(orders.isCheckoutBlocked(id),true);
});
test('checkout mantiene bloqueo en memoria si sessionStorage falla',async()=>{
 const {context,window}=env();window.sessionStorage.setItem=()=>{throw Error('blocked');};let calls=0;
 context.fetch=async()=>{calls++;throw Error('offline');};
 await assert.rejects(vm.runInContext('LumenApi.startOrderCheckout("'+id+'")',context));
 await assert.rejects(vm.runInContext('LumenApi.startOrderCheckout("'+id+'")',context),e=>e.code==='CHECKOUT_ALREADY_STARTED');assert.equal(calls,1);
});
test('rechazo inequívoco de checkout libera bloqueo para corrección manual',async()=>{
 const {context,orders}=env();context.fetch=async()=>({ok:false,status:400,json:async()=>({code:'PAYMENT_NOT_CONFIGURED'})});
 await assert.rejects(vm.runInContext('LumenApi.startOrderCheckout("'+id+'")',context));assert.equal(orders.isCheckoutBlocked(id),false);
});
for(const status of [408,500,502])test('POST HTTP '+status+' es incierto y no se reintenta',async()=>{
 const {context}=env();let calls=0;context.fetch=async()=>{calls++;return {ok:false,status,json:async()=>({code:'VALIDATION_ERROR'})};};
 await assert.rejects(vm.runInContext('LumenApi.createOrder({})',context),e=>e.status===status&&e.uncertain===true);assert.equal(calls,1);
});
test('error JSON null conserva status HTTP y permite corrección de 400',async()=>{
 const {context}=env();context.fetch=async()=>({ok:false,status:400,json:async()=>null});
 await assert.rejects(vm.runInContext('LumenApi.createOrder({})',context),e=>e.status===400&&e.code==='HTTP_ERROR'&&!e.uncertain);
});
function functions(context,start,end){const s=source('js/main.js');const a=s.indexOf(start),b=s.indexOf(end,a);assert.ok(a>=0&&b>a);vm.runInContext(s.slice(a,b),context);}
function formEnv() {
 const e=env();const {context}=e;const elements=new Map();
 function element(key){if(!elements.has(key))elements.set(key,{value:'',textContent:'',hidden:false,disabled:false,events:{},classList:{remove(){},add(){}},addEventListener(name,fn){this.events[name]=fn;},setAttribute(){},reportValidity:()=>true,reset(){},focus(){}});return elements.get(key);}
 context.document={querySelector:element};
 for(const [name,value] of Object.entries({customerName:'Ana',customerLastName:'Pérez',customerDni:'12345678',customerPhone:'1112345678',customerEmail:'ana@example.com',deliveryMethod:'PICKUP'}))element('#'+name).value=value;
 for(const name of ['checkoutForm','checkoutStartButton','checkoutMessage','checkoutNote','clearCartButton','customerName','customerLastName','customerPhone'])context[name]=element('#'+name);
 context.renderCart=()=>{};context.persistCart=()=>{};context.buildWhatsappUrl=text=>'https://wa.me/test?text='+encodeURIComponent(text);context.showOrderSummary=()=>{};context.loadLocalCatalog=async()=>{};
 context.fixtureLine=line;
 vm.runInContext('let cart=[fixtureLine], catalogReady=true, catalogLoading=false, orderSubmitting=false, orderRestoring=false, paymentStarting=false, paymentUncertain=false, orderUncertain=LumenOrders.isSubmissionBlocked(), orderReference=null, createdOrder=null;',context);
 functions(context,'function canFinalizeCart() {','function reconcileCart() {');
 functions(context,'function setOrderBusy(','function showOrderSummary(');
 functions(context,'function setupCheckout() {','function setupCartModal() {');
 vm.runInContext('setupCheckout()',context);
 return {...e,element,submit:()=>element('#checkoutForm').events.submit({preventDefault(){}}),canSubmit:()=>vm.runInContext('canFinalizeCart()',context)};
}
test('formulario evita doble envío mientras POST está pendiente',async()=>{
 const h=formEnv();let resolve,calls=0;h.context.fetch=()=>{calls++;return new Promise(r=>resolve=r);};
 const first=h.submit();await h.submit();assert.equal(calls,1);assert.equal(h.orders.isSubmissionBlocked(),true);
 resolve({ok:true,status:201,json:async()=>summary()});await first;assert.equal(h.orders.readReference(),id);assert.equal(h.orders.isSubmissionBlocked(),false);assert.equal(h.canSubmit(),false);
});
test('formulario conserva datos y bloquea reenvío incierto hasta conciliación explícita',async()=>{
 const h=formEnv();let calls=0;h.context.fetch=async()=>{calls++;throw Error('offline');};
 await h.submit();await h.submit();assert.equal(calls,1);assert.equal(h.canSubmit(),false);assert.equal(h.orders.isSubmissionBlocked(),true);
 assert.equal(h.element('#customerName').value,'Ana');assert.equal(h.element('#orderResult').hidden,false);
 const begin=h.element('#newOrderButton').events.click;begin();assert.equal(h.canSubmit(),false);
 h.window.confirm=()=>true;begin();assert.equal(h.canSubmit(),true);assert.equal(h.orders.isSubmissionBlocked(),false);
});
test('formulario trata 5xx como incierto aun si code dice VALIDATION_ERROR',async()=>{
 const h=formEnv();h.context.fetch=async()=>({ok:false,status:500,json:async()=>({code:'VALIDATION_ERROR'})});await h.submit();assert.equal(h.canSubmit(),false);assert.equal(h.orders.isSubmissionBlocked(),true);
});
test('formulario permite corregir un rechazo 400 sin reenviar automáticamente',async()=>{
 const h=formEnv();let calls=0;h.context.fetch=async()=>{calls++;return {ok:false,status:400,json:async()=>({code:'VALIDATION_ERROR'})};};await h.submit();assert.equal(calls,1);assert.equal(h.canSubmit(),true);assert.equal(h.orders.isSubmissionBlocked(),false);
});
test('respuesta 201 mal formada sin UUID bloquea reenvío',async()=>{
 const h=formEnv();h.context.fetch=async()=>({ok:true,status:201,json:async()=>({})});await h.submit();assert.equal(h.canSubmit(),false);assert.equal(h.orders.isSubmissionBlocked(),true);
});
test('catálogo fallido retira precios antiguos, conserva carrito y permite recuperación GET',async()=>{
 const e=env();const {context}=e;const elements=new Map();context.document={querySelector:key=>{if(!elements.has(key))elements.set(key,{textContent:'',hidden:false});return elements.get(key);}};
 context.productos=local;context.isPriceToCoordinate=p=>!!p.precioAcoordinar;context.renderProducts=()=>{};context.closeProductModal=()=>{};context.reconcileCart=()=>{};
 vm.runInContext('let catalogLoading=false,catalogReady=true,catalogProducts=LumenCatalog.resolve(productos,[{slug:"agenda",variants:[{id:1,sku:"AGENDA-A5",name:"A5",price:100}]}]);let productsGrid=null,productModal=null,activeProductCategory="Todos";',context);
 functions(context,'async function loadLocalCatalog() {','function createProductCard(');
 context.fetch=async()=>{throw Error('offline');};await vm.runInContext('loadLocalCatalog()',context);
 assert.equal(vm.runInContext('catalogReady',context),false);assert.equal(vm.runInContext('Object.keys(catalogProducts[0].variantesResueltas).length',context),0);assert.equal(elements.get('#catalogRetryButton').hidden,false);
 context.fetch=async()=>({ok:true,status:200,json:async()=>[product()]});await vm.runInContext('loadLocalCatalog()',context);assert.equal(vm.runInContext('catalogReady',context),true);assert.equal(vm.runInContext('catalogProducts[0].variantesResueltas.A5.precio',context),100);
});
test('HTML carga recursos existentes desde raíz y retornos consultan solo su script de estado',()=>{
 for(const page of ['index','disenos','pago-exitoso','pago-pendiente','pago-fallido']){
  const html=source(page+'.html');assert.match(html,/<base href="\/"/);
  for(const m of html.matchAll(/(?:src|href)="([^"]+)"/g)){const ref=m[1];if(ref.startsWith('http')||ref.startsWith('#')||ref==='/')continue;assert.ok(fs.existsSync(path.join(root,ref.split('#')[0])),page+': '+ref);}
  const scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
  assert.ok(scripts.indexOf('js/config.js')<scripts.indexOf('js/api.js'));
  if(page.startsWith('pago-')){assert.ok(scripts.includes('js/order-return.js'));assert.equal(scripts.includes('js/main.js'),false);assert.match(html,/noindex, nofollow/);assert.match(html,/no-referrer/);}
 }
});
test('propuesta Amplify usa dominio sin ruta, HTML reales y no incluye fallback SPA',()=>{
 const rules=JSON.parse(source('docs/amplify-redirects.json'));assert.deepEqual(rules[0],{source:'https://lumenpaper.com.ar',target:'https://www.lumenpaper.com.ar',status:'301',condition:null});
 for(const r of rules.slice(1)){assert.equal(r.status,'200');assert.equal(r.source.includes('?'),false);assert.ok(fs.existsSync(path.join(root,r.target.slice(1))));assert.notEqual(r.target,'/index.html');}
 assert.ok(source('customHttp.yml').includes("connect-src 'self' https://api.lumenpaper.com.ar;"));
});

test('timeout aborta POST una sola vez y conserva resultado incierto',async()=>{
 const {context}=env();context.setTimeout=fn=>{fn();return 0;};context.clearTimeout=()=>{};let calls=0;
 context.fetch=async(url,options)=>{calls++;assert.equal(options.signal.aborted,true);throw Object.assign(Error('abort'),{name:'AbortError'});};
 await assert.rejects(vm.runInContext('LumenApi.createOrder({})',context),e=>e.uncertain===true&&/15 segundos/.test(e.message));assert.equal(calls,1);
});
test('formulario bloquea éxito ilegible y status inesperado sin UUID',async()=>{
 for(const response of [{ok:true,status:201,json:async()=>{throw SyntaxError('bad JSON');}},{ok:true,status:200,json:async()=>summary()}]){
  const h=formEnv();h.context.fetch=async()=>response;await h.submit();assert.equal(h.canSubmit(),false);assert.equal(h.orders.isSubmissionBlocked(),true);
 }
});
test('reconciliación recupera ID/precio actuales, bloquea ausencia y conserva líneas',()=>{
 const e=env();const {context}=e;context.renderCart=()=>{};context.local=local;context.api=[product()];context.fixtureLine={...line,variant_id:999};
 context.getDesignsForProduct=()=>[{id:'floral',nombre:'Floral',categoriaDiseno:'General'}];context.isBabyDesignOnlyProduct=()=>false;context.isPriceToCoordinate=p=>!!p.precioAcoordinar;
 vm.runInContext('let cart=[fixtureLine],catalogProducts=LumenCatalog.resolve(local,api),catalogReady=true,catalogLoading=false;const CUSTOM_DESIGN_VALUE="personalizado",SIZES={A5:"A5"};',context);
 functions(context,'function reconcileCart() {','function setupCartPersistence() {');
 vm.runInContext('reconcileCart()',context);assert.equal(vm.runInContext('cart[0].variant_id',context),1);assert.equal(vm.runInContext('cart[0].precioUnitario',context),100);
 vm.runInContext('catalogReady=false;reconcileCart()',context);assert.equal(vm.runInContext('cart.length',context),1);assert.equal(vm.runInContext('cart[0].disponible',context),false);assert.equal(vm.runInContext('cart[0].precioUnitario',context),null);
 vm.runInContext('catalogReady=true;reconcileCart()',context);assert.equal(vm.runInContext('cart[0].disponible',context),true);
});
test('recuperación de home rechaza otro UUID y limpia solo carrito PAID asociado',async()=>{
 const h=formEnv();const {context,orders,cart}=h;orders.saveReference(id);cart.save([line]);orders.rememberCart(id,[line]);
 context.hideCheckoutForm=()=>{};context.cartStorageMessage='';context.reconcileCart=()=>{};
 functions(context,'async function restoreOrderReference() {','function setupCheckout() {');
 context.fetch=async()=>({ok:true,status:200,json:async()=>({...summary('PAID'),public_id:other})});await vm.runInContext('restoreOrderReference()',context);assert.equal(cart.load().items.length,1);assert.equal(vm.runInContext('createdOrder',context),null);
 context.fetch=async()=>({ok:true,status:200,json:async()=>summary('PAID')});await vm.runInContext('restoreOrderReference()',context);assert.equal(cart.load().items.length,0);assert.equal(vm.runInContext('cart.length',context),0);
});

test('pedido PAYMENT_REVIEW impide iniciar otra compra incluso invocando el handler',()=>{
 const h=formEnv();h.context.review=summary('PAYMENT_REVIEW');
 vm.runInContext('createdOrder=review;orderReference=review.public_id;setOrderBusy(false)',h.context);
 assert.equal(h.element('#newOrderButton').disabled,true);assert.equal(h.element('#newOrderButton').hidden,true);
 h.window.confirm=()=>true;h.element('#newOrderButton').events.click();
 assert.equal(vm.runInContext('createdOrder.status',h.context),'PAYMENT_REVIEW');
 assert.equal(vm.runInContext('orderReference',h.context),id);assert.equal(h.canSubmit(),false);
});
