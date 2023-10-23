/*
 * auth: budiono
 * date: sep-04, 16:20, mon-2023; new;331;
 * edit: sep-11, 11:48, mon-2023; add;
 * edit: sep-17, 10:48, sun-2023; xHTML;
 * edit: sep-22, 14:27, fri-2023; default class;
 */
 
'use strict';

var Accounts={
  url:'account',
  title:'Chart of Accounts'
}

Accounts.show=(tiket)=>{
  tiket.modul=Accounts.url;
  tiket.menu.name=Accounts.title;
  tiket.bisa.tambah=0;

  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    Accounts.formPaging(indek);
  }else{
    show(baru);
  }  
}

Accounts.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Accounts.formCreate(indek));
  toolbar.search(indek,()=>Accounts.formSearch(indek));
  toolbar.refresh(indek,()=>Accounts.formPaging(indek));
  toolbar.download(indek,()=>{Accounts.formExport(indek);});
  toolbar.upload(indek,()=>{Accounts.formImport(indek);});
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    Accounts.readShow(indek);
  });
}

Accounts.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  
  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';

  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button"'
        +' id="btn_first"'
        +' onclick="Accounts.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="Accounts.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')"'
          +' disabled>'
          +paket.paging.pages[x].page 
          +'</button>';  
        }else{
          html+= '<button type="button"'
          +' onclick="Accounts.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last"'
        +' onclick="Accounts.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }

  html+='<table border=1>'
  +'<tr>'
  +'<th colspan="2">Account ID</th>'
  +'<th>Account Name</th>'
  +'<th>Account Class</th>'
  +'<th>User Name</th>'
  +'<th>Modified</th>'
  +'<th colspan="2">Action</th>'
  +'</tr>';

  var tipe='';
  var balance;
  
  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].account_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].account_name)+'</td>'
        +'<td align="left">'
        +array_account_class[paket.data[x].account_class]
        +'</td>'
        
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
        +tglInt(paket.data[x].info.date_modified)
        +'</td>'
        
        +'<td align="center">'
        +'<button type="button"'
        +' id="btn_change"'
        +' onclick="Accounts.formUpdate(\''+indek+'\''
        +',\''+paket.data[x].account_id+'\');">'
        +'</button>'
        +'</td>'
        
        +'<td align="center">'
        +'<button type="button"'
        +' id="btn_delete"'
        +' onclick="Accounts.formDelete(\''+indek+'\''
        +',\''+paket.data[x].account_id+'\');">'
        +'</button>'
        +'</td>'
        +'</tr>';
    }
  }
  html+='</table>'
  +'</div>';

  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Accounts.gotoPage=(indek,ini)=>{
  bingkai[indek].page=ini;
  Accounts.formPaging(indek);
}

Accounts.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  const html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
      +'<ul>'
      +'<li><label>Account ID:</label>'
        +'<input type="text" id="account_id_'+indek+'"></li>'
        
      +'<li><label>Account Name:</label>'
        +'<input type="text" id="account_name_'+indek+'"></li>'
        
      +'<li><label>Account Class:</label>'
        +'<select id="account_class_'+indek+'">'
        +getDataAccountClass(indek)
        +'</select></li>'
      +'<li><label>&nbsp;</label>'
        +'<label>'
        +'<input type="checkbox"'
        +' id="account_inactive_'+indek+'"'
        +'>Inactive</label>'
        +'</li>'
    +'</ul>'
    +'</form>'
    +'</div>';
  content.html(indek,html);
  statusbar.ready(indek);
  
  if(metode!=MODE_CREATE){
    document.getElementById('account_id_'+indek).disabled=true;
    document.getElementById('account_class_'+indek).disabled=true;
    document.getElementById('account_name_'+indek).focus();
  }else{
    document.getElementById('account_id_'+indek).focus();
  }
  // alert(bingkai[indek].account_class);
  if(bingkai[indek].account_class>0){
    setEI('account_class_'+indek,bingkai[indek].account_class)
  }
}

Accounts.formCreate=(indek)=>{
  bingkai[indek].account_id='';
  Accounts.formEntry(indek,MODE_CREATE);

  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Accounts.formPaging(indek));
  toolbar.save(indek,()=>Accounts.createExecute(indek));
}

Accounts.createExecute=(indek)=>{
  bingkai[indek].account_class=getEI('account_class_'+indek);
  db3.createOne(indek,{
    "account_id":getEV("account_id_"+indek),
    "account_name":getEV("account_name_"+indek),
    "account_class":getEV("account_class_"+indek),
    "account_inactive":getEC("account_inactive_"+indek)
  });
}

Accounts.readOne=(indek,eop)=>{
  db3.readOne(indek,{
    "account_id":bingkai[indek].account_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0) {
      const d=paket.data;
      setEV('account_id_'+indek,d.account_id);
      setEV('account_name_'+indek,d.account_name);
      setEV('account_class_'+indek,d.account_class);
      setEC('account_inactive_'+indek,d.account_inactive);
    }
    statusbar.ready(indek);
    message.none(indek);
    return eop();
  });
}

Accounts.formUpdate=(indek,account_id)=>{
  bingkai[indek].account_id=account_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Accounts.formEntry(indek,MODE_UPDATE);
  Accounts.readOne(indek,()=>{
    toolbar.back(indek,()=>Accounts.formLast(indek));
    toolbar.save(indek,()=>Accounts.updateExecute(indek))
  });
}

Accounts.updateExecute=(indek)=>{
  //bingkai[indek].account_class=getEI('account_class_'+indek);
  db3.updateOne(indek,{
    "account_id":bingkai[indek].account_id,
    "account_name":getEV("account_name_"+indek),
    "account_inactive":getEC("account_inactive_"+indek)
  });
}

Accounts.formDelete=(indek,account_id)=>{
  bingkai[indek].account_id=account_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Accounts.formEntry(indek,MODE_DELETE);
  Accounts.readOne(indek,()=>{
    toolbar.back(indek,()=>Accounts.formLast(indek));
    toolbar.delet(indek,()=>Accounts.deleteExecute(indek));
  });
}

Accounts.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "account_id":bingkai[indek].account_id
  });
}

Accounts.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Accounts.formPaging(indek):
  Accounts.formResult(indek);
}

Accounts.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Accounts.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Accounts.formPaging(indek));
}

Accounts.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Accounts.formResult(indek);
}

Accounts.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Accounts.formSearch(indek);});
  db3.search(indek,(paket)=>{
    bingkai[indek].paket=paket;
    bingkai[indek].metode=MODE_RESULT;
    Accounts.readShow(indek);
  });
}

Accounts.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Accounts.formPaging(indek));
  Accounts.exportExecute(indek);
}

Accounts.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'accounts.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Accounts.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Accounts.formPaging(indek);});
  iii.uploadJSON(indek);
}

Accounts.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "account_id":d[i][1],
      "account_name":d[i][2],
      "account_class":d[i][3],
      "account_inactive":d[i][4],
    }
    db3.query(indek,Accounts.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Accounts.lookUp=(indek,id_kolom,nama_kolom)=>{
  bingkai[indek].id_kolom=id_kolom;
  bingkai[indek].nama_kolom=nama_kolom;

  objPop=new AccountLook(indek);
  objPop.show();
}

Accounts.getOne=(indek,account_id,callBack)=>{
  db3.query(indek,'account/read_one',{
    "account_id":account_id
  },(paket)=>{
    return callBack(paket);
  });
}

// eof:331;
