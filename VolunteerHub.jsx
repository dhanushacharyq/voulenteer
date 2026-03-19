import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════
   GLOBAL STYLES (injected once)
═══════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--ink:#0f1117;--cream:#f5f0e8;--gold:#c9a84c;--rust:#b5451b;--sage:#4a6741;--white:#fdfcf9;--error:#c0392b;}
html{scroll-behavior:smooth;}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--ink);overflow-x:hidden;cursor:none;}
a,button,select,input,textarea,label{cursor:none;}
input,textarea,select{font-family:'DM Sans',sans-serif;}

/* CURSOR */
#cursor-dot{position:fixed;top:0;left:0;z-index:99999;pointer-events:none;width:8px;height:8px;background:var(--gold);border-radius:50%;transform:translate(-50%,-50%);transition:width .2s,height .2s,background .2s,opacity .2s;mix-blend-mode:multiply;}
#cursor-ring{position:fixed;top:0;left:0;z-index:99998;pointer-events:none;width:36px;height:36px;border:1.5px solid var(--gold);border-radius:50%;transform:translate(-50%,-50%);transition:width .35s cubic-bezier(.23,1,.32,1),height .35s cubic-bezier(.23,1,.32,1),border-color .3s,opacity .3s,border-radius .3s;opacity:.6;}
#cursor-trail{position:fixed;top:0;left:0;z-index:99997;pointer-events:none;width:6px;height:6px;background:rgba(201,168,76,.35);border-radius:50%;transform:translate(-50%,-50%);transition:left .12s ease,top .12s ease,opacity .4s;}
body.cursor-hover #cursor-dot{width:12px;height:12px;background:var(--rust);}
body.cursor-hover #cursor-ring{width:52px;height:52px;border-color:var(--rust);opacity:.4;}
body.cursor-click #cursor-dot{width:6px;height:6px;background:var(--ink);}
body.cursor-click #cursor-ring{width:22px;height:22px;border-color:var(--ink);opacity:1;}
body.cursor-text #cursor-ring{width:3px;height:32px;border-radius:2px;border-color:var(--ink);opacity:.5;}
body.cursor-text #cursor-dot{opacity:0;}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1.2rem 4rem;background:rgba(245,240,232,0.93);backdrop-filter:blur(10px);border-bottom:1px solid rgba(201,168,76,0.25);transition:box-shadow .3s;}
.nav-logo{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:900;color:var(--ink);letter-spacing:-.5px;text-decoration:none;background:none;border:none;}
.nav-logo span{color:var(--gold);}
.nav-links{display:flex;gap:2.2rem;align-items:center;}
.nav-links button{text-decoration:none;color:var(--ink);font-size:.9rem;font-weight:500;transition:color .2s;background:none;border:none;font-family:'DM Sans',sans-serif;}
.nav-links button:hover{color:var(--gold);}
.btn-nav-admin{padding:.55rem 1.4rem;border:1.5px solid var(--gold)!important;background:transparent;color:var(--gold)!important;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:600;border-radius:2px;transition:all .25s;}
.btn-nav-admin:hover{background:var(--gold)!important;color:var(--ink)!important;}
.notif-btn{position:relative;padding:.55rem .9rem;border:1.5px solid rgba(201,168,76,0.4);background:transparent;color:var(--gold);font-size:.85rem;border-radius:2px;transition:all .25s;display:inline-flex;align-items:center;gap:.35rem;}
.notif-btn:hover{background:rgba(201,168,76,0.1);}
.notif-badge{position:absolute;top:-5px;right:-5px;background:var(--rust);color:#fff;font-size:.65rem;font-weight:700;width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;}

/* HERO */
.hero{min-height:100vh;display:flex;justify-content:center;align-items:center;padding-top:80px;}
.hero-left{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:6rem 4rem;max-width:700px;}
.hero-tag{display:inline-flex;align-items:center;gap:.6rem;font-size:.75rem;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--rust);margin-bottom:1.8rem;}
.hero-left h1{font-family:'Playfair Display',serif;font-size:clamp(3rem,5vw,4.8rem);font-weight:900;line-height:1.05;letter-spacing:-1px;margin-bottom:1.6rem;}
.hero-left h1 em{font-style:italic;color:var(--gold);}
.hero-desc{font-size:1.05rem;line-height:1.75;color:#444;max-width:460px;margin-bottom:3rem;font-weight:300;}
.hero-actions{display:flex;flex-direction:column;gap:1rem;align-items:center;width:100%;}
.hero-actions .btn-primary,.hero-actions .btn-secondary,.hero-actions .btn-outline-gold{width:280px;text-align:center;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.hero-left>*{animation:fadeUp .7s ease both;}
.hero-left>*:nth-child(2){animation-delay:.1s;}
.hero-left>*:nth-child(3){animation-delay:.2s;}
.hero-left>*:nth-child(4){animation-delay:.3s;}

/* BUTTONS */
.btn-primary{padding:.9rem 2.2rem;background:var(--ink);color:var(--cream);border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:500;text-decoration:none;display:inline-block;position:relative;overflow:hidden;transition:all .25s;}
.btn-primary::after{content:'';position:absolute;inset:0;background:var(--gold);transform:translateX(-101%);transition:transform .3s ease;}
.btn-primary:hover::after{transform:translateX(0);}
.btn-primary span{position:relative;z-index:1;}
.btn-secondary{padding:.9rem 2.2rem;background:transparent;color:var(--ink);border:1.5px solid var(--ink);border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:500;text-decoration:none;display:inline-block;transition:all .25s;}
.btn-secondary:hover{background:var(--sage);color:var(--cream);border-color:var(--sage);}
.btn-outline-gold{padding:.9rem 2.2rem;background:transparent;color:var(--gold);border:1.5px solid var(--gold);border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:500;text-decoration:none;display:inline-block;transition:all .25s;}
.btn-outline-gold:hover{background:var(--gold);color:var(--ink);}

/* FEATURES */
.features{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid rgba(15,17,23,.1);border-bottom:1px solid rgba(15,17,23,.1);}
.feature-item{padding:3.5rem 3rem;border-right:1px solid rgba(15,17,23,.1);transition:background .3s;cursor:pointer;}
.feature-item:last-child{border-right:none;}
.feature-item:hover{background:rgba(201,168,76,.06);}
.feature-icon{font-size:2rem;margin-bottom:1.2rem;display:block;}
.feature-title{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;margin-bottom:.7rem;}
.feature-text{font-size:.9rem;line-height:1.7;color:#555;font-weight:300;}

/* EVENTS */
.events-section{padding:7rem 6rem;}
.section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:3.5rem;}
.section-tag{font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:.8rem;display:block;}
.section-title{font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:900;line-height:1.15;}
.events-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5px;background:rgba(15,17,23,.1);}
.event-card{background:var(--cream);padding:2.5rem 2rem;transition:background .3s,transform .3s;color:inherit;display:block;cursor:pointer;border:none;text-align:left;width:100%;}
.event-card:hover{background:var(--ink);color:var(--cream);transform:translateY(-3px);}
.event-card:hover .event-date{color:var(--gold);}
.event-card:hover .event-venue,.event-card:hover .event-meta{color:rgba(245,240,232,.6);}
.event-date{font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--rust);margin-bottom:1rem;font-weight:500;transition:color .3s;}
.event-name{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;margin-bottom:.7rem;line-height:1.25;}
.event-venue{font-size:.85rem;color:#666;margin-bottom:1.5rem;font-weight:300;transition:color .3s;}
.event-meta{display:flex;gap:1.5rem;font-size:.8rem;color:#888;transition:color .3s;}

/* ADMIN BANNER */
.admin-banner{margin:0 6rem;padding:1.8rem 3rem;background:linear-gradient(135deg,var(--ink) 0%,#1a1d27 100%);border:1px solid rgba(201,168,76,.25);display:flex;align-items:center;justify-content:space-between;gap:2rem;}
.admin-banner-text h3{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:var(--cream);margin-bottom:.3rem;}
.admin-banner-text p{font-size:.85rem;color:rgba(245,240,232,.45);font-weight:300;}
.admin-banner-btns{display:flex;gap:.8rem;flex-shrink:0;}
.cta-section{margin:2rem 6rem 7rem;background:var(--ink);color:var(--cream);padding:5rem;display:grid;grid-template-columns:1fr auto;gap:3rem;align-items:center;position:relative;overflow:hidden;}
.cta-section::before{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(201,168,76,.15),transparent 70%);}
.cta-title{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;line-height:1.2;margin-bottom:1rem;}
.cta-title em{color:var(--gold);font-style:italic;}
.cta-text{font-size:.95rem;color:rgba(245,240,232,.65);font-weight:300;line-height:1.7;}
.cta-btns{display:flex;flex-direction:column;gap:1rem;white-space:nowrap;}
footer{background:#0a0b0e;color:rgba(245,240,232,.4);padding:3rem 6rem;display:flex;justify-content:space-between;align-items:center;}
.footer-logo{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:var(--cream);}
.footer-logo span{color:var(--gold);}
.footer-links{display:flex;gap:2rem;}
.footer-links button{font-size:.8rem;color:rgba(245,240,232,.4);text-decoration:none;transition:color .2s;background:none;border:none;font-family:'DM Sans',sans-serif;}
.footer-links button:hover{color:var(--gold);}
.footer-text{font-size:.8rem;}

/* MODAL */
.modal-overlay{position:fixed;inset:0;z-index:200;background:rgba(15,17,23,.7);backdrop-filter:blur(4px);display:flex;justify-content:center;align-items:center;}
.modal-box{background:var(--cream);width:100%;max-width:520px;padding:3rem;position:relative;animation:fadeUp .3s ease both;}
.modal-close{position:absolute;top:1.2rem;right:1.5rem;background:none;border:none;font-size:1.4rem;color:var(--ink);line-height:1;transition:color .2s;}
.modal-close:hover{color:var(--rust);}
.modal-tag{font-size:.75rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:.6rem;display:block;}
.modal-title{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:900;margin-bottom:1.8rem;}
.modal-form-group{margin-bottom:1.2rem;}
.modal-form-group label{display:block;font-size:.82rem;font-weight:500;margin-bottom:.4rem;color:var(--ink);}
.modal-form-group select,.modal-form-group textarea{width:100%;padding:.7rem .9rem;border:1.5px solid rgba(15,17,23,.18);background:var(--white);font-family:'DM Sans',sans-serif;font-size:.9rem;color:var(--ink);border-radius:2px;outline:none;transition:border-color .2s;}
.modal-form-group select:focus,.modal-form-group textarea:focus{border-color:var(--gold);}
.modal-form-group textarea{resize:vertical;min-height:110px;}
.star-rating{display:flex;flex-direction:row-reverse;justify-content:flex-end;gap:.4rem;margin-top:.3rem;}
.star-rating input{display:none;}
.star-rating label{font-size:1.6rem;color:rgba(15,17,23,.2);transition:color .15s;user-select:none;}
.star-rating label:hover,.star-rating label:hover~label,.star-rating input:checked~label{color:var(--gold);}
.modal-submit{margin-top:1.6rem;width:100%;padding:.9rem;background:var(--ink);color:var(--cream);border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.95rem;font-weight:500;position:relative;overflow:hidden;transition:all .25s;}
.modal-submit::after{content:'';position:absolute;inset:0;background:var(--gold);transform:translateX(-101%);transition:transform .3s ease;}
.modal-submit:hover::after{transform:translateX(0);}
.modal-submit span{position:relative;z-index:1;}
.access-denied{text-align:center;padding:1rem 0;}
.access-denied .deny-icon{font-size:2.5rem;margin-bottom:1rem;display:block;}
.access-denied p{font-size:.9rem;color:#666;font-weight:300;line-height:1.7;}
.access-denied strong{color:var(--rust);}

/* LOGIN PAGE */
.login-page{background:var(--ink);min-height:100vh;display:flex;}
.left-panel{width:45%;background:var(--ink);display:flex;flex-direction:column;justify-content:space-between;padding:3.5rem 4rem;position:relative;overflow:hidden;}
.left-panel::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 80% 50%,rgba(201,168,76,.08),transparent 65%);pointer-events:none;}
.brand{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:900;color:var(--cream);letter-spacing:-.5px;}
.brand span{color:var(--gold);}
.brand-back{display:flex;align-items:center;gap:1rem;text-decoration:none;background:none;border:none;}
.back-arrow{width:32px;height:32px;border:1px solid rgba(245,240,232,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--cream);font-size:.9rem;transition:all .2s;}
.back-arrow:hover{border-color:var(--gold);color:var(--gold);}
.panel-middle{position:relative;z-index:1;}
.panel-quote{font-family:'Playfair Display',serif;font-size:2.6rem;font-weight:900;color:var(--cream);line-height:1.15;margin-bottom:1.5rem;}
.panel-quote em{color:var(--gold);font-style:italic;}
.panel-desc{font-size:.9rem;color:rgba(245,240,232,.45);line-height:1.75;font-weight:300;max-width:340px;}
.deco-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:3rem;}
.deco-cell{height:8px;background:rgba(201,168,76,.15);border-radius:1px;animation:pulse 2s ease-in-out infinite;}
.deco-cell:nth-child(odd){animation-delay:.3s;}
.deco-cell:nth-child(3n){background:rgba(201,168,76,.35);}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
.redirect-info{margin-top:2rem;padding:1rem 1.2rem;border:1px solid rgba(201,168,76,.2);border-radius:6px;background:rgba(201,168,76,.05);}
.redirect-info p{font-size:.78rem;color:rgba(245,240,232,.4);line-height:1.6;}
.redirect-info strong{color:var(--gold);}
.panel-footer{font-size:.75rem;color:rgba(245,240,232,.25);}
.right-panel{flex:1;background:var(--cream);display:flex;align-items:center;justify-content:center;padding:3rem;}
.login-box{width:100%;max-width:420px;animation:slideIn .5s ease both;}
@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.login-heading{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;margin-bottom:.4rem;}
.login-sub{font-size:.9rem;color:#666;margin-bottom:2.5rem;font-weight:300;}
.login-sub button{color:var(--rust);text-decoration:none;font-weight:500;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:.9rem;}
.role-toggle{display:grid;grid-template-columns:1fr 1fr;border:1.5px solid rgba(15,17,23,.15);border-radius:3px;margin-bottom:2rem;overflow:hidden;}
.role-btn{padding:.75rem 1rem;text-align:center;background:transparent;border:none;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;transition:all .25s;color:#888;}
.role-btn.active{background:var(--ink);color:var(--cream);}
.cred-hint{background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);padding:.75rem 1rem;border-radius:4px;font-size:.78rem;color:#665a2a;margin-bottom:1.4rem;line-height:1.6;}
.cred-hint strong{color:#9a7d1a;}
.form-group{margin-bottom:1.4rem;}
.form-label{display:block;font-size:.78rem;font-weight:500;letter-spacing:.5px;text-transform:uppercase;margin-bottom:.5rem;color:#444;}
.input-wrap{position:relative;}
.input-wrap .icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:.9rem;pointer-events:none;color:#aaa;}
.text-input{width:100%;padding:.85rem 1rem .85rem 2.8rem;border:1.5px solid rgba(15,17,23,.15);background:var(--white);color:var(--ink);font-family:'DM Sans',sans-serif;font-size:.95rem;border-radius:2px;outline:none;transition:border-color .2s,box-shadow .2s;}
.text-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.12);}
.form-footer-link{display:flex;justify-content:flex-end;margin-top:-.8rem;margin-bottom:1.6rem;}
.form-footer-link button{font-size:.8rem;color:var(--rust);text-decoration:none;font-weight:500;background:none;border:none;font-family:'DM Sans',sans-serif;}
.form-footer-link button:hover{text-decoration:underline;}
.btn-login{width:100%;padding:1rem;background:var(--ink);color:var(--cream);border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:500;position:relative;overflow:hidden;transition:transform .15s;}
.btn-login::after{content:'';position:absolute;inset:0;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .3s ease;}
.btn-login:hover::after{transform:scaleX(1);}
.btn-login span{position:relative;z-index:1;}
.btn-login:active{transform:scale(.99);}
.divider{display:flex;align-items:center;gap:1rem;margin:1.8rem 0;color:#bbb;font-size:.8rem;}
.divider::before,.divider::after{content:'';flex:1;height:1px;background:rgba(15,17,23,.1);}
.quick-links{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.6rem;margin-bottom:1.4rem;}
.quick-link{padding:.6rem .5rem;text-align:center;border-radius:4px;font-size:.75rem;font-weight:600;border:1px solid rgba(15,17,23,.12);color:var(--ink);transition:all .2s;background:transparent;font-family:'DM Sans',sans-serif;}
.quick-link:hover{border-color:var(--gold);color:var(--gold);background:rgba(201,168,76,.06);}
.register-link{text-align:center;font-size:.88rem;color:#666;}
.register-link button{color:var(--ink);font-weight:600;text-decoration:none;border-bottom:1.5px solid var(--gold);padding-bottom:1px;background:none;border-left:none;border-right:none;border-top:none;font-family:'DM Sans',sans-serif;}
.error-msg{background:rgba(192,57,43,.08);border:1px solid rgba(192,57,43,.25);color:var(--error);padding:.8rem 1rem;border-radius:2px;font-size:.85rem;margin-bottom:1.2rem;animation:shake .4s ease;}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}

/* REGISTER PAGE */
.topbar{background:var(--ink);padding:1.1rem 4rem;display:flex;align-items:center;justify-content:space-between;}
.topbar .brand{font-size:1.4rem;}
.topbar-right{display:flex;align-items:center;gap:1.5rem;}
.topbar-link{font-size:.85rem;color:rgba(245,240,232,.55);text-decoration:none;transition:color .2s;background:none;border:none;font-family:'DM Sans',sans-serif;}
.topbar-link:hover{color:var(--gold);}
.topbar-admin{font-size:.8rem;font-weight:600;color:var(--gold);text-decoration:none;border:1px solid rgba(201,168,76,.35);padding:.35rem .9rem;border-radius:3px;transition:all .2s;background:transparent;font-family:'DM Sans',sans-serif;}
.topbar-admin:hover{background:var(--gold);color:var(--ink);}
.page-wrap{max-width:960px;margin:0 auto;padding:4rem 2rem 6rem;}
.role-select-wrap{display:flex;align-items:center;gap:1.5rem;margin-bottom:2.5rem;}
.role-select-label{font-size:.85rem;font-weight:500;color:#666;}
.steps{display:flex;align-items:center;margin-bottom:2.5rem;gap:0;}
.step{display:flex;align-items:center;gap:.6rem;font-size:.82rem;font-weight:500;color:#aaa;}
.step.active{color:var(--ink);}
.step.done{color:var(--sage);}
.step-num{width:28px;height:28px;border-radius:50%;border:2px solid currentColor;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;}
.step.done .step-num{background:var(--sage);color:#fff;border-color:var(--sage);}
.step.active .step-num{background:var(--ink);color:#fff;border-color:var(--ink);}
.step-line{flex:1;height:1px;background:rgba(15,17,23,.1);margin:0 .8rem;}
.form-card{background:var(--white);border:1px solid rgba(15,17,23,.08);padding:2.5rem 3rem;}
.admin-stripe{border-left:3px solid var(--gold);}
.admin-badge{display:inline-flex;align-items:center;gap:.5rem;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.25);color:#8a6d1e;padding:.4rem .9rem;border-radius:3px;font-size:.78rem;font-weight:600;margin-bottom:1.2rem;}
.section-label{font-size:.72rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;margin-bottom:.4rem;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;}
.two-col .full{grid-column:1/-1;}
.reg-label{display:block;font-size:.78rem;font-weight:500;letter-spacing:.5px;text-transform:uppercase;margin-bottom:.4rem;color:#555;}
.req{color:var(--rust);}
.reg-input{width:100%;padding:.7rem 1rem .7rem 2.6rem;border:1.5px solid rgba(15,17,23,.12);background:var(--cream);color:var(--ink);font-family:'DM Sans',sans-serif;font-size:.9rem;border-radius:2px;outline:none;transition:border-color .2s;}
.reg-input:focus{border-color:var(--gold);}
.reg-input.no-icon{padding-left:.9rem;}
.reg-textarea{width:100%;padding:.7rem .9rem;border:1.5px solid rgba(15,17,23,.12);background:var(--cream);color:var(--ink);font-family:'DM Sans',sans-serif;font-size:.9rem;border-radius:2px;outline:none;transition:border-color .2s;resize:vertical;min-height:90px;}
.reg-textarea:focus{border-color:var(--gold);}
.reg-select{width:100%;padding:.7rem .9rem;border:1.5px solid rgba(15,17,23,.12);background:var(--cream);color:var(--ink);font-family:'DM Sans',sans-serif;font-size:.9rem;border-radius:2px;outline:none;}
.field-error{font-size:.75rem;color:var(--error);margin-top:.3rem;display:block;}
.skills-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;margin-top:.6rem;}
.skill-chip{padding:.5rem .8rem;border:1.5px solid rgba(15,17,23,.12);border-radius:20px;font-size:.78rem;font-weight:500;text-align:center;transition:all .2s;cursor:pointer;background:transparent;font-family:'DM Sans',sans-serif;}
.skill-chip.selected{background:var(--ink);color:var(--cream);border-color:var(--ink);}
.skill-chip:hover:not(.selected){border-color:var(--gold);color:var(--gold);}
.avail-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:.4rem;margin-top:.6rem;}
.day-chip{padding:.4rem .3rem;border:1.5px solid rgba(15,17,23,.12);border-radius:4px;font-size:.72rem;font-weight:600;text-align:center;cursor:pointer;transition:all .2s;background:transparent;font-family:'DM Sans',sans-serif;}
.day-chip.selected{background:var(--sage);color:#fff;border-color:var(--sage);}
.strength-bar{height:4px;background:rgba(15,17,23,.08);border-radius:2px;margin-top:.4rem;overflow:hidden;}
.strength-fill{height:100%;border-radius:2px;transition:width .3s,background .3s;}
.strength-text{font-size:.72rem;color:#aaa;margin-top:.3rem;}
.form-divider{border:none;border-top:1px solid rgba(15,17,23,.08);margin:1.5rem 0;}
.terms-label{display:flex;align-items:flex-start;gap:.6rem;font-size:.84rem;color:#555;line-height:1.5;}
.terms-label a{color:var(--gold);text-decoration:none;}
.form-actions{display:flex;justify-content:space-between;align-items:center;margin-top:2rem;gap:1rem;}
.btn-submit{padding:.85rem 2rem;background:var(--ink);color:var(--cream);border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:500;position:relative;overflow:hidden;transition:all .25s;}
.btn-submit::after{content:'';position:absolute;inset:0;background:var(--gold);transform:translateX(-101%);transition:transform .3s ease;}
.btn-submit:hover::after{transform:translateX(0);}
.btn-submit span{position:relative;z-index:1;}
.btn-cancel{padding:.85rem 1.5rem;background:transparent;color:#888;border:1.5px solid rgba(15,17,23,.12);border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:500;transition:all .2s;}
.btn-cancel:hover{border-color:var(--ink);color:var(--ink);}
.success-box{text-align:center;padding:3rem;}
.success-icon{font-size:3.5rem;display:block;margin-bottom:1.2rem;}
.success-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;margin-bottom:.8rem;}
.success-text{font-size:.95rem;color:#666;font-weight:300;line-height:1.7;margin-bottom:2rem;}
.success-actions{display:flex;flex-direction:column;gap:.8rem;align-items:center;}

/* ADMIN PANEL */
.inner-nav{position:sticky;top:0;z-index:50;background:var(--cream);border-bottom:1px solid rgba(15,17,23,.08);padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;}
.inner-nav-logo{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:900;color:var(--ink);}
.inner-nav-logo span{color:var(--gold);}
.inner-nav-actions{display:flex;align-items:center;gap:1rem;}
.back-btn{padding:.5rem 1.2rem;border:1.5px solid rgba(15,17,23,.2);background:transparent;color:var(--ink);font-family:'DM Sans',sans-serif;font-size:.85rem;border-radius:2px;transition:all .2s;}
.back-btn:hover{background:var(--ink);color:var(--cream);}
.admin-layout{display:grid;grid-template-columns:240px 1fr;min-height:calc(100vh - 60px);}
.admin-sidebar{border-right:1px solid rgba(15,17,23,.08);padding:1.5rem 0;position:sticky;top:60px;height:calc(100vh - 60px);overflow-y:auto;}
.sidebar-section{margin-bottom:1.5rem;}
.sidebar-section-label{font-size:.65rem;letter-spacing:2px;text-transform:uppercase;color:#bbb;padding:.3rem 1.5rem;font-weight:600;}
.sidebar-item{display:flex;align-items:center;gap:.7rem;padding:.7rem 1.5rem;font-size:.88rem;font-weight:500;color:#666;transition:all .2s;cursor:pointer;}
.sidebar-item:hover{background:rgba(201,168,76,.06);color:var(--ink);}
.sidebar-item.active{background:rgba(15,17,23,.05);color:var(--ink);border-left:2px solid var(--gold);}
.si-icon{font-size:1rem;}
.admin-content{padding:2.5rem;}
.admin-section{display:none;}
.admin-section.active{display:block;}
.page-hero{margin-bottom:2.5rem;}
.page-hero h2{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;line-height:1.1;}
.page-hero p{font-size:.95rem;color:#666;margin-top:.5rem;font-weight:300;}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;margin-bottom:2.5rem;}
.stat-card{padding:1.5rem;border-left:3px solid;position:relative;}
.stat-card.gold{background:rgba(201,168,76,.06);border-color:var(--gold);}
.stat-card.rust{background:rgba(181,69,27,.06);border-color:var(--rust);}
.stat-card.sage{background:rgba(74,103,65,.06);border-color:var(--sage);}
.stat-card.ink{background:rgba(15,17,23,.04);border-color:var(--ink);}
.stat-num{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:900;}
.stat-label{font-size:.78rem;color:#888;margin-top:.2rem;}
.data-table-wrap{background:var(--white);border:1px solid rgba(15,17,23,.08);overflow:hidden;}
.table-header{display:flex;align-items:center;justify-content:space-between;padding:1.2rem 1.5rem;border-bottom:1px solid rgba(15,17,23,.06);}
.table-header h3{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;}
.table-search{padding:.5rem .9rem;border:1.5px solid rgba(15,17,23,.1);border-radius:2px;font-size:.85rem;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s;}
.table-search:focus{border-color:var(--gold);}
table{width:100%;border-collapse:collapse;}
th{font-size:.72rem;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#888;padding:.9rem 1.2rem;text-align:left;border-bottom:1px solid rgba(15,17,23,.06);}
td{padding:.9rem 1.2rem;font-size:.88rem;border-bottom:1px solid rgba(15,17,23,.04);}
tr:last-child td{border-bottom:none;}
tr:hover td{background:rgba(201,168,76,.03);}
.badge{display:inline-flex;align-items:center;padding:.25rem .7rem;border-radius:20px;font-size:.72rem;font-weight:600;}
.badge-green{background:rgba(74,103,65,.12);color:var(--sage);}
.badge-red{background:rgba(181,69,27,.1);color:var(--rust);}
.badge-gold{background:rgba(201,168,76,.12);color:#8a6d1e;}
.badge-grey{background:rgba(15,17,23,.06);color:#888;}
.admin-form-card{background:var(--white);border:1px solid rgba(15,17,23,.08);padding:1.8rem;margin-bottom:1.5rem;}
.admin-form-card h3{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;margin-bottom:1.2rem;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;}
.form-row.three{grid-template-columns:1fr 1fr 1fr;}
.form-row.full{grid-template-columns:1fr;}
.form-row label{display:block;font-size:.78rem;font-weight:500;letter-spacing:.5px;text-transform:uppercase;margin-bottom:.4rem;color:#555;}
.form-row input,.form-row select,.form-row textarea{width:100%;padding:.65rem .9rem;border:1.5px solid rgba(15,17,23,.12);background:var(--cream);color:var(--ink);font-family:'DM Sans',sans-serif;font-size:.88rem;border-radius:2px;outline:none;transition:border-color .2s;}
.form-row input:focus,.form-row select:focus,.form-row textarea:focus{border-color:var(--gold);}
.form-row textarea{resize:vertical;min-height:80px;}
.btn-admin{padding:.7rem 1.6rem;background:var(--ink);color:var(--cream);border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.88rem;font-weight:500;transition:all .25s;}
.btn-admin:hover{background:var(--gold);color:var(--ink);}
.btn-admin-sm{padding:.4rem .9rem;background:var(--ink);color:var(--cream);border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:500;transition:all .2s;}
.btn-admin-sm:hover{background:var(--gold);color:var(--ink);}
.btn-danger-sm{padding:.4rem .9rem;background:var(--rust);color:#fff;border:none;border-radius:2px;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:500;transition:all .2s;}
.btn-danger-sm:hover{opacity:.85;}
.section-divider{font-size:.7rem;letter-spacing:2px;text-transform:uppercase;color:#bbb;font-weight:600;padding:.6rem 0;border-bottom:1px solid rgba(15,17,23,.06);margin-bottom:1rem;}
.avail-tag{font-size:.72rem;font-weight:600;padding:.25rem .6rem;border-radius:3px;}
.avail-yes{background:rgba(74,103,65,.1);color:var(--sage);}
.avail-no{background:rgba(181,69,27,.1);color:var(--rust);}

/* NOTIFICATION PANEL */
.notif-panel{position:fixed;top:0;right:-380px;width:360px;height:100vh;background:var(--white);z-index:500;box-shadow:-4px 0 30px rgba(15,17,23,.12);transition:right .3s ease;overflow-y:auto;}
.notif-panel.open{right:0;}
.notif-panel-head{display:flex;align-items:center;justify-content:space-between;padding:1.5rem;border-bottom:1px solid rgba(15,17,23,.08);position:sticky;top:0;background:var(--white);z-index:1;}
.notif-panel-head h3{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;}
.notif-close-btn{background:none;border:none;font-size:1.2rem;color:#888;transition:color .2s;}
.notif-close-btn:hover{color:var(--rust);}
.notif-item{display:grid;grid-template-columns:auto 1fr auto;gap:.8rem;padding:1.2rem 1.5rem;border-bottom:1px solid rgba(15,17,23,.05);transition:background .2s;}
.notif-item.unread{background:rgba(201,168,76,.04);}
.notif-item:hover{background:rgba(201,168,76,.06);}
.notif-icon{font-size:1.4rem;line-height:1;}
.notif-title{font-size:.85rem;font-weight:600;margin-bottom:.2rem;}
.notif-body{font-size:.8rem;color:#666;line-height:1.5;}
.notif-time{font-size:.72rem;color:#bbb;margin-top:.3rem;}
.mark-read-btn{padding:.3rem .6rem;background:transparent;border:1px solid rgba(15,17,23,.1);border-radius:3px;font-size:.7rem;color:#888;transition:all .2s;white-space:nowrap;font-family:'DM Sans',sans-serif;}
.mark-read-btn:hover{border-color:var(--gold);color:var(--gold);}

/* EVENT DETAIL */
.event-detail-hero{background:var(--ink);color:var(--cream);padding:8rem 6rem 4rem;}
.event-detail-meta{display:flex;gap:2rem;margin-top:1.5rem;flex-wrap:wrap;}
.event-detail-meta-item{font-size:.9rem;color:rgba(245,240,232,.7);}
.event-detail-body{padding:4rem 6rem;display:grid;grid-template-columns:1fr 320px;gap:3rem;}
.event-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;align-content:start;}
.event-info-card{background:var(--white);border:1px solid rgba(15,17,23,.08);padding:1.4rem;}
.info-label{font-size:.7rem;letter-spacing:1.5px;text-transform:uppercase;color:#bbb;font-weight:600;margin-bottom:.4rem;}
.info-val{font-size:.95rem;font-weight:500;}
.info-sub{font-size:.8rem;color:#888;margin-top:.2rem;font-weight:300;}
.vol-list-in-event{background:var(--white);border:1px solid rgba(15,17,23,.08);padding:1.5rem;align-self:start;}
.vol-list-in-event h3{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;margin-bottom:1rem;}
.vol-chip{display:inline-flex;align-items:center;gap:.5rem;padding:.45rem 1rem;background:var(--cream);border:1px solid rgba(15,17,23,.1);border-radius:20px;font-size:.82rem;font-weight:500;margin:.25rem;}
.vc-role{font-size:.72rem;color:var(--gold);margin-left:.3rem;}

/* ALL EVENTS PAGE */
.all-events-header{background:var(--ink);color:var(--cream);padding:7rem 6rem 3rem;}
.all-events-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;padding:4rem 6rem;}
.all-event-card{background:var(--white);border:1px solid rgba(15,17,23,.08);overflow:hidden;transition:transform .3s,box-shadow .3s;cursor:pointer;}
.all-event-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(15,17,23,.1);}
.aec-top{background:var(--ink);padding:1.5rem;color:var(--cream);}
.aec-top .event-date{font-size:.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:.5rem;font-weight:500;}
.aec-top .event-name{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:700;}
.aec-body{padding:1.5rem;}
.aec-row{display:flex;align-items:center;gap:.6rem;font-size:.84rem;color:#666;margin-bottom:.6rem;font-weight:300;}
.aec-desc{font-size:.85rem;line-height:1.6;color:#555;font-weight:300;margin-top:.8rem;padding-top:.8rem;border-top:1px solid rgba(15,17,23,.06);}
.aec-slots{display:inline-flex;align-items:center;gap:.4rem;padding:.35rem .8rem;background:rgba(74,103,65,.1);color:var(--sage);border-radius:20px;font-size:.75rem;font-weight:600;margin-top:.8rem;}

/* SCHEDULING / ATTENDANCE / PERFORMANCE */
.inner-page-wrap{max-width:1100px;margin:0 auto;padding:3rem 2rem 6rem;}
.sched-event-card{background:var(--white);border:1px solid rgba(15,17,23,.08);margin-bottom:1.5rem;overflow:hidden;}
.sched-event-head{background:var(--ink);color:var(--cream);padding:1.2rem 1.8rem;display:flex;align-items:center;justify-content:space-between;}
.sched-event-head .ev-name{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;}
.sched-event-head .ev-meta{font-size:.82rem;color:rgba(245,240,232,.55);margin-top:.2rem;}
.sched-vol-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;padding:1.5rem;}
.sched-vol-card{border:1px solid rgba(15,17,23,.1);padding:1.2rem;background:var(--cream);border-radius:2px;}
.svc-name{font-size:.92rem;font-weight:600;margin-bottom:.3rem;}
.svc-role{font-size:.75rem;color:var(--gold);font-weight:500;margin-bottom:.5rem;}
.att-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;margin-bottom:2.5rem;}
.att-card{background:var(--white);border:1px solid rgba(15,17,23,.08);padding:1.4rem;text-align:center;}
.att-num{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:var(--ink);}
.att-lbl{font-size:.78rem;color:#888;margin-top:.3rem;}
.perf-card{background:var(--white);border:1px solid rgba(15,17,23,.08);padding:1.8rem;margin-bottom:1rem;display:grid;grid-template-columns:auto 1fr auto;gap:1.5rem;align-items:center;}
.perf-avatar{width:52px;height:52px;border-radius:50%;background:var(--ink);color:var(--cream);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;flex-shrink:0;}
.perf-name{font-size:1rem;font-weight:600;margin-bottom:.2rem;}
.perf-role{font-size:.8rem;color:#888;font-weight:300;}
.perf-stars{color:var(--gold);font-size:1.1rem;margin-top:.4rem;}
.perf-meta{font-size:.78rem;color:#aaa;margin-top:.3rem;}
.perf-comment{font-size:.85rem;color:#555;line-height:1.6;margin-top:.6rem;font-weight:300;font-style:italic;}
.perf-score{text-align:center;}
.score-num{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:var(--gold);}
.score-lbl{font-size:.72rem;color:#aaa;}

/* TOAST */
.toast{position:fixed;bottom:2rem;right:2rem;background:var(--ink);color:var(--cream);padding:.9rem 1.8rem;border-radius:4px;font-size:.88rem;transform:translateY(100px);opacity:0;transition:all .3s;z-index:9999;border-left:3px solid var(--gold);}
.toast.show{transform:translateY(0);opacity:1;}

/* FORGOT PASSWORD */
.forgot-modal{background:var(--cream);width:100%;max-width:480px;padding:3rem;position:relative;animation:fadeUp .3s ease both;}

@media(max-width:900px){
  .admin-layout{grid-template-columns:1fr;}
  .admin-sidebar{position:static;height:auto;}
  .stat-grid,.att-summary{grid-template-columns:1fr 1fr;}
  .all-events-grid{grid-template-columns:1fr 1fr;padding:2rem;}
  .event-info-grid{grid-template-columns:1fr;}
}
@media(max-width:700px){
  .two-col{grid-template-columns:1fr;}
  .skills-grid{grid-template-columns:repeat(2,1fr);}
  .avail-grid{grid-template-columns:repeat(4,1fr);}
  .form-card{padding:2rem 1.5rem;}
  .topbar,nav{padding:1rem 1.5rem;}
  .left-panel{display:none;}
  .events-section,.admin-banner,.cta-section,footer{padding-left:1.5rem;padding-right:1.5rem;}
  .admin-banner,.cta-section{margin-left:0;margin-right:0;}
  .all-events-grid{grid-template-columns:1fr;padding:1.5rem;}
  .all-events-header,.event-detail-hero{padding:5rem 1.5rem 2rem;}
  .inner-nav{padding:1rem 1.5rem;}
  .admin-content{padding:1.5rem;}
  .stat-grid{grid-template-columns:1fr 1fr;}
  .perf-card{grid-template-columns:auto 1fr;}
  .notif-panel{width:100%;}
  .event-detail-body{grid-template-columns:1fr;padding:2rem 1.5rem;}
}
`;

/* ═══════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════ */
function fmt(t) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${ampm}`;
}
function toMins(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function calcDuration(s, e) {
  const mins = toMins(e) - toMins(s);
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}
function fmtDate(dateVal) {
  return new Date(dateVal + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ═══════════════════════════════════════════════
   CUSTOM CURSOR HOOK
═══════════════════════════════════════════════ */
function useCursor() {
  useEffect(() => {
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    const trail = document.getElementById("cursor-trail");
    if (!dot || !ring || !trail) return;
    let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0, rafId;
    const onMove = (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + "px"; dot.style.top = mouseY + "px";
      ring.style.left = mouseX + "px"; ring.style.top = mouseY + "px";
    };
    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;
      trail.style.left = trailX + "px"; trail.style.top = trailY + "px";
      rafId = requestAnimationFrame(animateTrail);
    };
    rafId = requestAnimationFrame(animateTrail);
    const HOVER = "a,button,[data-hover],.skill-chip,.day-chip,.event-card,.feature-item,.quick-link,.role-btn,.btn-submit,.btn-cancel,.modal-submit,.modal-close,.sidebar-item,.all-event-card,.perf-card,.sched-vol-card";
    const onOver = (e) => {
      if (e.target.closest(HOVER)) document.body.classList.add("cursor-hover");
      if (e.target.closest("input,textarea,select")) { document.body.classList.remove("cursor-hover"); document.body.classList.add("cursor-text"); }
    };
    const onOut = (e) => {
      if (e.target.closest(HOVER)) document.body.classList.remove("cursor-hover");
      if (e.target.closest("input,textarea,select")) document.body.classList.remove("cursor-text");
    };
    const onDown = () => document.body.classList.add("cursor-click");
    const onUp = () => document.body.classList.remove("cursor-click");
    const onLeave = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; trail.style.opacity = "0"; };
    const onEnter = () => { dot.style.opacity = "1"; ring.style.opacity = "0.6"; trail.style.opacity = "1"; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);
}

/* ═══════════════════════════════════════════════
   TOAST HOOK
═══════════════════════════════════════════════ */
function useToast() {
  const [toast, setToast] = useState({ msg: "", show: false });
  const timerRef = useRef();
  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3200);
  }, []);
  return { toast, showToast };
}

/* ═══════════════════════════════════════════════
   INITIAL DATA
═══════════════════════════════════════════════ */
const INIT_VOLUNTEERS = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "9876543210", skills: ["📚 Teaching", "🎤 Public Speaking"], timeStart: "08:00", timeEnd: "18:00", events: [] },
  { id: 2, name: "Bob Martinez", email: "bob@example.com", phone: "9123456780", skills: ["🔧 Logistics", "🚗 Driving"], timeStart: "07:00", timeEnd: "14:00", events: [] },
  { id: 3, name: "Carol Singh", email: "carol@example.com", phone: "9988776655", skills: ["🏥 First Aid", "🎨 Design"], timeStart: "09:00", timeEnd: "17:00", events: [] },
  { id: 4, name: "David Lee", email: "david@example.com", phone: "9001122334", skills: ["💻 Tech / IT", "📷 Photography"], timeStart: "10:00", timeEnd: "20:00", events: [] },
  { id: 5, name: "Priya Nair", email: "priya@example.com", phone: "9112233445", skills: ["🌐 Translation", "📚 Teaching"], timeStart: "06:00", timeEnd: "12:00", events: [] },
  { id: 6, name: "Ravi Kumar", email: "ravi@example.com", phone: "9223344556", skills: ["⚽ Sports", "🎵 Music"], timeStart: "12:00", timeEnd: "20:00", events: [] },
];

const SKILLS = ["🎤 Public Speaking","🏥 First Aid","💻 Tech / IT","🎨 Design","📷 Photography","🍳 Cooking","🚗 Driving","📚 Teaching","🌐 Translation","🎵 Music","⚽ Sports","🔧 Logistics"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════ */

function NotifPanel({ notifications, open, onClose, onMarkRead }) {
  const unread = notifications.filter(n => n.unread).length;
  return (
    <div className={`notif-panel${open ? " open" : ""}`}>
      <div className="notif-panel-head">
        <h3>🔔 Notifications</h3>
        <button className="notif-close-btn" onClick={onClose}>✕</button>
      </div>
      {notifications.length === 0 ? (
        <div style={{ padding: "2rem 1.5rem", textAlign: "center", color: "#aaa", fontSize: ".88rem" }}>
          No notifications yet.<br />Notifications will appear here when admin sends them.
        </div>
      ) : notifications.map(n => (
        <div key={n.id} className={`notif-item${n.unread ? " unread" : ""}`}>
          <div className="notif-icon">{n.icon}</div>
          <div className="notif-content">
            <div className="notif-title">{n.title}</div>
            <div className="notif-body">{n.body}</div>
            <div className="notif-time">{n.time}</div>
          </div>
          {n.unread && <button className="mark-read-btn" onClick={() => onMarkRead(n.id)}>✓ Read</button>}
        </div>
      ))}
    </div>
  );
}

function NavBar({ onNav, onToggleNotif, unreadCount, onFeedback }) {
  return (
    <nav id="mainNav">
      <button className="nav-logo" onClick={() => onNav("home")}>Volunteer<span>Hub</span></button>
      <div className="nav-links">
        <button onClick={onFeedback}>Feedback</button>
        <button className="btn-nav-admin" onClick={() => onNav("requireAdmin")}>⚙ Admin Panel</button>
        <button className="notif-btn" onClick={onToggleNotif}>
          🔔 {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>
      </div>
    </nav>
  );
}

function InnerNav({ onNav, onToggleNotif, unreadCount, backTo = "home", backLabel = "← Home", adminMode = false }) {
  return (
    <div className="inner-nav">
      <div className="inner-nav-logo">Volunteer<span>Hub</span>{adminMode && " — Admin"}</div>
      <div className="inner-nav-actions">
        <button className="notif-btn" onClick={onToggleNotif}>
          🔔 {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>
        <button className="back-btn" onClick={() => onNav(backTo)}>{backLabel}</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════ */
function HomePage({ onNav, events, onOpenEvent, onFeedback, onToggleNotif, unreadCount }) {
  return (
    <div>
      <NavBar onNav={onNav} onToggleNotif={onToggleNotif} unreadCount={unreadCount} onFeedback={onFeedback} />
      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">Volunteer Management System</div>
          <h1>Make a<br /><em>Difference</em><br />Together</h1>
          <p className="hero-desc">Connect passionate volunteers with meaningful events. Streamline scheduling, track attendance, and build a community that cares.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => onNav("login")}><span>Login to Dashboard</span></button>
            <button className="btn-secondary" onClick={() => onNav("register")}>Register as Volunteer</button>
            <button className="btn-outline-gold" onClick={() => onNav("all-events")}>View Events</button>
          </div>
        </div>
      </section>

      <div className="features">
        {[["📋","Smart Scheduling","Assign volunteers to shifts and roles automatically based on availability and skill sets."],
          ["📊","Attendance Tracking","Real-time check-in and attendance records for every event, shift, and assignment."],
          ["⭐","Performance Reviews","Coordinators can provide feedback and ratings to recognize outstanding volunteer work."]
        ].map(([icon, title, text]) => (
          <div key={title} className="feature-item" onClick={() => onNav("requireAdmin")}>
            <span className="feature-icon">{icon}</span>
            <div className="feature-title">{title}</div>
            <p className="feature-text">{text}</p>
          </div>
        ))}
      </div>

      <div className="admin-banner">
        <div className="admin-banner-text">
          <h3>⚙ Admin / Coordinator Panel</h3>
          <p>Manage volunteers, events, roles, shifts, assignments, attendance and feedback from one place.</p>
        </div>
        <div className="admin-banner-btns">
          <button className="btn-primary" onClick={() => onNav("requireAdmin")}><span>Open Admin Panel →</span></button>
          <button className="btn-outline-gold" onClick={() => onNav("login")}>Login First</button>
        </div>
      </div>

      <section className="events-section" id="events">
        <div className="section-header">
          <div><span className="section-tag">Upcoming</span><h2 className="section-title">Events Open<br />for Volunteers</h2></div>
          <button className="btn-secondary" onClick={() => onNav("all-events")}>See All Events</button>
        </div>
        <div className="events-grid" style={{ background: events.length > 0 ? "rgba(15,17,23,.1)" : "none" }}>
          {events.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem 2rem", color: "#aaa" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📅</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--ink)", marginBottom: ".5rem" }}>No Events Added Yet</div>
              <p style={{ fontSize: ".88rem", fontWeight: 300 }}>Events will appear here after the admin creates them.</p>
            </div>
          ) : events.slice(0, 3).map((ev, i) => (
            <button key={ev.id} className="event-card" onClick={() => onOpenEvent(i)}>
              <div className="event-date">{ev.date.toUpperCase()}</div>
              <div className="event-name">{ev.name}</div>
              <div className="event-venue">📍 {ev.venue}</div>
              <div className="event-meta"><span>🕗 {fmt(ev.startTime)} – {fmt(ev.endTime)}</span><span>👥 {ev.slots} slots open</span></div>
            </button>
          ))}
        </div>
      </section>

      <div className="cta-section">
        <div>
          <div className="cta-title">Ready to make an <em>impact?</em></div>
          <p className="cta-text">Join hundreds of volunteers already making a difference in their communities. Sign up today — it's free and takes less than 2 minutes.</p>
        </div>
        <div className="cta-btns">
          <button className="btn-primary" onClick={() => onNav("register")}><span>Join as Volunteer →</span></button>
          <button className="btn-outline-gold" onClick={() => onNav("login")}>Sign In</button>
        </div>
      </div>

      <footer>
        <div className="footer-logo">Volunteer<span>Hub</span></div>
        <div className="footer-links">
          <button onClick={() => onNav("home")}>Home</button>
          <button onClick={() => onNav("login")}>Login</button>
          <button onClick={() => onNav("register")}>Register</button>
          <button onClick={() => onNav("requireAdmin")}>Admin Panel</button>
        </div>
        <div className="footer-text">© 2025 VolunteerHub. All rights reserved.</div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════ */
function LoginPage({ onNav, onLogin }) {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);

  const hints = { admin: "admin@hub.com / admin123", volunteer: "vol@hub.com / vol123" };

  function handleLogin() {
    setErr("");
    if (!email || !pass) { setErr("⚠ Please enter both email and password."); return; }
    if (role === "admin" && email === "admin@hub.com" && pass === "admin123") { onLogin("admin"); return; }
    if (role === "volunteer" && email === "vol@hub.com" && pass === "vol123") { onLogin("volunteer"); return; }
    setErr("⚠ Invalid credentials. Please check your email and password.");
  }

  return (
    <div className="login-page">
      <div className="left-panel">
        <button className="brand-back" onClick={() => onNav("home")}>
          <div className="back-arrow">←</div>
          <div className="brand">Volunteer<span>Hub</span></div>
        </button>
        <div className="panel-middle">
          <div className="panel-quote">Serve with <em>purpose,</em> lead with heart.</div>
          <p className="panel-desc">Every great volunteer journey begins with a single sign-in. Welcome back.</p>
          <div className="deco-grid">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="deco-cell" />)}</div>
          <div className="redirect-info"><p>Admin login → <strong>Admin Panel</strong><br />Volunteer login → <strong>Home Dashboard</strong></p></div>
        </div>
        <div className="panel-footer">© 2025 VolunteerHub · Secure Login</div>
      </div>
      <div className="right-panel">
        <div className="login-box">
          <div className="login-heading">Welcome back</div>
          <div className="login-sub">New here? <button onClick={() => onNav("register")}>Create an account →</button></div>
          <div className="role-toggle">
            <button className={`role-btn${role === "admin" ? " active" : ""}`} onClick={() => { setRole("admin"); setErr(""); }}>🛡 Admin</button>
            <button className={`role-btn${role === "volunteer" ? " active" : ""}`} onClick={() => { setRole("volunteer"); setErr(""); }}>🙋 Volunteer</button>
          </div>
          <div className="cred-hint"><strong>Demo:</strong> {hints[role]}</div>
          {err && <div className="error-msg">{err}</div>}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrap">
              <span className="icon">✉</span>
              <input className="text-input" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <span className="icon">🔒</span>
              <input className="text-input" type="password" placeholder="Your password" value={pass} onChange={e => { setPass(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
          </div>
          <div className="form-footer-link"><button onClick={() => setForgotOpen(true)}>Forgot password?</button></div>
          <button className="btn-login" onClick={handleLogin}><span>Sign In →</span></button>
          <div className="divider">or quick access</div>
          <div className="quick-links">
            <button className="quick-link" onClick={() => onNav("register")}>Register</button>
            <button className="quick-link" onClick={() => onNav("all-events")}>Events</button>
            <button className="quick-link" onClick={() => onNav("home")}>Home</button>
          </div>
          <div className="register-link">Don't have an account? <button onClick={() => onNav("register")}>Register now</button></div>
        </div>
      </div>
      {forgotOpen && <ForgotPasswordModal onClose={() => setForgotOpen(false)} />}
    </div>
  );
}

function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [p1, setP1] = useState(""); const [p2, setP2] = useState("");
  const [p1Err, setP1Err] = useState(""); const [p2Err, setP2Err] = useState("");

  function handleSubmit() {
    if (!email || !email.includes("@") || !email.includes(".")) { setEmailErr("Please enter a valid email address."); return; }
    setEmailErr(""); setStep(2);
  }
  function handleReset() {
    setP1Err(""); setP2Err("");
    if (p1.length < 8) { setP1Err("Password must be at least 8 characters."); return; }
    if (p1 !== p2) { setP2Err("Passwords do not match."); return; }
    setStep(4);
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="forgot-modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        {step === 1 && <>
          <span className="modal-tag">Account Recovery</span>
          <div className="modal-title">Forgot Password?</div>
          <div className="form-group">
            <label className="form-label">Your Email Address</label>
            <div className="input-wrap"><span className="icon">✉</span>
              <input className="text-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            {emailErr && <span style={{ fontSize: ".75rem", color: "var(--error)" }}>⚠ {emailErr}</span>}
          </div>
          <button className="modal-submit" onClick={handleSubmit}><span>Send Reset Link →</span></button>
        </>}
        {step === 2 && <>
          <span className="modal-tag">Check Your Inbox</span>
          <div className="modal-title">Email Sent!</div>
          <p style={{ fontSize: ".9rem", color: "#666", marginBottom: "1.5rem" }}>A reset link has been sent to <strong>{email}</strong>. Click it to set a new password.</p>
          <button className="modal-submit" onClick={() => setStep(3)}><span>Enter New Password →</span></button>
        </>}
        {step === 3 && <>
          <span className="modal-tag">New Password</span>
          <div className="modal-title">Reset Password</div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="input-wrap"><span className="icon">🔒</span>
              <input className="text-input" type="password" placeholder="New password" value={p1} onChange={e => setP1(e.target.value)} />
            </div>
            {p1Err && <span style={{ fontSize: ".75rem", color: "var(--error)" }}>⚠ {p1Err}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrap"><span className="icon">🔒</span>
              <input className="text-input" type="password" placeholder="Repeat password" value={p2} onChange={e => setP2(e.target.value)} />
            </div>
            {p2Err && <span style={{ fontSize: ".75rem", color: "var(--error)" }}>⚠ {p2Err}</span>}
          </div>
          <button className="modal-submit" onClick={handleReset}><span>Reset Password →</span></button>
        </>}
        {step === 4 && <>
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "1.2rem" }}>✅</span>
            <span className="modal-tag">Password Updated</span>
            <div className="modal-title">All Done!</div>
            <p style={{ fontSize: ".9rem", color: "#666", marginBottom: "1.8rem" }}>Your password has been reset successfully.</p>
            <button className="modal-submit" onClick={onClose}><span>← Back to Login</span></button>
          </div>
        </>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   REGISTER PAGE
═══════════════════════════════════════════════ */
function RegisterPage({ onNav, onRegister, showToast }) {
  const [regRole, setRegRole] = useState("volunteer");
  const [vStep, setVStep] = useState(1);
  const [aStep, setAStep] = useState(1);
  const [volDone, setVolDone] = useState(false);
  const [adminDone, setAdminDone] = useState(false);

  // Volunteer fields
  const [vName,setVName]=useState(""); const [vPhone,setVPhone]=useState(""); const [vEmail,setVEmail]=useState("");
  const [vDob,setVDob]=useState(""); const [vCity,setVCity]=useState(""); const [vBio,setVBio]=useState("");
  const [vSkills,setVSkills]=useState([]); const [vDays,setVDays]=useState([]);
  const [vTimeS,setVTimeS]=useState("09:00"); const [vTimeE,setVTimeE]=useState("17:00");
  const [vEmailC,setVEmailC]=useState(""); const [vPass,setVPass]=useState(""); const [vPass2,setVPass2]=useState("");
  const [vTerms,setVTerms]=useState(false);
  const [vErrs,setVErrs]=useState({});

  // Admin fields
  const [aName,setAName]=useState(""); const [aPhone,setAPhone]=useState(""); const [aEmail,setAEmail]=useState("");
  const [aDesig,setADesig]=useState(""); const [aDob,setADob]=useState(""); const [aBio,setABio]=useState("");
  const [aOrg,setAOrg]=useState(""); const [aOrgType,setAOrgType]=useState(""); const [aCity,setACity]=useState("");
  const [aWebsite,setAWebsite]=useState(""); const [aCode,setACode]=useState("");
  const [aEmailC,setAEmailC]=useState(""); const [aPass,setAPass]=useState(""); const [aPass2,setAPass2]=useState("");
  const [aTerms,setATerms]=useState(false);
  const [aErrs,setAErrs]=useState({});

  function toggleSkill(s) { setVSkills(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]); }
  function toggleDay(d) { setVDays(p => p.includes(d) ? p.filter(x=>x!==d) : [...p,d]); }

  function strengthCalc(val) {
    let s = 0;
    if (val.length >= 8) s++; if (/[A-Z]/.test(val)) s++; if (/[0-9]/.test(val)) s++; if (/[^A-Za-z0-9]/.test(val)) s++;
    const L = [{w:"0%",c:"#e74c3c",t:"Too short"},{w:"25%",c:"#e67e22",t:"Weak"},{w:"50%",c:"#f1c40f",t:"Fair"},{w:"75%",c:"#3498db",t:"Good"},{w:"100%",c:"#27ae60",t:"Strong ✓"}];
    return L[s];
  }
  const str = strengthCalc(vPass); const aStr = strengthCalc(aPass);

  function goVStep(n) {
    if (n === 2) { const e = {}; if (!vName) e.name = true; if (!vPhone) e.phone = true; if (!vEmail || !vEmail.includes("@")) e.email = true; setVErrs(e); if (Object.keys(e).length) return; }
    if (n === 3) { if (vSkills.length === 0) { setVErrs({skills:true}); return; } setVEmailC(vEmail); }
    setVStep(n); setVErrs({});
  }
  function submitVol() {
    const e = {};
    if (vEmailC !== vEmail) e.emailC = true;
    if (vPass.length < 8) e.pass = true;
    if (vPass !== vPass2) e.pass2 = true;
    if (!vTerms) e.terms = true;
    setVErrs(e); if (Object.keys(e).length) return;
    onRegister("volunteer", { name: vName, email: vEmail, phone: vPhone, skills: vSkills, timeStart: vTimeS, timeEnd: vTimeE });
    setVolDone(true);
  }
  function goAStep(n) {
    if (n === 2) { const e = {}; if (!aName) e.name=true; if (!aPhone) e.phone=true; if (!aEmail||!aEmail.includes("@")) e.email=true; if (!aDesig) e.desig=true; setAErrs(e); if (Object.keys(e).length) return; }
    if (n === 3) { const e = {}; if (!aOrg) e.org=true; if (!aOrgType) e.orgType=true; if (!aCity) e.city=true; if (aCode !== "ADMHUB2025") e.code=true; setAErrs(e); if (Object.keys(e).length) return; setAEmailC(aEmail); }
    setAStep(n); setAErrs({});
  }
  function submitAdmin() {
    const e = {};
    if (aEmailC !== aEmail) e.emailC = true;
    if (aPass.length < 8) e.pass = true;
    if (aPass !== aPass2) e.pass2 = true;
    if (!aTerms) e.terms = true;
    setAErrs(e); if (Object.keys(e).length) return;
    setAdminDone(true);
  }

  const StepIndicator = ({ current, total, steps }) => (
    <div className="steps">
      {steps.map((label, i) => {
        const n = i + 1;
        const cls = n < current ? "step done" : n === current ? "step active" : "step";
        return [
          <div key={n} className={cls}><div className="step-num">{n < current ? "✓" : n}</div><span>{label}</span></div>,
          i < steps.length - 1 && <div key={`line-${n}`} className="step-line" />
        ];
      })}
    </div>
  );

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <div className="topbar">
        <button className="brand" onClick={() => onNav("home")}>Volunteer<span>Hub</span></button>
        <div className="topbar-right">
          <button className="topbar-link" onClick={() => onNav("login")}>Already registered? Sign in →</button>
          <button className="topbar-admin" onClick={() => onNav("requireAdmin")}>⚙ Admin Panel</button>
        </div>
      </div>
      <div className="page-wrap">
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2.5rem" }}>
          <span style={{ fontSize: ".85rem", fontWeight: 500, color: "#666" }}>Register as</span>
          <div className="role-toggle" style={{ width: 300 }}>
            <button className={`role-btn${regRole==="volunteer"?" active":""}`} onClick={() => setRegRole("volunteer")}>🙋 Volunteer</button>
            <button className={`role-btn${regRole==="admin"?" active":""}`} onClick={() => setRegRole("admin")}>🛡 Admin / Coordinator</button>
          </div>
        </div>

        {/* VOLUNTEER FORM */}
        {regRole === "volunteer" && !volDone && (
          <div>
            <StepIndicator current={vStep} total={3} steps={["Personal Info","Skills & Availability","Account Setup"]} />
            <div className="form-card">
              {vStep === 1 && <>
                <div className="section-label">Step 1 of 3</div>
                <div className="section-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:900,marginBottom:"1.5rem"}}>Personal Information</div>
                <div className="two-col">
                  <div><label className="reg-label">Full Name <span className="req">*</span></label><div className="input-wrap"><span className="icon">👤</span><input className="reg-input" type="text" placeholder="John Doe" value={vName} onChange={e=>setVName(e.target.value)}/></div>{vErrs.name&&<span className="field-error">Please enter your full name.</span>}</div>
                  <div><label className="reg-label">Phone Number <span className="req">*</span></label><div className="input-wrap"><span className="icon">📞</span><input className="reg-input" type="tel" placeholder="+91 555 000 0000" value={vPhone} onChange={e=>setVPhone(e.target.value)}/></div>{vErrs.phone&&<span className="field-error">Please enter a valid phone number.</span>}</div>
                  <div className="full"><label className="reg-label">Email Address <span className="req">*</span></label><div className="input-wrap"><span className="icon">✉</span><input className="reg-input" type="email" placeholder="you@example.com" value={vEmail} onChange={e=>setVEmail(e.target.value)}/></div>{vErrs.email&&<span className="field-error">Please enter a valid email address.</span>}</div>
                  <div><label className="reg-label">Date of Birth</label><div className="input-wrap"><span className="icon">📅</span><input className="reg-input" type="date" value={vDob} onChange={e=>setVDob(e.target.value)}/></div></div>
                  <div><label className="reg-label">City / Location</label><div className="input-wrap"><span className="icon">📍</span><input className="reg-input" type="text" placeholder="Your city" value={vCity} onChange={e=>setVCity(e.target.value)}/></div></div>
                  <div className="full"><label className="reg-label">Brief Bio / Motivation</label><textarea className="reg-textarea" placeholder="Tell us why you want to volunteer..." value={vBio} onChange={e=>setVBio(e.target.value)}/></div>
                </div>
                <div className="form-actions"><button className="btn-cancel" onClick={() => onNav("home")}>← Home</button><button className="btn-submit" onClick={() => goVStep(2)}><span>Next: Skills & Availability →</span></button></div>
              </>}
              {vStep === 2 && <>
                <div className="section-label">Step 2 of 3</div>
                <div className="section-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:900,marginBottom:"1.5rem"}}>Skills & Availability</div>
                <div style={{marginBottom:"1.8rem"}}>
                  <label className="reg-label">Select your Skills <span className="req">*</span></label>
                  <div className="skills-grid">{SKILLS.map(s=><button key={s} className={`skill-chip${vSkills.includes(s)?" selected":""}`} onClick={()=>toggleSkill(s)}>{s}</button>)}</div>
                  {vErrs.skills && <span className="field-error">Please select at least one skill.</span>}
                </div>
                <hr className="form-divider"/>
                <div style={{marginBottom:"1.8rem"}}>
                  <label className="reg-label">Days Available</label>
                  <div className="avail-grid">{DAYS.map(d=><button key={d} className={`day-chip${vDays.includes(d)?" selected":""}`} onClick={()=>toggleDay(d)}>{d}</button>)}</div>
                </div>
                <div className="two-col">
                  <div><label className="reg-label">Available From</label><div className="input-wrap"><span className="icon">🕗</span><input className="reg-input" type="time" value={vTimeS} onChange={e=>setVTimeS(e.target.value)}/></div></div>
                  <div><label className="reg-label">Available Until</label><div className="input-wrap"><span className="icon">🕗</span><input className="reg-input" type="time" value={vTimeE} onChange={e=>setVTimeE(e.target.value)}/></div></div>
                </div>
                <div className="form-actions"><button className="btn-cancel" onClick={()=>setVStep(1)}>← Back</button><button className="btn-submit" onClick={()=>goVStep(3)}><span>Next: Account Setup →</span></button></div>
              </>}
              {vStep === 3 && <>
                <div className="section-label">Step 3 of 3</div>
                <div className="section-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:900,marginBottom:"1.5rem"}}>Create Account</div>
                <div className="two-col">
                  <div className="full"><label className="reg-label">Confirm Email <span className="req">*</span></label><div className="input-wrap"><span className="icon">✉</span><input className="reg-input" type="email" placeholder="Confirm email" value={vEmailC} onChange={e=>setVEmailC(e.target.value)}/></div>{vErrs.emailC&&<span className="field-error">Email does not match.</span>}</div>
                  <div><label className="reg-label">Password <span className="req">*</span></label><div className="input-wrap"><span className="icon">🔒</span><input className="reg-input" type="password" placeholder="Create a password" value={vPass} onChange={e=>setVPass(e.target.value)}/></div><div className="strength-bar"><div className="strength-fill" style={{width:str.w,background:str.c}}/></div><div className="strength-text" style={{color:str.c}}>{str.t}</div>{vErrs.pass&&<span className="field-error">Password must be at least 8 characters.</span>}</div>
                  <div><label className="reg-label">Confirm Password <span className="req">*</span></label><div className="input-wrap"><span className="icon">🔒</span><input className="reg-input" type="password" placeholder="Repeat password" value={vPass2} onChange={e=>setVPass2(e.target.value)}/></div>{vErrs.pass2&&<span className="field-error">Passwords do not match.</span>}</div>
                </div>
                <hr className="form-divider"/>
                <label className="terms-label"><input type="checkbox" checked={vTerms} onChange={e=>setVTerms(e.target.checked)} style={{width:16,height:16,accentColor:"var(--ink)"}}/> I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
                {vErrs.terms&&<span className="field-error">You must agree to the terms.</span>}
                <div className="form-actions"><button className="btn-cancel" onClick={()=>setVStep(2)}>← Back</button><button className="btn-submit" onClick={submitVol}><span>Complete Registration →</span></button></div>
              </>}
            </div>
          </div>
        )}
        {regRole === "volunteer" && volDone && (
          <div className="form-card"><div className="success-box">
            <span className="success-icon">🎉</span>
            <div className="success-title">You're Registered!</div>
            <p className="success-text">Welcome to VolunteerHub! Your volunteer account has been created.</p>
            <div className="success-actions"><button className="btn-submit" onClick={() => onNav("login")}><span>Go to Login →</span></button><button className="btn-cancel" onClick={() => onNav("home")}>← Home</button></div>
          </div></div>
        )}

        {/* ADMIN FORM */}
        {regRole === "admin" && !adminDone && (
          <div>
            <StepIndicator current={aStep} total={3} steps={["Admin Info","Organisation","Account Setup"]} />
            <div className="form-card admin-stripe">
              <div className="admin-badge">🛡 Admin / Coordinator Registration</div>
              {aStep === 1 && <>
                <div className="section-label">Step 1 of 3</div>
                <div className="section-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:900,marginBottom:"1.5rem"}}>Admin Information</div>
                <div className="two-col">
                  <div><label className="reg-label">Full Name <span className="req">*</span></label><div className="input-wrap"><span className="icon">👤</span><input className="reg-input" type="text" placeholder="Jane Smith" value={aName} onChange={e=>setAName(e.target.value)}/></div>{aErrs.name&&<span className="field-error">Please enter your full name.</span>}</div>
                  <div><label className="reg-label">Phone Number <span className="req">*</span></label><div className="input-wrap"><span className="icon">📞</span><input className="reg-input" type="tel" placeholder="+91 555 000 0000" value={aPhone} onChange={e=>setAPhone(e.target.value)}/></div>{aErrs.phone&&<span className="field-error">Please enter a valid phone number.</span>}</div>
                  <div className="full"><label className="reg-label">Official Email <span className="req">*</span></label><div className="input-wrap"><span className="icon">✉</span><input className="reg-input" type="email" placeholder="admin@org.com" value={aEmail} onChange={e=>setAEmail(e.target.value)}/></div>{aErrs.email&&<span className="field-error">Please enter a valid email address.</span>}</div>
                  <div><label className="reg-label">Designation <span className="req">*</span></label><div className="input-wrap"><span className="icon">🏷</span><input className="reg-input" type="text" placeholder="e.g. Event Coordinator" value={aDesig} onChange={e=>setADesig(e.target.value)}/></div>{aErrs.desig&&<span className="field-error">Please enter your designation.</span>}</div>
                  <div><label className="reg-label">Date of Birth</label><div className="input-wrap"><span className="icon">📅</span><input className="reg-input" type="date" value={aDob} onChange={e=>setADob(e.target.value)}/></div></div>
                  <div className="full"><label className="reg-label">Brief Introduction</label><textarea className="reg-textarea" placeholder="Tell us about your role..." value={aBio} onChange={e=>setABio(e.target.value)}/></div>
                </div>
                <div className="form-actions"><button className="btn-cancel" onClick={() => onNav("home")}>← Home</button><button className="btn-submit" onClick={() => goAStep(2)}><span>Next: Organisation →</span></button></div>
              </>}
              {aStep === 2 && <>
                <div className="section-label">Step 2 of 3</div>
                <div className="section-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:900,marginBottom:"1.5rem"}}>Organisation Details</div>
                <div className="two-col">
                  <div className="full"><label className="reg-label">Organisation Name <span className="req">*</span></label><div className="input-wrap"><span className="icon">🏢</span><input className="reg-input" type="text" placeholder="e.g. City Volunteer Network" value={aOrg} onChange={e=>setAOrg(e.target.value)}/></div>{aErrs.org&&<span className="field-error">Please enter your organisation name.</span>}</div>
                  <div><label className="reg-label">Organisation Type <span className="req">*</span></label><select className="reg-select" value={aOrgType} onChange={e=>setAOrgType(e.target.value)}><option value="">— Select —</option><option>NGO / Non-Profit</option><option>Government Body</option><option>Educational Institution</option><option>Corporate CSR</option><option>Community Group</option><option>Other</option></select>{aErrs.orgType&&<span className="field-error">Please select organisation type.</span>}</div>
                  <div><label className="reg-label">City <span className="req">*</span></label><div className="input-wrap"><span className="icon">📍</span><input className="reg-input" type="text" placeholder="Your city" value={aCity} onChange={e=>setACity(e.target.value)}/></div>{aErrs.city&&<span className="field-error">Please enter your city.</span>}</div>
                  <div className="full"><label className="reg-label">Website / Social Link</label><div className="input-wrap"><span className="icon">🌐</span><input className="reg-input" type="text" placeholder="https://yourorg.com" value={aWebsite} onChange={e=>setAWebsite(e.target.value)}/></div></div>
                  <div className="full"><label className="reg-label">Admin Access Code <span className="req">*</span></label><div className="input-wrap"><span className="icon">🔑</span><input className="reg-input" type="password" placeholder="Enter the admin access code" value={aCode} onChange={e=>setACode(e.target.value)}/></div>{aErrs.code&&<span className="field-error">Invalid access code.</span>}<div style={{fontSize:".75rem",color:"#888",marginTop:".4rem"}}>Demo code: <strong>ADMHUB2025</strong></div></div>
                </div>
                <div className="form-actions"><button className="btn-cancel" onClick={()=>setAStep(1)}>← Back</button><button className="btn-submit" onClick={() => goAStep(3)}><span>Next: Account Setup →</span></button></div>
              </>}
              {aStep === 3 && <>
                <div className="section-label">Step 3 of 3</div>
                <div className="section-title" style={{fontFamily:"'Playfair Display',serif",fontSize:"1.4rem",fontWeight:900,marginBottom:"1.5rem"}}>Create Admin Account</div>
                <div className="two-col">
                  <div className="full"><label className="reg-label">Email Address <span className="req">*</span></label><div className="input-wrap"><span className="icon">✉</span><input className="reg-input" type="email" placeholder="Confirm your email" value={aEmailC} onChange={e=>setAEmailC(e.target.value)}/></div>{aErrs.emailC&&<span className="field-error">Email does not match.</span>}</div>
                  <div><label className="reg-label">Password <span className="req">*</span></label><div className="input-wrap"><span className="icon">🔒</span><input className="reg-input" type="password" placeholder="Create a strong password" value={aPass} onChange={e=>setAPass(e.target.value)}/></div><div className="strength-bar"><div className="strength-fill" style={{width:aStr.w,background:aStr.c}}/></div><div className="strength-text" style={{color:aStr.c}}>{aStr.t}</div>{aErrs.pass&&<span className="field-error">Password must be at least 8 characters.</span>}</div>
                  <div><label className="reg-label">Confirm Password <span className="req">*</span></label><div className="input-wrap"><span className="icon">🔒</span><input className="reg-input" type="password" placeholder="Repeat password" value={aPass2} onChange={e=>setAPass2(e.target.value)}/></div>{aErrs.pass2&&<span className="field-error">Passwords do not match.</span>}</div>
                </div>
                <hr className="form-divider"/>
                <label className="terms-label"><input type="checkbox" checked={aTerms} onChange={e=>setATerms(e.target.checked)} style={{width:16,height:16,accentColor:"var(--ink)"}}/> I agree to the <a href="#">Terms of Service</a>, <a href="#">Privacy Policy</a> and <a href="#">Admin Code of Conduct</a></label>
                {aErrs.terms&&<span className="field-error">You must agree to the terms.</span>}
                <div className="form-actions"><button className="btn-cancel" onClick={()=>setAStep(2)}>← Back</button><button className="btn-submit" onClick={submitAdmin}><span>Complete Admin Registration →</span></button></div>
              </>}
            </div>
          </div>
        )}
        {regRole === "admin" && adminDone && (
          <div className="form-card admin-stripe"><div className="success-box">
            <span className="success-icon">🛡</span>
            <div className="success-title">Admin Account Created!</div>
            <p className="success-text">Your admin account has been registered. You can now log in to access the Admin Panel.</p>
            <div className="success-actions"><button className="btn-submit" onClick={() => onNav("login")}><span>Go to Login →</span></button><button className="btn-cancel" onClick={() => onNav("home")}>← Home</button></div>
          </div></div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FEEDBACK MODAL
═══════════════════════════════════════════════ */
function FeedbackModal({ sessionRole, volunteers, events, onClose, onSubmit }) {
  const [vol, setVol] = useState(""); const [ev, setEv] = useState(""); const [stars, setStars] = useState(0); const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const allowed = sessionRole === "admin" || sessionRole === "coordinator";

  function handleSubmit() {
    if (!vol) { return; } if (!stars) { return; }
    onSubmit({ volId: parseInt(vol), eventId: ev !== "" ? parseInt(ev) : null, stars, comment: comment || "No comment provided." });
    setDone(true);
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✕</button>
        {done ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>✅</span>
            <span className="modal-tag">Submitted</span>
            <div className="modal-title">Feedback Sent!</div>
            <p style={{ fontSize: ".9rem", color: "#555" }}>Your feedback has been recorded successfully.</p>
          </div>
        ) : !allowed ? (
          <div className="access-denied">
            <span className="deny-icon">🔒</span>
            <span className="modal-tag">Restricted Access</span>
            <div className="modal-title">Access Denied</div>
            <p>The <strong>Feedback</strong> feature is only available to <strong>Admins</strong>.<br /><br />Please log in as Admin to submit feedback.</p>
          </div>
        ) : (
          <>
            <span className="modal-tag">Coordinator / Admin Only</span>
            <div className="modal-title">Submit Feedback</div>
            <div className="modal-form-group"><label>Select Event</label><select value={ev} onChange={e=>setEv(e.target.value)}><option value="">— Choose an event —</option>{events.map((e,i)=><option key={i} value={i}>{e.name} ({e.date})</option>)}</select></div>
            <div className="modal-form-group"><label>Select Volunteer</label><select value={vol} onChange={e=>setVol(e.target.value)}><option value="">— Choose a volunteer —</option>{volunteers.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
            <div className="modal-form-group"><label>Rating</label>
              <div className="star-rating">
                {[5,4,3,2,1].map(s => <><input key={s} type="radio" id={`s${s}`} name="rating" checked={stars===s} onChange={()=>setStars(s)}/><label key={`l${s}`} htmlFor={`s${s}`}>★</label></>)}
              </div>
            </div>
            <div className="modal-form-group"><label>Feedback Comments</label><textarea placeholder="Write your feedback..." value={comment} onChange={e=>setComment(e.target.value)}/></div>
            <button className="modal-submit" onClick={handleSubmit}><span>Submit Feedback</span></button>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ALL EVENTS PAGE
═══════════════════════════════════════════════ */
function AllEventsPage({ events, onNav, onOpenEvent, onToggleNotif, unreadCount }) {
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <div className="all-events-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem", fontWeight: 900, color: "var(--cream)" }}>Volunteer<span style={{ color: "var(--gold)" }}>Hub</span></div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="notif-btn" onClick={onToggleNotif}>🔔 {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}</button>
            <button className="back-btn" style={{ color: "var(--cream)", borderColor: "rgba(245,240,232,.3)" }} onClick={() => onNav("home")}>← Home</button>
          </div>
        </div>
        <span className="section-tag" style={{ color: "var(--gold)" }}>All Events</span>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "var(--cream)", marginTop: ".5rem" }}>Upcoming Events<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>Open for Volunteers</em></h1>
        <p style={{ color: "rgba(245,240,232,.6)", marginTop: ".8rem", fontSize: ".95rem", fontWeight: 300 }}>Find your next opportunity to make a difference.</p>
      </div>
      <div className="all-events-grid">
        {events.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "5rem 2rem", color: "rgba(245,240,232,.5)", background: "var(--ink)", margin: "0", borderRadius: 0 }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--cream)", marginBottom: ".5rem" }}>No Events Yet</div>
            <p style={{ fontSize: ".9rem" }}>Events will appear here once an admin creates them.</p>
          </div>
        ) : events.map((ev, i) => (
          <div key={ev.id} className="all-event-card" onClick={() => onOpenEvent(i, "all-events")}>
            <div className="aec-top"><div className="event-date">{ev.date}</div><div className="event-name">{ev.name}</div></div>
            <div className="aec-body">
              <div className="aec-row">📍 {ev.venue}</div>
              <div className="aec-row">🕗 {fmt(ev.startTime)} – {fmt(ev.endTime)}</div>
              <div className="aec-row">📁 {ev.category}</div>
              <div className="aec-desc">{ev.desc}</div>
              <div className="aec-slots">👥 {ev.slots} slots open</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   EVENT DETAIL PAGE
═══════════════════════════════════════════════ */
function EventDetailPage({ eventIdx, events, assignments, volunteers, onNav, fromPage, onToggleNotif, unreadCount }) {
  const ev = events[eventIdx];
  if (!ev) return null;
  const evAssign = assignments.filter(a => a.eventId === eventIdx);
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <InnerNav onNav={onNav} onToggleNotif={onToggleNotif} unreadCount={unreadCount} backTo={fromPage === "all-events" ? "all-events" : "home"} backLabel="← Back" />
      <div className="event-detail-hero">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="event-date">{ev.date.toUpperCase()} · {ev.category}</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "var(--cream)", margin: ".5rem 0 1rem" }}>{ev.name}</h1>
          <div className="event-detail-meta">
            <div className="event-detail-meta-item">📍 {ev.venue}</div>
            <div className="event-detail-meta-item">🕗 {fmt(ev.startTime)} – {fmt(ev.endTime)}</div>
            <div className="event-detail-meta-item">👥 {ev.slots} slots available</div>
          </div>
        </div>
      </div>
      <div className="event-detail-body">
        <div className="event-info-grid">
          <div className="event-info-card"><div className="info-label">Date</div><div className="info-val">{ev.date}</div></div>
          <div className="event-info-card"><div className="info-label">Venue</div><div className="info-val">{ev.venue}</div></div>
          <div className="event-info-card"><div className="info-label">Time</div><div className="info-val">{fmt(ev.startTime)} – {fmt(ev.endTime)}</div><div className="info-sub">Duration: {calcDuration(ev.startTime, ev.endTime)}</div></div>
          <div className="event-info-card"><div className="info-label">Category</div><div className="info-val">{ev.category}</div><div className="info-sub">{ev.slots} volunteer slots open</div></div>
          <div className="event-info-card" style={{ gridColumn: "1/-1" }}><div className="info-label">About This Event</div><div className="info-val" style={{ fontSize: ".95rem", fontWeight: 400, lineHeight: 1.7, color: "#555" }}>{ev.desc}</div></div>
        </div>
        <div className="vol-list-in-event">
          <h3>Assigned Volunteers ({evAssign.length})</h3>
          {evAssign.length > 0 ? evAssign.map(a => { const v = volunteers.find(x => x.id === a.volId); return v ? <span key={a.volId} className="vol-chip">👤 {v.name} <span className="vc-role">{a.role}</span></span> : null; }) : <p style={{ fontSize: ".9rem", color: "#aaa" }}>No volunteers assigned yet.</p>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════════ */
function AdminPanel({ volunteers, setVolunteers, events, setEvents, assignments, setAssignments, attendanceRecords, setAttendanceRecords, feedbackData, setFeedbackData, notifications, setNotifications, onNav, onToggleNotif, unreadCount, showToast, onOpenEvent }) {
  const [section, setSection] = useState("dashboard");
  const [filterVol, setFilterVol] = useState("");
  const [assignEventIdx, setAssignEventIdx] = useState("");
  const [attEventIdx, setAttEventIdx] = useState("");
  const [notifTo, setNotifTo] = useState("all"); const [notifEvent, setNotifEvent] = useState(""); const [notifMsg, setNotifMsg] = useState("");
  const [notifLog, setNotifLog] = useState([]);

  // Event form
  const [evName,setEvName]=useState(""); const [evDate,setEvDate]=useState(""); const [evStart,setEvStart]=useState("09:00");
  const [evEnd,setEvEnd]=useState("17:00"); const [evSlots,setEvSlots]=useState(""); const [evVenue,setEvVenue]=useState("");
  const [evCat,setEvCat]=useState("Community Service"); const [evDesc,setEvDesc]=useState("");

  function addEvent() {
    if (!evName || !evDate || !evVenue) { showToast("⚠ Please fill in required fields."); return; }
    if (toMins(evEnd) <= toMins(evStart)) { showToast("⚠ End time must be after start time."); return; }
    const newEv = { id: Date.now(), name: evName, date: fmtDate(evDate), dateVal: evDate, startTime: evStart, endTime: evEnd, venue: evVenue, slots: parseInt(evSlots) || 10, category: evCat, desc: evDesc || "No description provided." };
    setEvents(prev => [...prev, newEv]);
    setEvName(""); setEvDate(""); setEvVenue(""); setEvSlots(""); setEvDesc("");
    showToast("✅ Event added successfully!");
  }

  function assignVol(volId, eventId, role) {
    if (assignments.find(a => a.volId === volId && a.eventId === eventId)) { showToast("Already assigned."); return; }
    setAssignments(prev => [...prev, { volId, eventId, role, notified: true }]);
    setVolunteers(prev => prev.map(v => v.id === volId && !v.events.includes(eventId) ? { ...v, events: [...v.events, eventId] } : v));
    const v = volunteers.find(x => x.id === volId); const ev = events[eventId];
    setNotifications(prev => [{ id: Date.now(), icon: "📋", title: "New Assignment", body: `${v?.name} assigned to ${ev?.name} as ${role}.`, time: "Just now", unread: true }, ...prev]);
    showToast(`✅ ${v?.name} assigned as ${role} and notified!`);
  }

  function removeAssignment(volId, eventId) {
    setAssignments(prev => prev.filter(a => !(a.volId === volId && a.eventId === eventId)));
    setVolunteers(prev => prev.map(v => v.id === volId ? { ...v, events: v.events.filter(e => e !== eventId) } : v));
    showToast("Volunteer removed from assignment.");
  }

  function markAttendance(volId, eventId, status) {
    setAttendanceRecords(prev => {
      const existing = prev.find(r => r.volId === volId && r.eventId === eventId);
      if (existing) return prev.map(r => r.volId === volId && r.eventId === eventId ? { ...r, status } : r);
      return [...prev, { volId, eventId, status }];
    });
    const v = volunteers.find(x => x.id === volId); const ev = events[eventId];
    setNotifications(prev => [{ id: Date.now(), icon: "✅", title: "Attendance Marked", body: `Attendance for ${ev?.name} marked as "${status}".`, time: "Just now", unread: true }, ...prev]);
    showToast(`✅ Marked as ${status} for ${v?.name}.`);
  }

  function sendNotification() {
    if (!notifMsg) { showToast("Please enter a message."); return; }
    const toName = notifTo === "all" ? "All Volunteers" : volunteers.find(v => v.id == notifTo)?.name || "Unknown";
    const evName = notifEvent !== "" ? events[parseInt(notifEvent)]?.name : null;
    setNotifLog(prev => [{ to: toName, msg: notifMsg, event: evName || "—", time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) }, ...prev]);
    setNotifications(prev => [{ id: Date.now(), icon: "📢", title: "Message from Admin", body: notifMsg + (evName ? ` (${evName})` : ""), time: "Just now", unread: true }, ...prev]);
    setNotifMsg(""); showToast(`📤 Notification sent to ${toName}!`);
  }

  const filteredVols = volunteers.filter(v => v.name.toLowerCase().includes(filterVol.toLowerCase()) || v.email.toLowerCase().includes(filterVol.toLowerCase()));
  const eligibleVols = assignEventIdx !== "" ? (() => { const ev = events[parseInt(assignEventIdx)]; return volunteers.filter(v => toMins(v.timeStart) <= toMins(ev.startTime) && toMins(v.timeEnd) >= toMins(ev.endTime)); })() : [];
  const ineligibleVols = assignEventIdx !== "" ? (() => { const ev = events[parseInt(assignEventIdx)]; return volunteers.filter(v => !(toMins(v.timeStart) <= toMins(ev.startTime) && toMins(v.timeEnd) >= toMins(ev.endTime))); })() : [];

  const [assignRoles, setAssignRoles] = useState({});

  const sidebarItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard", section: "Overview" },
    { id: "volunteers", icon: "👥", label: "All Volunteers", section: "Volunteers" },
    { id: "assign", icon: "📋", label: "Assign to Events", section: "Volunteers" },
    { id: "attendance-admin", icon: "✅", label: "Mark Attendance", section: "Volunteers" },
    { id: "events-admin", icon: "📅", label: "Manage Events", section: "Events" },
    { id: "notifications-admin", icon: "🔔", label: "Send Notifications", section: "Reports" },
    { id: "scheduling", icon: "🗓", label: "Smart Scheduling", section: "Reports", nav: true },
    { id: "attendance", icon: "📈", label: "Attendance Records", section: "Reports", nav: true },
    { id: "performance", icon: "⭐", label: "Performance Reviews", section: "Reports", nav: true },
  ];
  const sections = [...new Set(sidebarItems.map(s => s.section))];

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <InnerNav onNav={onNav} onToggleNotif={onToggleNotif} unreadCount={unreadCount} backTo="home" backLabel="← Home" adminMode />
      <div className="admin-layout">
        <div className="admin-sidebar">
          {sections.map(sec => (
            <div key={sec} className="sidebar-section">
              <div className="sidebar-section-label">{sec}</div>
              {sidebarItems.filter(s => s.section === sec).map(item => (
                <div key={item.id} className={`sidebar-item${section === item.id ? " active" : ""}`}
                  onClick={() => item.nav ? onNav(item.id) : setSection(item.id)}>
                  <span className="si-icon">{item.icon}</span> {item.label}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="admin-content">
          {/* DASHBOARD */}
          {section === "dashboard" && (
            <div>
              <div className="page-hero"><span className="section-tag">Admin Panel</span><h2>Dashboard Overview</h2><p>Welcome, Admin. Here's a summary of VolunteerHub activity.</p></div>
              <div className="stat-grid">
                <div className="stat-card gold"><div className="stat-num">{volunteers.length}</div><div className="stat-label">Registered Volunteers</div></div>
                <div className="stat-card rust"><div className="stat-num">{events.length}</div><div className="stat-label">Active Events</div></div>
                <div className="stat-card sage"><div className="stat-num">{attendanceRecords.length}</div><div className="stat-label">Attendance Records</div></div>
                <div className="stat-card ink"><div className="stat-num">{feedbackData.length}</div><div className="stat-label">Feedback Submitted</div></div>
              </div>
              <div className="data-table-wrap">
                <div className="table-header"><h3>Registered Volunteers</h3></div>
                <table><thead><tr><th>Name</th><th>Email</th><th>Skills</th><th>Working Hours</th><th>Status</th></tr></thead>
                <tbody>{volunteers.slice(0, 5).map(v => <tr key={v.id}><td><strong>{v.name}</strong></td><td>{v.email}</td><td>{v.skills.slice(0,2).join(", ")}</td><td>{fmt(v.timeStart)} – {fmt(v.timeEnd)}</td><td><span className="badge badge-green">Active</span></td></tr>)}</tbody></table>
              </div>
            </div>
          )}

          {/* VOLUNTEERS */}
          {section === "volunteers" && (
            <div>
              <div className="page-hero"><span className="section-tag">Volunteers</span><h2>All Registered Volunteers</h2></div>
              <div className="data-table-wrap">
                <div className="table-header"><h3>Volunteer Registry</h3><input className="table-search" placeholder="🔍 Search volunteers…" value={filterVol} onChange={e=>setFilterVol(e.target.value)}/></div>
                <table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Skills</th><th>Working Hours</th></tr></thead>
                <tbody>{filteredVols.map(v=><tr key={v.id}><td><strong>{v.name}</strong></td><td>{v.email}</td><td>{v.phone}</td><td>{v.skills.join(", ")}</td><td>{fmt(v.timeStart)} – {fmt(v.timeEnd)}</td></tr>)}</tbody></table>
              </div>
            </div>
          )}

          {/* ASSIGN */}
          {section === "assign" && (
            <div>
              <div className="page-hero"><span className="section-tag">Assignment</span><h2>Assign Volunteers to Events</h2><p>Only volunteers whose working hours fully cover the event's time window are shown as eligible.</p></div>
              <div className="admin-form-card">
                <h3>Select Event to Assign</h3>
                <div className="form-row">
                  <div><label>Select Event</label>
                    <select value={assignEventIdx} onChange={e => { setAssignEventIdx(e.target.value); setAssignRoles({}); }}>
                      <option value="">— Choose an event —</option>
                      {events.map((ev, i) => <option key={ev.id} value={i}>{ev.name} ({ev.date})</option>)}
                    </select>
                  </div>
                  {assignEventIdx !== "" && <div style={{ fontSize: ".85rem", color: "#666", paddingTop: "1.5rem", lineHeight: 1.6 }}><strong>{events[parseInt(assignEventIdx)]?.name}</strong><br/>📅 {events[parseInt(assignEventIdx)]?.date}<br/>🕗 {fmt(events[parseInt(assignEventIdx)]?.startTime)} – {fmt(events[parseInt(assignEventIdx)]?.endTime)}</div>}
                </div>
              </div>
              {assignEventIdx !== "" && (
                <div>
                  <div className="section-divider">Eligible Volunteers</div>
                  {eligibleVols.length === 0 ? <p style={{ fontSize: ".9rem", color: "#aaa" }}>No volunteers are eligible for this event time window.</p> : eligibleVols.map(v => {
                    const already = assignments.find(a => a.volId === v.id && a.eventId === parseInt(assignEventIdx));
                    return (
                      <div key={v.id} style={{ background: "var(--white)", border: "1px solid rgba(15,17,23,.08)", padding: "1.2rem 1.5rem", marginBottom: ".6rem", display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: "1rem" }}>
                        <div><strong>{v.name}</strong><div style={{ fontSize: ".8rem", color: "#888", marginTop: ".2rem" }}>🕗 {fmt(v.timeStart)} – {fmt(v.timeEnd)} · {v.skills.slice(0,2).join(", ")}</div></div>
                        {already ? <span className="badge badge-green">✓ Assigned as {already.role}</span> : <>
                          <select value={assignRoles[v.id] || "Team Leader"} onChange={e => setAssignRoles(p => ({ ...p, [v.id]: e.target.value }))} style={{ padding: ".45rem .8rem", border: "1.5px solid rgba(15,17,23,.12)", borderRadius: 2, fontSize: ".82rem", background: "var(--cream)" }}>
                            {["Team Leader","Logistics","Health Support","Educator","Registration Desk","Photographer","Medical Aide","General Volunteer"].map(r => <option key={r}>{r}</option>)}
                          </select>
                          <button className="btn-admin-sm" onClick={() => assignVol(v.id, parseInt(assignEventIdx), assignRoles[v.id] || "Team Leader")}>Assign + Notify</button>
                        </>}
                      </div>
                    );
                  })}
                  {ineligibleVols.length > 0 && <><div className="section-divider" style={{ marginTop: "1rem" }}>Not Available (schedule conflict)</div>
                  {ineligibleVols.map(v => <div key={v.id} style={{ background: "rgba(181,69,27,.03)", border: "1px solid rgba(181,69,27,.12)", padding: ".9rem 1.5rem", marginBottom: ".4rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><strong style={{ color: "#999" }}>{v.name}</strong><div style={{ fontSize: ".78rem", color: "#bbb", marginTop: ".15rem" }}>🕗 {fmt(v.timeStart)} – {fmt(v.timeEnd)}</div></div><span className="avail-tag avail-no">❌ Not Available</span></div>)}</>}
                  {assignments.filter(a => a.eventId === parseInt(assignEventIdx)).length > 0 && (
                    <div style={{ marginTop: "2rem" }}>
                      <div className="section-divider">Currently Assigned</div>
                      <div className="data-table-wrap"><table><thead><tr><th>Volunteer</th><th>Working Hours</th><th>Role</th><th>Notified</th><th>Action</th></tr></thead>
                      <tbody>{assignments.filter(a => a.eventId === parseInt(assignEventIdx)).map(a => { const v = volunteers.find(x => x.id === a.volId); return <tr key={a.volId}><td><strong>{v?.name}</strong></td><td>{v ? `${fmt(v.timeStart)} – ${fmt(v.timeEnd)}` : "—"}</td><td>{a.role}</td><td><span className={`badge ${a.notified ? "badge-green" : "badge-grey"}`}>{a.notified ? "✓ Notified" : "Pending"}</span></td><td><button className="btn-danger-sm" onClick={() => removeAssignment(a.volId, parseInt(assignEventIdx))}>Remove</button></td></tr>; })}</tbody></table></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MARK ATTENDANCE */}
          {section === "attendance-admin" && (
            <div>
              <div className="page-hero"><span className="section-tag">Attendance</span><h2>Mark Volunteer Attendance</h2></div>
              <div className="admin-form-card"><h3>Select Event</h3>
                <div className="form-row"><div><label>Event</label><select value={attEventIdx} onChange={e => setAttEventIdx(e.target.value)}><option value="">— Choose an event —</option>{events.map((ev, i) => <option key={ev.id} value={i}>{ev.name} ({ev.date})</option>)}</select></div></div>
              </div>
              {attEventIdx !== "" && (() => {
                const idx = parseInt(attEventIdx); const evAssign = assignments.filter(a => a.eventId === idx);
                return <div className="data-table-wrap">
                  <div className="table-header"><h3>Mark Attendance – {events[idx]?.name}</h3></div>
                  <table><thead><tr><th>Volunteer</th><th>Working Hours</th><th>Role</th><th>Status</th><th>Mark</th></tr></thead>
                  <tbody>{evAssign.length === 0 ? <tr><td colSpan="5" style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>No volunteers assigned yet.</td></tr> : evAssign.map(a => {
                    const v = volunteers.find(x => x.id === a.volId); const rec = attendanceRecords.find(r => r.volId === a.volId && r.eventId === idx);
                    return <tr key={a.volId}><td><strong>{v?.name}</strong></td><td>{v ? `${fmt(v.timeStart)} – ${fmt(v.timeEnd)}` : "—"}</td><td>{a.role}</td>
                      <td><span className={`badge ${rec ? (rec.status==="present"?"badge-green":rec.status==="absent"?"badge-red":"badge-gold") : "badge-grey"}`}>{rec ? rec.status : "Not Marked"}</span></td>
                      <td><button className="btn-admin-sm" style={{ background: "var(--sage)" }} onClick={() => markAttendance(a.volId, idx, "present")}>Present</button><button className="btn-admin-sm" style={{ background: "var(--gold)", color: "var(--ink)", marginLeft: ".3rem" }} onClick={() => markAttendance(a.volId, idx, "late")}>Late</button><button className="btn-danger-sm" style={{ marginLeft: ".3rem" }} onClick={() => markAttendance(a.volId, idx, "absent")}>Absent</button></td>
                    </tr>;
                  })}</tbody></table>
                </div>;
              })()}
            </div>
          )}

          {/* MANAGE EVENTS */}
          {section === "events-admin" && (
            <div>
              <div className="page-hero"><span className="section-tag">Events</span><h2>Manage Events</h2></div>
              <div className="admin-form-card"><h3>Add New Event</h3>
                <div className="form-row"><div><label>Event Name <span className="req">*</span></label><input type="text" placeholder="e.g. Tree Plantation Drive" value={evName} onChange={e=>setEvName(e.target.value)}/></div><div><label>Date <span className="req">*</span></label><input type="date" value={evDate} onChange={e=>setEvDate(e.target.value)}/></div></div>
                <div className="form-row three"><div><label>Start Time <span className="req">*</span></label><input type="time" value={evStart} onChange={e=>setEvStart(e.target.value)}/></div><div><label>End Time <span className="req">*</span></label><input type="time" value={evEnd} onChange={e=>setEvEnd(e.target.value)}/></div><div><label>Slots Available</label><input type="number" placeholder="20" min="1" value={evSlots} onChange={e=>setEvSlots(e.target.value)}/></div></div>
                <div className="form-row"><div><label>Venue <span className="req">*</span></label><input type="text" placeholder="Location name" value={evVenue} onChange={e=>setEvVenue(e.target.value)}/></div><div><label>Category</label><select value={evCat} onChange={e=>setEvCat(e.target.value)}><option>Community Service</option><option>Education</option><option>Healthcare</option><option>Environment</option><option>Sports</option><option>Cultural</option></select></div></div>
                <div className="form-row full"><div><label>Description</label><textarea placeholder="Brief event description..." value={evDesc} onChange={e=>setEvDesc(e.target.value)}/></div></div>
                <button className="btn-admin" onClick={addEvent}>➕ Add Event</button>
              </div>
              <div className="data-table-wrap">
                <div className="table-header"><h3>All Events</h3></div>
                <table><thead><tr><th>Event</th><th>Date</th><th>Time</th><th>Venue</th><th>Slots</th><th>Assigned</th><th>Action</th></tr></thead>
                <tbody>{events.length === 0 ? <tr><td colSpan="7" style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>No events added yet.</td></tr> : events.map((ev, i) => {
                  const cnt = assignments.filter(a => a.eventId === i).length;
                  return <tr key={ev.id}><td><strong>{ev.name}</strong></td><td>{ev.date}</td><td>{fmt(ev.startTime)} – {fmt(ev.endTime)}</td><td>{ev.venue}</td><td>{ev.slots}</td><td><span className="badge badge-gold">{cnt}</span></td><td><button className="btn-admin-sm" onClick={() => onOpenEvent(i, "admin")}>View</button></td></tr>;
                })}</tbody></table>
              </div>
            </div>
          )}

          {/* SEND NOTIFICATIONS */}
          {section === "notifications-admin" && (
            <div>
              <div className="page-hero"><span className="section-tag">Notifications</span><h2>Send Notifications</h2></div>
              <div className="admin-form-card"><h3>Compose Notification</h3>
                <div className="form-row">
                  <div><label>Send To</label><select value={notifTo} onChange={e=>setNotifTo(e.target.value)}><option value="all">All Volunteers</option>{volunteers.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
                  <div><label>Related Event (Optional)</label><select value={notifEvent} onChange={e=>setNotifEvent(e.target.value)}><option value="">— None —</option>{events.map((ev,i)=><option key={ev.id} value={i}>{ev.name}</option>)}</select></div>
                </div>
                <div className="form-row full"><div><label>Message <span className="req">*</span></label><textarea placeholder="Type your notification message here..." value={notifMsg} onChange={e=>setNotifMsg(e.target.value)}/></div></div>
                <button className="btn-admin" onClick={sendNotification}>📤 Send Notification</button>
              </div>
              <div className="data-table-wrap" style={{ marginTop: "2rem" }}>
                <div className="table-header"><h3>Sent Notifications Log</h3></div>
                <table><thead><tr><th>To</th><th>Message</th><th>Event</th><th>Time</th></tr></thead>
                <tbody>{notifLog.length === 0 ? <tr><td colSpan="4" style={{ textAlign: "center", color: "#aaa", padding: "1.5rem" }}>No notifications sent yet.</td></tr> : notifLog.map((n, i) => <tr key={i}><td>{n.to}</td><td>{n.msg}</td><td>{n.event}</td><td>{n.time}</td></tr>)}</tbody></table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SCHEDULING / ATTENDANCE / PERFORMANCE PAGES
═══════════════════════════════════════════════ */
function SchedulingPage({ events, assignments, volunteers, onNav, onToggleNotif, unreadCount }) {
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <InnerNav onNav={onNav} onToggleNotif={onToggleNotif} unreadCount={unreadCount} backTo="admin" backLabel="← Admin Panel" />
      <div className="inner-page-wrap">
        <div className="page-hero"><span className="section-tag">Smart Scheduling</span><h2>Volunteer Assignments by Event</h2></div>
        {events.length === 0 ? <p style={{ color: "#aaa" }}>No events created yet.</p> : events.map((ev, evIdx) => {
          const evAssign = assignments.filter(a => a.eventId === evIdx);
          return <div key={ev.id} className="sched-event-card">
            <div className="sched-event-head"><div><div className="ev-name">{ev.name}</div><div className="ev-meta">📍 {ev.venue} · 🕗 {fmt(ev.startTime)} – {fmt(ev.endTime)} · 📅 {ev.date}</div></div><span className="badge badge-gold">{evAssign.length} assigned</span></div>
            <div className="sched-vol-grid">{evAssign.length > 0 ? evAssign.map(a => { const v = volunteers.find(x => x.id === a.volId); return v ? <div key={a.volId} className="sched-vol-card"><div className="svc-name">👤 {v.name}</div><div className="svc-role">🏷 {a.role}</div><div style={{ fontSize: ".78rem", color: "#777" }}>🕗 {fmt(v.timeStart)} – {fmt(v.timeEnd)}</div></div> : null; }) : <p style={{ fontSize: ".88rem", color: "#aaa", padding: "1rem" }}>No volunteers assigned yet.</p>}</div>
          </div>;
        })}
      </div>
    </div>
  );
}

function AttendancePage({ events, assignments, volunteers, attendanceRecords, onNav, onToggleNotif, unreadCount }) {
  const present = attendanceRecords.filter(r => r.status === "present").length;
  const absent = attendanceRecords.filter(r => r.status === "absent").length;
  const late = attendanceRecords.filter(r => r.status === "late").length;
  const [filter, setFilter] = useState("");
  const filtered = attendanceRecords.filter(r => { const v = volunteers.find(x => x.id === r.volId); const ev = events[r.eventId]; return (v?.name + ev?.name).toLowerCase().includes(filter.toLowerCase()); });
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <InnerNav onNav={onNav} onToggleNotif={onToggleNotif} unreadCount={unreadCount} backTo="admin" backLabel="← Admin Panel" />
      <div className="inner-page-wrap">
        <div className="page-hero"><span className="section-tag">Attendance Tracking</span><h2>Volunteer Attendance Records</h2></div>
        <div className="att-summary">
          <div className="att-card"><div className="att-num">{attendanceRecords.length}</div><div className="att-lbl">Total Records</div></div>
          <div className="att-card"><div className="att-num" style={{ color: "var(--sage)" }}>{present}</div><div className="att-lbl">Present</div></div>
          <div className="att-card"><div className="att-num" style={{ color: "var(--rust)" }}>{absent}</div><div className="att-lbl">Absent</div></div>
          <div className="att-card"><div className="att-num" style={{ color: "var(--gold)" }}>{late}</div><div className="att-lbl">Late</div></div>
        </div>
        <div className="data-table-wrap">
          <div className="table-header"><h3>All Attendance Records</h3><input className="table-search" placeholder="🔍 Filter…" value={filter} onChange={e=>setFilter(e.target.value)}/></div>
          <table><thead><tr><th>Volunteer</th><th>Event</th><th>Date</th><th>Time</th><th>Venue</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>{filtered.length === 0 ? <tr><td colSpan="7" style={{ textAlign: "center", color: "#aaa", padding: "2rem" }}>No records yet.</td></tr> : filtered.map((r, i) => { const v = volunteers.find(x => x.id === r.volId); const ev = events[r.eventId]; const asgn = assignments.find(a => a.volId === r.volId && a.eventId === r.eventId); const badgeCls = r.status === "present" ? "badge-green" : r.status === "absent" ? "badge-red" : "badge-gold"; return <tr key={i}><td><strong>{v?.name}</strong></td><td>{ev?.name}</td><td>{ev?.date || "—"}</td><td>{ev ? `${fmt(ev.startTime)} – ${fmt(ev.endTime)}` : "—"}</td><td>{ev?.venue || "—"}</td><td>{asgn?.role || "—"}</td><td><span className={`badge ${badgeCls}`}>{r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span></td></tr>; })}</tbody></table>
        </div>
      </div>
    </div>
  );
}

function PerformancePage({ events, volunteers, feedbackData, onNav, onToggleNotif, unreadCount }) {
  const avg = feedbackData.length ? feedbackData.reduce((s, f) => s + f.stars, 0) / feedbackData.length : 0;
  const fiveStars = feedbackData.filter(f => f.stars === 5).length;
  const volGroups = {};
  feedbackData.forEach(f => { if (!volGroups[f.volId]) volGroups[f.volId] = []; volGroups[f.volId].push(f); });
  const sorted = Object.entries(volGroups).sort((a, b) => (b[1].reduce((s, f) => s + f.stars, 0) / b[1].length) - (a[1].reduce((s, f) => s + f.stars, 0) / a[1].length));
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <InnerNav onNav={onNav} onToggleNotif={onToggleNotif} unreadCount={unreadCount} backTo="admin" backLabel="← Admin Panel" />
      <div className="inner-page-wrap">
        <div className="page-hero"><span className="section-tag">Performance Reviews</span><h2>Volunteer Performance</h2></div>
        <div className="stat-grid">
          <div className="stat-card gold"><div className="stat-num">{feedbackData.length}</div><div className="stat-label">Total Reviews</div></div>
          <div className="stat-card rust"><div className="stat-num">{avg.toFixed(1)}</div><div className="stat-label">Average Rating</div></div>
          <div className="stat-card sage"><div className="stat-num">{fiveStars}</div><div className="stat-label">5-Star Reviews</div></div>
          <div className="stat-card ink"><div className="stat-num">{new Set(feedbackData.map(f => f.volId)).size}</div><div className="stat-label">Volunteers Reviewed</div></div>
        </div>
        {sorted.length === 0 ? <p style={{ color: "#aaa", textAlign: "center", padding: "3rem" }}>No feedback submitted yet.</p> : sorted.map(([vid, fbs]) => {
          const v = volunteers.find(x => x.id === parseInt(vid)); if (!v) return null;
          const avgS = fbs.reduce((s, f) => s + f.stars, 0) / fbs.length;
          const latest = fbs[fbs.length - 1]; const ev = events[latest.eventId];
          return <div key={vid} className="perf-card">
            <div className="perf-avatar">{v.name.charAt(0)}</div>
            <div><div className="perf-name">{v.name}</div><div className="perf-role">{v.skills.slice(0, 2).join(" · ")}</div><div className="perf-stars">{"★".repeat(Math.round(avgS))}{"☆".repeat(5 - Math.round(avgS))}</div><div className="perf-meta">{fbs.length} review{fbs.length > 1 ? "s" : ""} · Latest: {ev?.name || "—"} · by {latest.by} on {latest.date}</div><div className="perf-comment">"{latest.comment}"</div></div>
            <div className="perf-score"><div className="score-num">{avgS.toFixed(1)}</div><div className="score-lbl">avg rating</div></div>
          </div>;
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [sessionRole, setSessionRole] = useState(null);
  const [volunteers, setVolunteers] = useState(INIT_VOLUNTEERS);
  const [events, setEvents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [eventDetailIdx, setEventDetailIdx] = useState(null);
  const [eventDetailFrom, setEventDetailFrom] = useState("home");
  const { toast, showToast } = useToast();

  useCursor();

  // Inject styles once
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const unreadCount = notifications.filter(n => n.unread).length;

  function nav(p) {
    if (p === "requireAdmin") {
      if (sessionRole === "admin") { setPage("admin"); }
      else { showToast("🔒 Please log in as Admin to access the panel."); setPage("login"); }
      return;
    }
    setPage(p);
  }

  function handleLogin(role) {
    setSessionRole(role);
    showToast(`✅ Logged in as ${role === "admin" ? "Admin" : "Volunteer"}`);
    if (role === "admin") setPage("admin"); else setPage("home");
  }

  function handleRegister(role, data) {
    if (role === "volunteer") {
      const newVol = { id: volunteers.length + 1, ...data, events: [] };
      setVolunteers(prev => [...prev, newVol]);
      setNotifications(prev => [{ id: Date.now(), icon: "🎉", title: "Welcome to VolunteerHub!", body: `Hi ${data.name}! Your volunteer account has been created.`, time: "Just now", unread: true }, ...prev]);
      setSessionRole("volunteer");
    }
  }

  function openEvent(idx, from = "home") { setEventDetailIdx(idx); setEventDetailFrom(from); setPage("event-detail"); }

  function handleFeedbackSubmit(fb) {
    setFeedbackData(prev => [...prev, { ...fb, by: "Admin", date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) }]);
    showToast("✅ Feedback submitted successfully!");
  }

  function markRead(id) { setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n)); }

  const commonNotifProps = { notifications, open: notifOpen, onClose: () => setNotifOpen(false), onMarkRead: markRead };
  const commonNavProps = { onNav: nav, onToggleNotif: () => setNotifOpen(p => !p), unreadCount };

  return (
    <>
      {/* Cursor elements */}
      <div id="cursor-dot" />
      <div id="cursor-ring" />
      <div id="cursor-trail" />

      {/* Toast */}
      <div className={`toast${toast.show ? " show" : ""}`}>{toast.msg}</div>

      {/* Notification panel (global) */}
      <NotifPanel {...commonNotifProps} />

      {/* Feedback modal (global) */}
      {feedbackOpen && <FeedbackModal sessionRole={sessionRole} volunteers={volunteers} events={events} onClose={() => setFeedbackOpen(false)} onSubmit={handleFeedbackSubmit} />}

      {/* Pages */}
      {page === "home" && <HomePage {...commonNavProps} events={events} onOpenEvent={openEvent} onFeedback={() => setFeedbackOpen(true)} />}
      {page === "login" && <LoginPage onNav={nav} onLogin={handleLogin} />}
      {page === "register" && <RegisterPage onNav={nav} onRegister={handleRegister} showToast={showToast} />}
      {page === "all-events" && <AllEventsPage {...commonNavProps} events={events} onOpenEvent={openEvent} />}
      {page === "event-detail" && eventDetailIdx !== null && <EventDetailPage eventIdx={eventDetailIdx} events={events} assignments={assignments} volunteers={volunteers} fromPage={eventDetailFrom} {...commonNavProps} />}
      {page === "admin" && <AdminPanel volunteers={volunteers} setVolunteers={setVolunteers} events={events} setEvents={setEvents} assignments={assignments} setAssignments={setAssignments} attendanceRecords={attendanceRecords} setAttendanceRecords={setAttendanceRecords} feedbackData={feedbackData} setFeedbackData={setFeedbackData} notifications={notifications} setNotifications={setNotifications} {...commonNavProps} showToast={showToast} onOpenEvent={openEvent} />}
      {page === "scheduling" && <SchedulingPage events={events} assignments={assignments} volunteers={volunteers} {...commonNavProps} />}
      {page === "attendance" && <AttendancePage events={events} assignments={assignments} volunteers={volunteers} attendanceRecords={attendanceRecords} {...commonNavProps} />}
      {page === "performance" && <PerformancePage events={events} volunteers={volunteers} feedbackData={feedbackData} {...commonNavProps} />}
    </>
  );
}
