/*
 * name: budiono
 * date: sep-04, 17:44, mon-2023; new; 318;
 * edit: oct-14, 20:05, sat-2023; getPaging;
 */ 

'use strict';

var Costs={
  url:'cost_codes',
  title:'Cost Codes'
}

Costs.show=(tiket)=>{
  tiket.modul=Costs.url;
  tiket.menu.name=Costs.title;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newTxs=new BingkaiUtama(tiket);
    const indek=newTxs.show();
    Costs.formPaging(indek);
  }else{
    show(baru);
  }
}

Costs.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Costs.formCreate(indek));
  toolbar.search(indek,()=>Costs.formSearch(indek));
  toolbar.refresh(indek,()=>Costs.formPaging(indek));
  toolbar.download(indek,()=>Costs.formExport(indek));
  toolbar.upload(indek,()=>Costs.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    Costs.readShow(indek);
  });
}

Costs.readShow=(indek)=>{
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
        +' id="btn_first" '
        +' onclick="Costs.gotoPage(\''+indek+'\','
        +'\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Costs.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page 
          +'</button>'; 
        } else {
          html+= '<button type="button" '
          +' onclick="Costs.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last" onclick="Costs.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Cost ID</th>'
    +'<th>Description</th>'
    +'<th>Owner</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].cost_id+'</td>'
        +'<td align="left">'+tHTML(paket.data[x].cost_name)+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)
          +'</td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_change" '
          +' onclick="Costs.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].cost_id+'\');">'
          +'</button></td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_delete" '
          +' onclick="Costs.formDelete(\''+indek+'\''
          +',\''+paket.data[x].cost_id+'\');">'
          +'</button></td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Costs.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Costs.formPaging(indek);
}

Costs.form=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    
    +'<li><label>Cost ID:</label>'
      +'<input type="text"'
      +' id="cost_id_'+indek+'"'
      +' size="12"></li>'
      
    +'<li><label>Description:</label>'
      +'<input type="text"'
      +' id="cost_name_'+indek+'"'
      +' size="30"></li>'
      
    +'<li><label>&nbsp;</label>'
      +'<label><input type="checkbox"'
      +' id="cost_inactive_'+indek+'">'
      +'Inactive</label>'
      +'</li>'
      
    +'<li><label>Cost Type:</label>'
      +'<select id="cost_type_'+indek+'">'
      +getDataCostType(indek)
      +'</select></li>'

    +'</ul>'
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);
  
  if (metode===MODE_CREATE){
    document.getElementById('cost_id_'+indek).focus();
  }else{
    document.getElementById('cost_id_'+indek).disabled=true;
    document.getElementById('cost_name_'+indek).focus();
  }
}

Costs.formCreate=(indek)=>{
  bingkai[indek].cost_id='';
  Costs.form(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Costs.formPaging(indek));
  toolbar.save(indek,()=>Costs.createExecute(indek));
}

Costs.createExecute=(indek)=>{
  db3.createOne(indek,{
    "cost_id":getEV("cost_id_"+indek),
    "cost_name":getEV("cost_name_"+indek),
    "cost_inactive":getEC("cost_inactive_"+indek),
    "cost_type":getEI("cost_type_"+indek)
  });
}

Costs.readOne=(indek,eop)=>{
  db3.readOne(indek,{
    "cost_id":bingkai[indek].cost_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0){
      const d=paket.data;
      setEV( 'cost_id_'+indek,d.cost_id );
      setEV('cost_name_'+indek,d.cost_name);
      setEC('cost_inactive_'+indek,d.cost_inactive);
      setEI('cost_type_'+indek,d.cost_type);
    }
    message.none(indek);
    return eop();
  });
}

Costs.formUpdate=(indek,cost_id)=>{
  bingkai[indek].cost_id=cost_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Costs.form(indek,MODE_UPDATE);
  Costs.readOne(indek,()=>{
    toolbar.back(indek,()=>Costs.formLast(indek));
    toolbar.save(indek,()=>Costs.updateExecute(indek));
  });
}

Costs.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "cost_id":bingkai[indek].cost_id,
    "cost_name":getEV("cost_name_"+indek),
    "cost_inactive":getEC("cost_inactive_"+indek),
    "cost_type":getEI("cost_type_"+indek)
  });
}

Costs.formDelete=(indek,cost_id)=>{
  bingkai[indek].cost_id=cost_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Costs.form(indek,MODE_DELETE);
  Costs.readOne(indek,()=>{
    toolbar.back(indek,()=>Costs.formLast(indek));
    toolbar.delet(indek,()=>Costs.deleteExecute(indek));
  });
}

Costs.deleteExecute=function(indek){
  db3.deleteOne(indek,{
    "cost_id":bingkai[indek].cost_id
  });
}

Costs.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Costs.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Costs.formPaging(indek));
}

Costs.searchExecute=function(indek){
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Costs.formResult(indek);
}

Costs.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Costs.formSearch(indek));
  db3.search(indek,()=>{
    Costs.readShow(indek);
  });
}

Costs.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Costs.formPaging(indek):
  Costs.formResult(indek);
}

Costs.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Costs.formPaging(indek));
  Costs.exportExecute(indek);
}

Costs.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'cost_codes.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Costs.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Costs.formPaging(indek);});
  iii.uploadJSON(indek);
}

Costs.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "cost_id":d[i][1],
      "cost_name":d[i][2],
      "cost_inactive":d[i][3],
      "cost_type":d[i][4]
    }
    db3.query(indek,Costs.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Costs.getPaging=(indek,callBack)=>{
  db3.query(indek,'cost_codes/read_paging',{
    "page":bingkai[indek].page,
    "limit":LIMIT,
    "inactive":1
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0) return callBack(paket);
  });
}

// eof: 318;
