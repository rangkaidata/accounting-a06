/*
 * name: budiono
 * date: sep-04, 17:57, mon-2023;new;324;
 * edit: sep-19, 21:46, tue-2023;
 * edit: oct-14, 20:04, sat-2023; 
 */ 

'use strict';

var Phases={
  url:'phases',
  title:'Phases'
}

Phases.show=(tiket)=>{
  tiket.modul=Phases.url;
  tiket.menu.name=Phases.title;

  const baru=exist(tiket);
  if(baru==-1){
    const newTxs=new BingkaiUtama(tiket);
    const indek=newTxs.show();
    Phases.formPaging(indek);
  }else{
    show(baru);
  }
}

Phases.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Phases.formCreate(indek));
  toolbar.search(indek,()=>Phases.formSearch(indek));
  toolbar.refresh(indek,()=>Phases.formPaging(indek));
  toolbar.download(indek,()=>Phases.formExport(indek));
  toolbar.upload(indek,()=>Phases.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    Phases.readShow(indek);
  });
}

Phases.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;

  var html='<div style="padding:0 1rem 0 1rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';

  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button"'
        +' id="btn_first"'
        +' onclick="Phases.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="Phases.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page
          +'</button>';  
        } else {
          html+= '<button type="button" '
          +' onclick="Phases.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last" '
        +' onclick="Phases.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }

  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Phase ID</th>'
    +'<th>Description</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].phase_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].phase_name)+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)
          +'</td>'
        +'<td align="center">'
          +'<button type="button" id="btn_change" '
          +' onclick="Phases.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].phase_id+'\');">'
          +'</button></td>'
        +'<td align="center">'
          +'<button type="button" id="btn_delete" '
          +' onclick="Phases.formDelete(\''+indek+'\''
          +',\''+paket.data[x].phase_id+'\');">'
          +'</button></td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Phases.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Phases.formPaging(indek);
}

Phases.form=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0 1rem 0 1rem">'
    + content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    
    +'<li><label>Phase ID:</label>'
      +'<input type="text" id="phase_id_'+indek+'"></li>'
      
    +'<li><label>Name:</label>'
      +'<input type="text" id="phase_name_'+indek+'"></li>'
      
    +'<li><label>&nbsp;</label>'
      +'<label><input type="checkbox" '
      +' id="phase_inactive_'+indek+'">Inactive</label>'
      +'</li>'
      
    +'<li><label>&nbsp;</label>'
      +'<label><input type="checkbox" '
      +' id="use_cost_'+indek+'">'
      +'Use Cost Codes</label></li>'

    +'</ul>'
    
    +'<details open>'
      +'<summary>General</summary>'
      +'<label>Cost Type:</label>'
      +'<select id="phase_type_'+indek+'">'
      +getDataCostType(indek)
      +'</select>'
    +'</details>'
    +'</form>'
    +'</div>';
  
  content.html(indek,html);
  statusbar.ready(indek);
  
  if (metode===MODE_CREATE){
    document.getElementById('phase_id_'+indek).focus();
  }else{
    document.getElementById('phase_id_'+indek).disabled=true;
    document.getElementById('phase_name_'+indek).focus();
    document.getElementById('use_cost_'+indek).disabled=true;
  }
}

Phases.formCreate=(indek)=>{
  Phases.form(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Phases.formPaging(indek));
  toolbar.save(indek,()=>Phases.createExecute(indek));
}

Phases.createExecute=(indek)=>{
  db3.createOne(indek,{
    "phase_id":getEV("phase_id_"+indek),
    "phase_name":getEV("phase_name_"+indek),
    "phase_inactive":getEC("phase_inactive_"+indek),
    "use_cost":getEC("use_cost_"+indek),
    "phase_type":getEI("phase_type_"+indek)
  });
}

Phases.readOne=(indek,eop)=>{
  db3.readOne(indek,{
    "phase_id":bingkai[indek].phase_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0){
      const d= paket.data;
      setEV('phase_id_'+indek, d.phase_id);
      setEV('phase_name_'+indek, d.phase_name);
      setEC('phase_inactive_'+indek, d.phase_inactive);
      setEC('use_cost_'+indek, d.use_cost);
      setEI('phase_type_'+indek, d.phase_type);
      
      message.none(indek);
      return eop();
    }
  });
}

Phases.formUpdate=(indek,phase_id)=>{
  bingkai[indek].phase_id=phase_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Phases.form(indek,MODE_UPDATE);
  Phases.readOne(indek,()=>{
    toolbar.back(indek,()=>Phases.formLast(indek));
    toolbar.save(indek,()=>Phases.updateExecute(indek));
  });
}

Phases.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "phase_id":bingkai[indek].phase_id,
    "phase_name":getEV("phase_name_"+indek),
    "phase_inactive":getEC("phase_inactive_"+indek),
    "phase_type":getEI("phase_type_"+indek)
  });
}

Phases.formDelete=(indek,phase_id)=>{
  bingkai[indek].phase_id=phase_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Phases.form(indek,MODE_DELETE);
  Phases.readOne(indek,()=>{
    toolbar.back(indek,()=>Phases.formLast(indek));
    toolbar.delet(indek,()=>Phases.deleteExecute(indek));
  });
}

Phases.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "phase_id":bingkai[indek].phase_id
  });
}

Phases.formSearch=(indek,txt)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Phases.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Phases.formPaging(indek));
}

Phases.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Phases.formResult(indek);
}

Phases.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Phases.formSearch(indek));
  db3.search(indek,(paket)=>{
    bingkai[indek].paket=paket;
    bingkai[indek].metode=MODE_RESULT;
    Phases.readShow(indek);
  });
}

Phases.formLast=function(indek){
  bingkai[indek].text_search==''?
  Phases.formPaging(indek):
  Phases.formResult(indek);
}

Phases.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Phases.formPaging(indek));
  Phases.exportExecute(indek);
}

Phases.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'phases.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Phases.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Phases.formPaging(indek);});
  iii.uploadJSON(indek);
}

Phases.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;
  
  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "phase_id":d[i][1],
      "phase_name":d[i][2],
      "phase_inactive":d[i][3],
      "use_cost":d[i][4],
      "phase_type":d[i][5],
    }
    db3.query(indek,Phases.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Phases.getPaging=(indek,callBack)=>{
  db3.query(indek,'phases/read_paging',{
    "page":bingkai[indek].page,
    "limit":LIMIT,
    "inactive":1
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0) return callBack(paket);
  });
}

// eof: 324;
