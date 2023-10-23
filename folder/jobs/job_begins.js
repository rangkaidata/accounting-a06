/*
 * name: budiono;
 * date: sep-28, 22:37, thu-2023; new;
 * edit: oct-04, 16:16, wed-2023; xHTML;
 */ 

'use strict';

var JobBegins={
  url:"job_begins",
  title:"Job Beginning Balances"
}

JobBegins.show=(tiket)=>{
  tiket.modul=JobBegins.url;
  tiket.menu.name=JobBegins.title;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newCus=new BingkaiUtama(tiket);
    const indek=newCus.show();
    JobBegins.formPaging(indek);
  }else{
    show(baru);
  }
}

JobBegins.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.search(indek,()=>JobBegins.formSearch(indek));
  toolbar.refresh(indek,()=>JobBegins.formPaging(indek));
  toolbar.neuu(indek,()=>JobBegins.formCreate(indek));
  toolbar.download(indek,()=>{JobBegins.formExport(indek);});
  toolbar.upload(indek,()=>{JobBegins.formImport(indek);});
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    JobBegins.readShow(indek);
  });
}

JobBegins.readShow=(indek)=>{
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
        +' id="btn_first" onclick="Jobs.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Jobs.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page
          +'</button>';  
        } else {
          html+= '<button type="button"'
          +' onclick="Jobs.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" '
        +' id="btn_last" onclick="Jobs.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Job ID</th>'
    +'<th>Description</th>'
    +'<th>Beginning Balance</th>'
    +'<th>Owner</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    var d=paket.data;
    for (var x in d) {
      html+='<tr>'
        +'<td align="center">'+d[x].row_id+'</td>'
        +'<td align="left">'+d[x].job_id+'</td>'
        +'<td align="left">'+xHTML(d[x].job_name)+'</td>'
        +'<td align="right">'+d[x].begin_amount+'</td>'

        +'<td align="center">'+d[x].info.user_name+'</td>'
        +'<td align="center">'+tglInt(d[x].info.date_modified)+'</td>'

        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_change" '
          +' onclick="JobBegins.formUpdate(\''+indek+'\''
          +',\''+d[x].job_id+'\');">'
          +'</button></td>'
          
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_delete" '
          +' onclick="JobBegins.formDelete(\''+indek+'\''
          +',\''+d[x].job_id+'\');">'
          +'</button></td>'
        +'</tr>';
    }
  }
  
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

JobBegins.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  JobBegins.formPaging(indek);
}

JobBegins.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    
    +'<li><label>Job ID:</label>'
      +'<input type="text"'
      +' id="job_id_'+indek+'"'
      +' size="12">'
      
      +'<button type="button" '
        +' id="job_btn_'+indek+'" class="btn_find"'
        +' onclick="Jobs.lookUp(\''+indek+'\''
        +',\'job_id_'+indek+'\',-2)"></button>'
        
      +'</li>'
      
    +'<li><label>Description:</label>'
      +'<input type="text"'
      +' id="job_name_'+indek+'"'
      +' disabled'
      +' size="25">'
      +'</li>'
      
    +'<li><label>&nbsp;</label>'
      +'<input type="checkbox" '
        +' id="use_phases_'+indek+'"'
        +' disabled>'
      +'Use Phases'
      +'</li>'
      
    +'</ul>'
        
    +'<details open>'
      +'<summary>Details</summary>'
      +'<div id="begin_detail_'+indek+'"'
        +' style="width:100%;overflow:auto;">'
        +'</div>'
    +'</details>'
    
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);
  
  if(metode==MODE_UPDATE){
    document.getElementById('job_id_'+indek).disabled=true;
    document.getElementById('job_btn_'+indek).disabled=true;
  }
}

JobBegins.formCreate=(indek)=>{
  bingkai[indek].job_id='';
  JobBegins.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>JobBegins.formPaging(indek));
  toolbar.save(indek,()=>JobBegins.createExecute(indek));
  JobBegins.setDefault(indek);
}

JobBegins.setDefault=(indek)=>{
  JobBegins.setRows(indek,[] );
}

JobBegins.createExecute=(indek)=>{
  db3.createOne(indek,{
    "job_id":getEV('job_id_'+indek),
    "begin_detail":bingkai[indek].begin_detail
  });
}

JobBegins.readOne=(indek,callback)=>{
  JobBegins.setRows(indek,[]);

  db3.readOne(indek,{
    "job_id":bingkai[indek].job_id
  },(paket)=>{
    if (paket.err.id==0) {
      const d=paket.data;
      setEV('job_id_'+indek, d.job_id);
      setEV('job_name_'+indek, d.job_name);
      setEC('use_phases_'+indek, d.use_phases);
      JobBegins.setRows(indek, d.begin_detail);
    }
    message.none(indek);
    return callback();
  });
}

JobBegins.formUpdate=function(indek,job_id){
  bingkai[indek].job_id=job_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  JobBegins.formEntry(indek,MODE_UPDATE);
  JobBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>JobBegins.formLast(indek));
    toolbar.save(indek,()=>JobBegins.updateExecute(indek));
  });
}

JobBegins.updateExecute=function(indek){
  db3.updateOne(indek,{
    "job_id":bingkai[indek].job_id,
    "begin_detail":bingkai[indek].begin_detail
  });
}

JobBegins.formDelete=function(indek,job_id){
  bingkai[indek].job_id=job_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  JobBegins.formEntry(indek,MODE_DELETE);
  JobBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>JobBegins.formLast(indek));
    toolbar.delet(indek,()=>JobBegins.deleteExecute(indek));
  });
}

JobBegins.deleteExecute=function(indek){
  db3.deleteOne(indek,{
    "job_id":bingkai[indek].job_id
  });
}

JobBegins.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>JobBegins.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>JobBegins.formPaging(indek));
}

JobBegins.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  JobBegins.formResult(indek);
}

JobBegins.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>JobBegins.formSearch(indek));
  db3.search(indek,()=>{
    JobBegins.readShow(indek);
  });
}

JobBegins.formLast=(indek)=>{
  if(bingkai[indek].text_search==''){
    JobBegins.formPaging(indek);
  }else{
    JobBegins.formResult(indek);
  }
}

JobBegins.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  oldBasket=bingkai[indek].begin_detail;

  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) JobBegins.newRow(newBasket);
  }
  if(oldBasket.length==0) JobBegins.newRow(newBasket);
  JobBegins.setRows(indek,newBasket);
}

JobBegins.newRow=(newBasket)=>{
  var myItem={};
  myItem.row_id=newBasket.length+1;
  myItem.phase_id='';
  myItem.cost_id='';
  myItem.date='';
  myItem.expenses=0;
  myItem.revenues=0;
  newBasket.push(myItem);
}

JobBegins.setRows=function(indek,isi){
  if(isi===undefined)isi=[];
    
  var panjang=isi.length;
  var html=JobBegins.tableHead(indek);

  bingkai[indek].begin_detail=isi;
    
  for (var i=0;i<panjang;i++){
    html+='<tr>'
      +'<td align="center">'+(i+1)+'</td>'
    
      +'<td style="margin:0;padding:0">'
        +'<input type="text" id="phase_id_'+i+'_'+indek+'" '
        +' value="'+isi[i].phase_id+'" size="10"'
        +' onchange="JobBegins.setCell(\''+indek+'\''
        +',\'phase_id_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()">'
        +'</td>'
        
      +'<td>'
        +'<button type="button" id="btn_find" '
        +' onclick="Phases.lookUp(\''+indek+'\''
        +',\'phase_id_'+i+'_'+indek+'\');">'
        +'</button>'
        +'</td>'

      +'<td style="padding:0;margin:0;">'
        +'<input type="text" id="cost_id_'+i+'_'+indek+'"'
        +' value="'+isi[i].cost_id+'" size=10'
        +' onchange="JobBegins.setCell(\''+indek+'\''
        +',\'cost_id_'+i+'_'+indek+'\')"'
        +' onfocus="this.select()" >'
        +'</td>'
        
      +'<td>'
        +'<button type="button" id="btn_find" '
        +' onclick="Costs.lookUp(\''+indek+'\''
        +',\'cost_id_'+i+'_'+indek+'\');">'
        +'</button>'
        +'</td>'

        
      +'<td style="padding:0;margin:0;">'
        +'<input type="text" id="date_fake_'+i+'_'+indek+'"'
        +' onfocus="JobBegins.tampilTglAsli('+i+','+indek+');" '
        +' size="7" value="'+tglIna2(isi[i].date)+'"><br>'
        
        +'<input type="date" id="date_'+i+'_'+indek+'"'
        +' onblur="JobBegins.isiTgl(this.value,'+i+','+indek+');"  '
        +' style="display:none;"></td>'

      +'<td style="padding:0;margin:0;">'
        +'<input type="text" id="expenses_'+i+'_'+indek+'" '
        +' value="'+isi[i].expenses+'" '
        +' size=7'
        +' style="text-align:right"'
        +' onchange="JobBegins.setCell(\''+indek+'\''
        +',\'expenses_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()" >'
        +'</td>'
      
      +'<td style="padding:0;margin:0;">'
        +'<input type="text" id="revenues_'+i+'_'+indek+'" '
        +' value="'+isi[i].revenues+'" '
        +' size=7 '
        +' style="text-align:right"'
        +' onchange="JobBegins.setCell(\''+indek+'\''
        +',\'revenues_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()" >'
        +'</td>'
      
      +'<td align="center">'
        +'<button type="button"'
          +' id="btn_add" '
          +' onclick="JobBegins.addRow(\''+indek+'\','+i+')" >'
          +'</button>'
        +'<button type="button"'
          +' id="btn_remove"'
          +' onclick="JobBegins.removeRow(\''+indek+'\','+i+')" >'
          +'</button>'
      +'</td>'
    +'</tr>';
  }
  html+=JobBegins.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('begin_detail_'+indek).innerHTML=html;
  if(panjang==0)JobBegins.addRow(indek,0);
}

JobBegins.isiTgl=(abc,baris,indek)=>{
  const dateEdit=getEV('date_'+baris+'_'+indek);
  //JobBegins.setCell(indek,baris,'date',dateEdit);
  JobBegins.setCell(indek,'date_'+baris+'_'+indek);

  document.getElementById('date_fake_'+baris+'_'+indek).value=tglIna2(abc);
  document.getElementById('date_fake_'+baris+'_'+indek).style.display="inline";
  document.getElementById('date_'+baris+'_'+indek).style.display="none";
}

JobBegins.tampilTglAsli=(kolom,indek)=>{
  var abc=bingkai[indek].begin_detail[kolom].date;
  if(abc==''){
    var tgl=new Date();
    abc=tgl.getFullYear()
    +'-'+String("00"+(tgl.getMonth()+1)).slice(-2)
    +'-'+String("00"+tgl.getDate()).slice(-2);
  }
  
  document.getElementById('date_fake_'+kolom+'_'+indek).style.display="none";
  document.getElementById('date_'+kolom+'_'+indek).value=abc;
  document.getElementById('date_'+kolom+'_'+indek).style.display="inline";
  document.getElementById('date_'+kolom+'_'+indek).style.width="231px";
  document.getElementById('date_'+kolom+'_'+indek).focus();
}

JobBegins.tableHead=(indek)=>{
  return '<table>'
  +'<thead>'
  +'<tr>'
  +'<th>No.</th>'
  +'<th colspan="2">Phase ID</th>'
  +'<th colspan="2">Cost ID</th>'
  +'<th>Date</th>'
  +'<th>Expenses</th>'
  +'<th>Revenues</th>'
  +'<th>Add/Rem</th>'
  +'</tr>'
  +'</thead>';
}

JobBegins.tableFoot=(indek)=>{
  return '<tfoot>'
  +'<tr>'
  +'<td>#</td>'
  +'</tr>'
  +'</tfoot>'
  +'</table>';
}

JobBegins.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].begin_detail;
  var baru = [];
  var isiEdit = {};

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    if(id_kolom==('phase_id_'+i+'_'+indek)){
      isiEdit.phase_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      
    }else if(id_kolom==('cost_id_'+i+'_'+indek)){
      isiEdit.cost_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      
    }else if(id_kolom==('date_'+i+'_'+indek)){
      // alert(id_kolom);
      isiEdit.date=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      
    }else if(id_kolom==('expenses_'+i+'_'+indek)){
      isiEdit.expenses=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      
    }else if(id_kolom==('revenues_'+i+'_'+indek)){
      isiEdit.revenues=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      
    }else{
      baru.push(isi[i]);
    }
  }
  bingkai[indek].begin_detail=isi;
}

JobBegins.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].begin_detail;
  var newBasket=[];
  
  JobBegins.setRows(indek,oldBasket);
  for(var i=0;i<oldBasket.length;i++){
    if (i!=(number))newBasket.push(oldBasket[i])
  }
  JobBegins.setRows(indek,newBasket);
}

JobBegins.setPhase=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, data.phase_id);
  JobBegins.setCell(indek,id_kolom);
}

JobBegins.setCost=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, data.cost_id);
  JobBegins.setCell(indek,id_kolom);
}

JobBegins.setJob=(indek,data)=>{
  console.log(data);
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, data);
  JobBegins.getJob(indek);
}

JobBegins.getJob=(indek)=>{
  Jobs.getOne(indek,
    getEV('job_id_'+indek),
  (paket)=>{
    const d=paket.data;
    setEV('job_name_'+indek, d.job_name);
    setEC('use_phases_'+indek, d.use_phases);
  });
}

JobBegins.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>JobBegins.formPaging(indek));
  JobBegins.exportExecute(indek);
}

JobBegins.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'job_begins.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

JobBegins.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{JobBegins.formPaging(indek);});
  iii.uploadJSON(indek);
}

JobBegins.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "job_id":d[i][1],
      "begin_detail":d[i][2]
    }
    db3.query(indek,JobBegins.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}
/*EOF*/
