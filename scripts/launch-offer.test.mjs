import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdtemp, writeFile, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import {getLaunchOffer, isLaunchOfferPlan, buildBookingMessage} from '../src/launchOffer.mjs';

const config=JSON.parse(await readFile(new URL('../site.config.json',import.meta.url),'utf8')).launchOffer;
const start=Date.parse(config.startsAt);
const end=start+48*60*60*1000;

test('Cairo launch schedule and exact start/end boundaries',()=>{
  assert.equal(new Date(start).toISOString(),'2026-11-27T16:30:00.000Z');
  assert.equal(new Date(end).toISOString(),'2026-11-29T16:30:00.000Z');
  assert.equal(getLaunchOffer(start-1,config).status,'upcoming');
  assert.equal(getLaunchOffer(start,config).remainingMs,48*60*60*1000);
  assert.equal(getLaunchOffer(end-1,config).active,true);
  assert.equal(getLaunchOffer(end,config).status,'expired');
  assert.equal(getLaunchOffer(end+86400000,config).active,false);
  assert.equal(getLaunchOffer(start+123456,config).endsAt,end);
  assert.equal(getLaunchOffer(start+789000,config).endsAt,end);
  assert.equal(getLaunchOffer(start,{}).status,'disabled');
  assert.equal(getLaunchOffer(start,{...config,durationHours:0}).status,'disabled');
});

test('Only the three coaching plans qualify; WhatsApp follows the offer state',()=>{
  for(const en of [false,true]) for(const plan of ['Basic','Standard','Premium']){
    assert.equal(isLaunchOfferPlan(plan),true);
    const active=buildBookingMessage({en,plan,installments:true,offerActive:true});
    assert.match(active,en?/3 months \+ 1 free month/:/٣ شهور \+ شهر مجاني/);
    assert.match(active,en?/3 installments/:/٣ دفعات/);
    assert.doesNotMatch(buildBookingMessage({en,plan}),en?/free month/:/شهر مجاني/);
  }
  for(const plan of ['Training Plan',undefined,'unknown']){
    assert.equal(isLaunchOfferPlan(plan),false);
    assert.doesNotMatch(buildBookingMessage({en:true,plan,offerActive:true}),/free month/);
  }
  assert.match(buildBookingMessage({en:false,plan:'Training Plan',offerActive:true}),/١٠٠ جنيه/);
});

// Render the real home/details to check the schedule, both languages and booking links.
test('Home and all package pages render consistently before, during and after launch',async()=>{
  const root=new URL('../',import.meta.url);
  const directory=await mkdtemp(new URL('.offer-test-',root).pathname);
  const originalNow=Date.now;
  const oldStorage=globalThis.localStorage;
  try {
    const source=await readFile(new URL('../src/main.jsx',import.meta.url),'utf8');
    const entry=source.replace(/createRoot\(document\.getElementById\('root'\)\)\.render\([^\n]+\);/,'export {App,LaunchOfferProvider};');
    assert.notEqual(entry,source,'Test entry must remove the browser mount');
    const result=await build({stdin:{contents:entry,resolveDir:new URL('../src/',import.meta.url).pathname,loader:'jsx'},bundle:true,platform:'node',format:'esm',write:false,loader:{'.css':'empty'},external:['react','react-dom','react-dom/*','react-router-dom','three'],define:{'import.meta.env.BASE_URL':JSON.stringify('/AboEsmail-Coaching/')}});
    const file=directory+'/app.mjs';
    await writeFile(file,result.outputFiles[0].contents);
    const {App,LaunchOfferProvider}=await import(pathToFileURL(file));
    for(const en of [false,true]) for(const [now,state] of [[start-1000,'upcoming'],[start,'active'],[end,'expired']]){
      Date.now=()=>now;
      globalThis.localStorage={getItem:()=>en?'en':'ar'};
      for(const path of ['/','/packages/basic/','/packages/standard/','/packages/premium/','/packages/training/']){
        const html=renderToString(React.createElement(LaunchOfferProvider,null,React.createElement(MemoryRouter,{initialEntries:[path]},React.createElement(App))));
        const training=path.includes('training');
        assert.match(html,/Developed by Mohamed abdullwahab/);
        assert.equal(html.includes('class="launch-offer"'),!training&&state!=='expired',`${en} ${state} ${path} banner`);
        assert.equal(html.includes('role="timer"'),!training&&state==='active');
        assert.equal(html.includes('class="plan-offer"'),!training&&state==='active');
        if(!training&&state!=='expired') assert.match(html,new RegExp(`class="launch-offer" dir="${en?'ltr':'rtl'}"`));
        const bookings=[...html.matchAll(/href="https:\/\/wa.me\/201002149394\?text=([^"]+)"/g)].map(m=>decodeURIComponent(m[1]));
        if(path!=='/'){
          const booking=bookings.find(m=>m.includes(en?'book ':'أحجز '));
          assert.ok(booking,'Package must have a booking link');
          assert.equal(booking.includes(en?'free month':'شهر مجاني'),!training&&state==='active');
        }
        if(path==='/')for(const price of ['600','900','1200'])assert.ok(html.includes(`<strong>${price}</strong>`));
        if(training)assert.ok(html.includes('<strong>100</strong>'));
      }
    }
  } finally {
    Date.now=originalNow;
    if(oldStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=oldStorage;
    await rm(directory,{recursive:true,force:true});
  }
});
