/*
 * name: budiono
 * date: sep-04, 15:08, mon-2023; new;82;
 */

'use strict';

var Default={
  url:'default',
  title:'Default'
}

Default.show=(tiket)=>{
  tiket.modul=Default.url;
  tiket.menu.name=Default.title;

  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    Default.formUpdate(indek);
  }else{
    show(baru);
  }  
}

Default.formUpdate=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.more(indek,()=>Menu.more(indek));
  Default.formEntry(indek);
  Default.readOne(indek,()=>{
    toolbar.save(indek,()=>{Default.updateExecute(indek);});
    toolbar.refresh(indek,()=>{Default.formUpdate(indek);});
  });  
}

Default.formEntry=(indek)=>{
  var html='<div style="margin:1rem;">'
    // +bingkai.title(indek)
    +'<div id="msg_'+indek+'" style="margin:0.5rem;"></div>'
    +'<form autocomplete="off">'
    
    +'<ul>'
    +'<li><label>Timeout Login:</label>'
      +'<select id="timeout_'+indek+'">';
        for(var i=0;i<array_expired_mode.length;i++){
          html+='<option>'+array_expired_mode[i]+'</option>';
        }
      html+='</select>'
    +'</li>'
    /*
    +'<li><label>ID/Number:</label>'
      +'<label><input type="checkbox" '
      +' id="sensitive_id_'+indek+'" checked>'
      +' Not case sensitive</label></li>'*/
    +'</ul>'
    +'</form>'
    +'<p><label><i>&#10020 Relogin for these changes to take effect.</i>'
    +'</label></p>';
    +'</div>';

  content.html(indek,html);
  document.getElementById("timeout_"+indek).focus;
}


Default.readOne=(indek,eop)=>{
  db1.readOne(indek,{},(paket)=>{
    if (paket.err.id==0 || paket.count>0){
      setEI('timeout_'+indek, parseInt(paket.data.timeout_login));
    }
    message.none(indek);
    return eop();
  });
}

Default.updateExecute=(indek)=>{
  db1.updateOne(indek,{
    "timeout_login":getEI('timeout_'+indek),
    "setup_detail":[],
  });
}
// eof:82;
