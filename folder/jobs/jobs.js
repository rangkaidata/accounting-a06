/*
 * name: budiono
 * date: sep-13, 12:08, wed-2023; new;
 * edit: sep-14, 14:05, thu-2023; 
 * edit: sep-16, 17:21, sat-2023; mod size;
 */ 

'use strict';

var Jobs={
  url:'jobs',
  title:'Jobs'
};

Jobs.show=(tiket)=>{
  tiket.modul=Jobs.url;
  tiket.menu.name=Jobs.title;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newCus=new BingkaiUtama(tiket);
    const indek=newCus.show();
    Jobs.formPaging(indek);
  }else{
    show(baru);
  }
}

Jobs.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Jobs.formCreate(indek));
  toolbar.search(indek,()=>Jobs.formSearch(indek));
  toolbar.refresh(indek,()=>Jobs.formPaging(indek));
  toolbar.download(indek,()=>Jobs.formExport(indek));
  toolbar.upload(indek,()=>Jobs.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    Jobs.readShow(indek);
  });
}

Jobs.readShow=(indek)=>{
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
        +' onclick="Jobs.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
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
        html+='<button type="button"'
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
    +'<th>Supervisor</th>'
    +'<th>Start<br>Date</th>'
    +'<th>Use<br>Phases</th>'
    +'<th>Owner</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].job_id+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].job_name)+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].supervisor)+'</td>'
        +'<td align="center">'
          +tglWest(paket.data[x].start_date)
          +'</td>'
        +'<td align="center">'
          +binerToBool(paket.data[x].use_phases)+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)+'</td>'
          
        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_change" '
          +' onclick="Jobs.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].job_id+'\');">'
          +'</button>'
          +'</td>'
          
        +'<td align="center">'
          +'<button type="button"'
          +' id="btn_delete"'
          +' onclick="Jobs.formDelete(\''+indek+'\''
          +' ,\''+paket.data[x].job_id+'\');">'
          +'</button>'
          +'</td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Jobs.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Jobs.formPaging(indek);
}

Jobs.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    +'<ul>'
    
    +'<li><label>Job ID: <i class="required">*</i></label>'
      +'<input type="text"'
      +' id="job_id_'+indek+'"'
      +' size="10"></li>'
      
    +'<li><label>Description:</label>'
      +'<input type="text"'
      +' id="job_name_'+indek+'"'
      +' size="25"></li>'
      
    +'<li><label>&nbsp;</label>'
      +'<label><input type="checkbox"'
      +' id="job_inactive_'+indek+'">Inactive</label></li>'
    
    +'</ul>'
      
//--      
    +'<div style="display:grid;grid-template-columns:repeat(2,1fr);'
    +'padding-bottom:20px;">' //b
    +'<div>'
    +'<ul>'
    +'<li><label>Supervisor:</label>'
      +'<input type="text"'
      +' id="supervisor_'+indek+'"'
      +' size="18"></li>'
      
    +'<li><label>Customer ID:</label>'
      +'<input type="text" '
      +' id="customer_id_'+indek+'" '
      +' onchange="Jobs.getCustomer(\''+indek+'\''
      +',\'customer_id_'+indek+'\')"'
      +' size="18">'

      +'<button type="button" id="btn_find" '
        +' onclick="Customers.lookUp(\''+indek+'\''
        +',\'customer_id_'+indek+'\');"></button>'

      +'<input type="text" '
      +' id="customer_name_'+indek+'" disabled '
      +' style="width:160px;">'
    +'</li>'
      
    +'<li><label>Start Date:</label>'
      +'<input type="date" id="start_date_'+indek+'"></li>'
      
    +'<li><label>End Date:</label>'
      +'<input type="date" id="end_date_'+indek+'"></li>'
    +'</ul>'
    +'</div>'
//--      
    +'<div>'
    +'<ul>'
    +'<li><label>Job Type:</label>'
      +'<input type="text" id="job_type_'+indek+'" size="9"></li>'
      
    +'<li><label>PO Number:</label>'
      +'<input type="text" id="po_number_'+indek+'" size="9"></li>'
      
    +'<li><label>% Complete:</label>'
      +'<input type="text"'
      +' id="percent_complete_'+indek+'" '
      +' style="text-align:center;"'
      +' size="5"></li>'
    +'</ul>'
    +'</div>'
    +'</div>'
//--
    +'<ul>'
    +'<li><label>&nbsp;</label>&nbsp;'
      +'<label><input type="checkbox" id="use_phases_'+indek+'"'
      +' onclick="Jobs.changePhases(\''+indek+'\')">Use Phases'
      +'</label></li>'
    
    +'</ul>'
    
    +'<details id="dtl_no_phases_'+indek+'">'
    +'<summary>Estimated</summary>'
    +'<ul>'
      +'<li><label>Expenses:</label>'
        +'<input type="text"'
        +' id="expenses_'+indek+'"'
        +' style="text-align:center;"'
        +' size="9"></li>'
        
      +'<li><label>Revenues:</label>'
        +'<input type="text"'
        +' id="revenues_'+indek+'"'
        +' style="text-align:center;"'
        +' size="9"></li>'
    +'</ul>'

    +'</details>'
    
    +'<details id="dtl_phases_'+indek+'">'
      +'<summary>Phases</summary>'
      +'<div id="job_detail_'+indek+'"'
      +' style="overflow-y:auto;" ></div>'
    +'</details>'
    
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);
  
  if(metode!=MODE_CREATE){
    document.getElementById("job_id_"+indek).disabled=true;
    document.getElementById("use_phases_"+indek).disabled=true;
  }else{
    document.getElementById("job_id_"+indek).focus();
  }
}

Jobs.changePhases=(indek)=>{
  if(document.getElementById('use_phases_'+indek).checked){
    document.getElementById('dtl_phases_'+indek).open=true;
    document.getElementById('dtl_no_phases_'+indek).open=false;
    Jobs.setRows(indek,bingkai[indek].job_detail);
  }else{
    document.getElementById('dtl_phases_'+indek).open=false;
    document.getElementById('dtl_no_phases_'+indek).open=true;
    Jobs.setRows(indek,[]);
  }
}

Jobs.formCreate=(indek)=>{
  bingkai[indek].job_detail=[];
  Jobs.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Jobs.formPaging(indek);});
  toolbar.save(indek,()=>{Jobs.createExecute(indek);});
}

Jobs.createExecute=(indek)=>{
  db3.createOne(indek,{
    "job_id":getEV("job_id_"+indek),
    "job_name":getEV("job_name_"+indek),
    "job_inactive":getEC("job_inactive_"+indek),
    "supervisor":getEV("supervisor_"+indek),
    "customer_id":getEV("customer_id_"+indek),
    "start_date":getEV("start_date_"+indek),
    "end_date":getEV("end_date_"+indek),
    "job_type":getEV("job_type_"+indek),
    "po_number":getEV("po_number_"+indek),
    "percent_complete":getEV("percent_complete_"+indek),
    "use_phases":getEC("use_phases_"+indek),
    "job_detail":bingkai[indek].job_detail,
    "expenses":getEV("expenses_"+indek),
    "revenues":getEV("revenues_"+indek),
    "custom_field":{
      'field_1':'new column'
    }
  })
}

Jobs.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "job_id":bingkai[indek].job_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0) {
      const data=paket.data;
      
      setEV('job_id_'+indek, data.job_id);
      setEV('job_name_'+indek, data.job_name);
      setEC('job_inactive_'+indek, data.job_inactive);
      
      setEV('supervisor_'+indek, data.supervisor);
      setEV('start_date_'+indek, data.start_date);
      setEV('end_date_'+indek, data.end_date);
      
      setEV('job_type_'+indek, data.job_type);
      setEV('po_number_'+indek, data.po_number);
      setEV('percent_complete_'+indek, data.percent_complete);
      
      setEC('use_phases_'+indek, data.use_phases);
      
      setEV('revenues_'+indek, data.revenues);
      setEV('expenses_'+indek, data.expenses);
      
      setEV('customer_id_'+indek, data.customer_id);
      setEV('customer_name_'+indek, data.customer_name);
      
      Jobs.setRows(indek,data.job_detail);

      if(getEC('use_phases_'+indek)){
        setEO('dtl_phases_'+indek, true);
        setEO('dtl_no_phases_'+indek, false);
      }else{
        setEO('dtl_phases_'+indek, false);
        setEO('dtl_no_phases_'+indek, true);
      }
      message.none(indek);
      return callback();
    }
  });
}

Jobs.formUpdate=(indek,job_id)=>{
  bingkai[indek].job_id=job_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Jobs.formEntry(indek,MODE_UPDATE);
  Jobs.readOne(indek,()=>{
    toolbar.back(indek,()=>{Jobs.formLast(indek);});
    toolbar.save(indek,()=>{Jobs.updateExecute(indek);})
  });
}

Jobs.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "job_id":bingkai[indek].job_id,
    "job_name":getEV("job_name_"+indek),
    "job_inactive":getEC("job_inactive_"+indek),
    "supervisor":getEV("supervisor_"+indek),
    "customer_id":getEV("customer_id_"+indek),
    "start_date":getEV("start_date_"+indek),
    "end_date":getEV("end_date_"+indek),
    "job_type":getEV("job_type_"+indek),
    "po_number":getEV("po_number_"+indek),
    "percent_complete":getEV("percent_complete_"+indek),
    "use_phases":getEC("use_phases_"+indek),
    "expenses":getEV("expenses_"+indek),
    "revenues":getEV("revenues_"+indek),
    "job_detail":bingkai[indek].job_detail,
    "custom_field":{"act":"edit"}
  });
}

Jobs.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Jobs.formPaging(indek):
  Jobs.formResult(indek);
}

Jobs.formDelete=(indek,job_id)=>{
  bingkai[indek].job_id=job_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Jobs.formEntry(indek,MODE_DELETE);
  Jobs.readOne(indek,()=>{
    toolbar.back(indek,()=>Jobs.formLast(indek));
    toolbar.delet(indek,()=>Jobs.deleteExecute(indek));
  });
}

Jobs.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "job_id":bingkai[indek].job_id
  });
}

Jobs.formSearch=(indek,txt)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Jobs.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Jobs.formPaging(indek));
}

Jobs.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Jobs.formResult(indek);
}

Jobs.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Jobs.formSearch(indek);});
  db3.search(indek,()=>{
    Jobs.readShow(indek);
  });
}

Jobs.setRows=(indek,isi)=>{
  if(isi===undefined)isi=[]; 
     
  var panjang=isi.length;
  var html=Jobs.tableHead(indek);
  
  bingkai[indek].job_detail=isi;
    
  for (var i=0;i<panjang;i++){

    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    
    +'<td>'
      +'<input type="text" id="phase_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].phase_id+'"'
      +' onchange="Jobs.setCell(\''+indek+'\''
      +',\'phase_id_'+i+'_'+indek+'\')"'
      +' style="text-align:left"'
      +' size="12">'
      +'</td>'

    +'<td>'
      +'<button type="button" id="btn_find" '
      +' onclick="Phases.lookUp(\''+indek+'\''
      +',\'phase_id_'+i+'_'+indek+'\');">'
      +'</button>'
      +'</td>'

    +'<td>'
      +'<input type="text" id="cost_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].cost_id+'"'
      +' onchange="Jobs.setCell(\''+indek+'\''
      +',\'cost_id_'+i+'_'+indek+'\')"'
      +' style="text-align:left"'
      +' size="12" >'
      +'</td>'

    +'<td>'
      +'<button type="button" id="btn_find" '
      +' onclick="Costs.lookUp(\''+indek+'\''
      +',\'cost_id_'+i+'_'+indek+'\');">'
      +'</button>'
      +'</td>'
      
    +'<td style="margin:0;padding:0" align="center">'
      +'<input type="text" id="units_'+i+'_'+indek+'"'
      +' value="'+isi[i].units+'"'
      +' onchange="Jobs.setCell(\''+indek+'\''
      +',\'units_'+i+'_'+indek+'\')"'
      +' style="text-align:center"'
      +' size="4">'
      +'</td>'    
      
    +'<td style="margin:0;padding:0" align="center">'
      +'<input type="text" id="expenses_'+i+'_'+indek+'"'
      +' value="'+isi[i].expenses+'"'
      +' onchange="Jobs.setCell(\''+indek+'\''
      +',\'expenses_'+i+'_'+indek+'\')"'
      +' style="text-align:center"'
      +' size="6">'
      +'</td>'    

    +'<td style="margin:0;padding:0" align="center">'
      +'<input type="text" id="revenues_'+i+'_'+indek+'" '
      +' value="'+isi[i].revenues+'"'
      +' onchange="Jobs.setCell(\''+indek+'\''
      +',\'revenues_'+i+'_'+indek+'\')"'
      +' style="text-align:center"'
      +' size="6">'
      +'</td>'

    +'<td align="center">'
      +'<button type="button" id="btn_add" '
      +' onclick="Jobs.addRow(\''+indek+'\','+i+')" >'
      +'</button>'
      
      +'<button type="button" id="btn_remove" '
      +' onclick="Jobs.removeRow(\''+indek+'\','+i+')" >'
      +'</button>'
      +'</td>'
    +'</tr>';
  }
  
  html+=Jobs.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('job_detail_'+indek).innerHTML=html;
  
  if(panjang==0)Jobs.addRow(indek,0);
}

Jobs.newRow=(oldBasket,newBasket)=>{
  var myItem={};
  myItem.row_id=oldBasket.length+1;
  myItem.phase_id="";
  myItem.cost_id="";
  myItem.units='';
  myItem.expenses='';
  myItem.revenues='';
  newBasket.push(myItem);        
}

Jobs.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  oldBasket=bingkai[indek].job_detail;
  
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris)Jobs.newRow(oldBasket,newBasket);
  }

  if(newBasket.length==0)Jobs.newRow(oldBasket,newBasket);
  Jobs.setRows(indek,newBasket);
}

Jobs.tableHead=(indek)=>{
  return '<table>'
  +'<thead>'
    +'<tr>'
    +'<th>No.</th>'
    +'<th colspan="2">Phases ID</th>'
    +'<th colspan="2">Cost ID</th>'
    +'<th>Unit</th>'
    +'<th>Expenses</th>'
    +'<th>Revenues</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
  +'</thead>';
}

Jobs.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan="7">&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

Jobs.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].job_detail;
  var newBasket=[];
  
  Jobs.setRows(indek,oldBasket);
  for(let i=0;i<oldBasket.length;i++){
    if (i!=(number)){
      newBasket.push(oldBasket[i]);
    }
  }
  Jobs.setRows(indek,newBasket);
}

Jobs.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].job_detail;
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
      
    }else if(id_kolom==('units_'+i+'_'+indek)){
      // alert(id_kolom);
      isiEdit.units=document.getElementById(id_kolom).value;
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
  bingkai[indek].job_detail=isi;
}

Jobs.setCost=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, data.cost_id);
  Jobs.setCell(indek,id_kolom);
}

Jobs.setPhase=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, data.phase_id);
  Jobs.setCell(indek,id_kolom);
}

Jobs.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Jobs.formPaging(indek));
  Jobs.exportExecute(indek);
}

Jobs.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'jobs.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Jobs.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Jobs.formPaging(indek);});
  iii.uploadJSON(indek);
}

Jobs.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={      
      "job_id":d[i][1],
      "job_name":d[i][2],
      "job_inactive":d[i][3],
      "supervisor":d[i][4],
      "customer_id":d[i][5],
      "start_date":d[i][6],
      "end_date":d[i][7],
      "job_type":d[i][8],
      "po_number":d[i][9],
      "percent_complete":d[i][10],
      "use_phases":d[i][11],
      "expenses":d[i][12],
      "revenues":d[i][13],
      "job_detail":d[i][14],
      "custom_field":d[i][15]
    }
    db3.query(indek,Jobs.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Jobs.setCustomer=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, data.customer_id);
  Jobs.getCustomer(indek,id_kolom);
}

Jobs.getCustomer=(indek,id_kolom)=>{
  setEV('customer_name_'+indek, undefined);
  Customers.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    if(paket.count!=0){
      setEV('customer_name_'+indek, paket.data.customer_name);
    }
  });
}

Jobs.getOne=(indek,job_id,callBack)=>{
  db3.query(indek,Jobs.url+'/read_one',{
    "job_id":job_id
  },(paket)=>{
    return callBack(paket);
  });
}

// eof: 709;
