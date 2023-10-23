/*
 * name: budiono
 * date: sep-25, 12:06, mon-2023; new
 */

'use strict';

var RptChart01={
  url:'report_ledger',
  title:'Chart of Accounts'
}

RptChart01.show=(tiket)=>{
  tiket.modul=RptChart01.url;
  tiket.menu.name=RptChart01.title;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newTxs=new BingkaiUtama(tiket);
    const indek=newTxs.show();
    RptChart01.formParam(indek);
  }else{
    show(baru);
  }
}

RptChart01.formParam=(indek)=>{
  bingkai[indek].metode=MODE_VIEW;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.preview(indek,()=>RptChart01.preview(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  RptChart01.form(indek);
}

RptChart01.form=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  
  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    // here!
    
    +'<form>'
    +'<ul>'
      +'<li><label>Account ID</label>: '
      
      +'<Input Type="Text" '
      +' id="gl_account_id_a_'+indek+'"'
      +' placeholder="From"'
      +' size="8">'
      
      +'<button type="button"'
      +' class="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'gl_account_id_a_'+indek+'\');">'
      +'</button>'
      
      +'&nbsp;To&nbsp;'
      
      +'<Input Type="Text" placeholder="To"'
      +' id="gl_account_id_b_'+indek+'"'
      +' size="8">'
      
      +'<button type="button"'
      +' class="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'gl_account_id_b_'+indek+'\');">'
      +'</button>'
      
      +'</li>'
    +'</ul>'
    +'</form>'
    
    +'</div>';
  content.html(indek,html);
  statusbar.ready(indek);
}

RptChart01.preview=(indek)=>{
  
}


RptChart01.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  setEV(id_kolom, data.account_id);
}
