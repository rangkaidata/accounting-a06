/*
 * auth: budiono;
 * date: sep-27, 13:44, wed-2023; new;
 * edit: oct-04, 12:25, wed-2023; xHTML;
 */ 

'use strict';

var AccountBegins={
  url:'account_begins',
  title:'Account Beginning Balances'
}

AccountBegins.show=(tiket)=>{
  tiket.modul=AccountBegins.url;
  tiket.menu.name=AccountBegins.title;
  tiket.bisa.tambah=0;

  const baru=exist(tiket);
  if(baru==-1){
    const form=new BingkaiUtama(tiket);
    const indek=form.show();
    AccountBegins.formPaging(indek);
  }else{
    show(baru);
  }
}

AccountBegins.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>AccountBegins.formCreate(indek));
  toolbar.search(indek,()=>AccountBegins.formSearch(indek));
  toolbar.refresh(indek,()=>AccountBegins.formPaging(indek));
  toolbar.download(indek,()=>{AccountBegins.formExport(indek);});
  toolbar.upload(indek,()=>{AccountBegins.formImport(indek);});
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    AccountBegins.readShow(indek);
  });
}

AccountBegins.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  
  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';

  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button" '
        +' id="btn_first" '
        +' onclick="AccountBegins.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      
      for (var x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="AccountBegins.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page
          +'</button>'; 
        }else{
          html+= '<button type="button" '
          +' onclick="AccountBegins.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>';  
        }
      }
      
      if (paket.paging.last!=""){
        html+='<button type="button" '
        +' id="btn_last" '
        +' onclick="AccountBegins.gotoPage(\''+indek+'\''
        +' ,\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }

  html+='<table border=1>'
  +'<th colspan="2">Account ID</th>'
  +'<th>Account Name</th>'
  +'<th>Account Class</th>'
  +'<th>Debit</th>'
  +'<th>Credit</th>'
  +'<th colspan="2">Action</th>';

  if (paket.err.id===0){
    for (x in paket.data){
      html+='<tr>'
      +'<td align="center">'+paket.data[x].row_id+'</td>'
      +'<td align="left">'+paket.data[x].account_id+'</td>'
      +'<td align="left">'+xHTML(paket.data[x].account_name)+'</td>'
      +'<td align="center">'
        +array_account_class[paket.data[x].account_class]+'</td>'
      +'<td align="center">'
        +formatSerebuan(paket.data[x].begin_debit)+'</td>'
      +'<td align="center">'
        +formatSerebuan(paket.data[x].begin_credit)+'</td>'

      +'<td align="center">'
        +'<button type="button" '
        +' id="btn_change" '
        +' onclick="AccountBegins.formUpdate(\''+indek+'\''
        +' ,\''+paket.data[x].account_id+'\');">'
        +'</button>'
        +'</td>'
      +'<td align="center">'
        +'<button type="button" '
        +' id="btn_delete" '
        +' onclick="AccountBegins.formDelete(\''+indek+'\''
        +',\''+paket.data[x].account_id+'\');">'
        +'</button>'
        +'</td>'
      +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

AccountBegins.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  AccountBegins.formPaging(indek);
}

AccountBegins.formCreate=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>AccountBegins.formPaging(indek));
  toolbar.save(indek,()=>AccountBegins.createExecute(indek));
  AccountBegins.formEntry(indek,MODE_CREATE);
}

AccountBegins.createExecute=(indek)=>{
  db3.createOne(indek,{
    "account_id":getEV('account_id_'+indek),
    "begin_debit":getEV('begin_debit_'+indek),
    "begin_credit":getEV('begin_credit_'+indek)
  });
}

AccountBegins.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "account_id":bingkai[indek].account_id
  },(paket)=>{
    if (paket.err.id==0){
      const d=paket.data;
      setEV('account_id_'+indek,d.account_id);
      setEV('account_name_'+indek,d.account_name);
      setEI('account_class_'+indek,d.account_class);
      setEV('begin_debit_'+indek,d.begin_debit);
      setEV('begin_credit_'+indek,d.begin_credit);
    }
    statusbar.ready(indek);
    message.none(indek);
    return callback();
  });
}

AccountBegins.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  
  var html='<form autocomplete="off">'
    +'<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<ul>'
    +'<li><label>Account ID</label>: '
      +'<input type="text"'
      +' id="account_id_'+indek+'"'
      +' onchange="AccountBegins.getAccount(\''+indek+'\')"'
      +' size="8">'
      
      +'<button type="button" '
        +' id="account_btn_'+indek+'" class="btn_find"'
        +' onclick="Accounts.lookUp(\''+indek+'\''
        +',\'account_id_'+indek+'\')">'
        +'</button>'
      +'</li>'
      
    +'<li><label>Account Name</label>: '
      +'<input type="text" id="account_name_'+indek+'" disabled>'
      +'</li>'
      
    +'<li><label>Account Class</label>: '
      +'<select id="account_class_'+indek+'" disabled>'
      +getDataAccountClass(indek)
      +'</select></li>'

    +'<li><label>Debit</label>: '
      +'<input type="text" '
      +' id="begin_debit_'+indek+'" '
      +' onfocus="this.select();"'
      +' style="text-align:right;"'
      +' size="8"></li>'
      
    +'<li><label>Credit</label>: '
      +'<input type="text" '
      +' id="begin_credit_'+indek+'" '
      +' onfocus="this.select();"'
      +' style="text-align:right;"'
      +' size="8"></li>'
  +'</ul>'
   +'</form>'
  +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);
  
  if(metode==MODE_CREATE){
    document.getElementById('account_id_'+indek).focus();
  }else{
    document.getElementById('account_id_'+indek).disabled=true;
    document.getElementById('account_btn_'+indek).disabled=true;
  }
}

AccountBegins.formUpdate=(indek,account_id)=>{
  bingkai[indek].account_id=account_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  AccountBegins.formEntry(indek,MODE_UPDATE);
  AccountBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>{AccountBegins.formLast(indek);});
    toolbar.save(indek,()=>{AccountBegins.updateExecute(indek);})    
  });
}

AccountBegins.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "account_id":bingkai[indek].account_id,
    "begin_debit":getEV("begin_debit_"+indek),
    "begin_credit":getEV("begin_credit_"+indek)
  });
}

AccountBegins.formDelete=(indek,account_id)=>{
  bingkai[indek].account_id=account_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  AccountBegins.formEntry(indek,MODE_DELETE);
  AccountBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>{AccountBegins.formLast(indek);});
    toolbar.delet(indek,()=>{AccountBegins.deleteExecute(indek);});
  });
}

AccountBegins.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "account_id":bingkai[indek].account_id
  });
}

AccountBegins.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  AccountBegins.formPaging(indek):
  AccountBegins.formResult(indek);
}

AccountBegins.formSearch=(indek,txt)=>{
  bingkai[indek].metode=MODE_SEARCH;
  toolbar.none(indek);
  toolbar.hide(indek);
  content.search(indek,()=>AccountBegins.searchExecute(indek));
  toolbar.back(indek,()=>{AccountBegins.formPaging(indek);});
}

AccountBegins.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  AccountBegins.formResult(indek);
}

AccountBegins.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{AccountBegins.formSearch(indek);});
  db3.search(indek,(paket)=>{
    bingkai[indek].paket=paket;
    bingkai[indek].metode=MODE_RESULT;
    AccountBegins.readShow(indek);
  });
}

AccountBegins.setAccount=(indek,d)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, d.account_id);
  AccountBegins.getAccount(indek);
}

AccountBegins.getAccount=(indek)=>{
  message.none(indek);
  Accounts.getOne(indek,
    getEV('account_id_'+indek),
  (paket)=>{
    if(paket.err.id==0 && paket.count>0){
      setEV('account_name_'+indek, paket.data.account_name);
      setEV('account_class_'+indek, paket.data.account_class);
    }else{
      setEV('account_name_'+indek, '');
      setEV('account_class_'+indek, '');
    }
  });
}

AccountBegins.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>AccountBegins.formPaging(indek));
  AccountBegins.exportExecute(indek);
}

AccountBegins.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'account_begins.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

AccountBegins.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{AccountBegins.formPaging(indek);});
  iii.uploadJSON(indek);
}

AccountBegins.importExecute=(indek)=>{
 var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "account_id":d[i][1],
      "begin_debit":d[i][2],
      "begin_credit":d[i][3]
    }
    db3.query(indek,AccountBegins.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}
// EOF: 394
