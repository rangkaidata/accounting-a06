/*
 * name: budiono
 * date: oct-13, 17:04, frin-2023; new;
 */ 
 
'use strict';

var Adjustments={
  title:'Inventory Adjustments',
  url:'adjustments'
};

Adjustments.show=(karcis)=>{
  karcis.modul=Adjustments.url;
  karcis.menu.name=Adjustments.title;
  karcis.child_free=false;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newTxs=new BingkaiUtama(karcis);
    const indek=newTxs.show();
    Adjustments.formPaging(indek);
  }else{
    show(baru);
  }
}

Adjustments.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>{Adjustments.formCreate(indek);});
  toolbar.search(indek,()=>{Adjustments.formSearch(indek);});
  toolbar.refresh(indek,()=>{Adjustments.formPaging(indek);});
  toolbar.download(indek,()=>{Adjustments.formExport(indek);});
  toolbar.upload(indek,()=>{Adjustments.formImport(indek);});
  toolbar.more(indek,()=>{Menu.more(indek);});  
  db3.readPaging(indek,()=>{
    Adjustments.readShow(indek);
  });
}

Adjustments.readShow=(indek)=>{
  const metode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';
    
  if (paket.err.id===0){
    if (metode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button" id="btn_first" '
        +' onclick="Adjustments.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Adjustments.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page +'</button>'; 
        } else {
          html+= '<button type="button" '
          +' onclick="Adjustments.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last" '
        +' onclick="Adjustments.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Location ID</th>'
    +'<th>Date</th>'
    +'<th>Adjustment #</th>'
    +'<th>Amount</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan="2">Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].location_id+'</td>'
        +'<td align="center">'
          +tglWest(paket.data[x].adjustment_date)
          +'</td>'
        +'<td align="left">'+paket.data[x].adjustment_no+'</td>'
        +'<td align="right">'+paket.data[x].adjustment_qty+'</td>'
        
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)+'</td>'

        +'<td align="center"><button type="button" id="btn_change" '
          +' onclick="Adjustments.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].adjustment_no+'\''
          +',\''+paket.data[x].location_id+'\''
          +');"></button></td>'
          
        +'<td align="center"><button type="button" id="btn_delete" '
          +' onclick="Adjustments.formDelete(\''+indek+'\''
          +',\''+paket.data[x].adjustment_no+'\''
          +',\''+paket.data[x].location_id+'\''
          +');"></button></td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Adjustments.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Adjustments.formPaging(indek);
}

Adjustments.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" '
      +' style="margin-bottom:1rem;line-height:1.5rem;"></div>'
      
    +'<form autocomplete="off">'
    +'<div style="display:grid;'
      +'grid-template-columns:repeat(2,1fr);'
      +'padding-bottom:10px;">'
      
      +'<div>'
        +'<ul>'
          +'<li><label>Adjustment #<i class="required">*</i>:</label>'
            +'<input type="text" size="9"'
            +' id="adjustment_no_'+indek+'">'
          +'</li>'
          +'<li>'
            +'<label>Date:</label>'
            +'<input type="date" id="adjustment_date_'+indek+'">'
          +'</li>'
        +'</ul>'
      +'</div>'
      
      +'<div>'
        +'<ul>'
          +'<li>'
            +'<label>Location ID:</label>'
            +'<input type="text" size="7"'
              +' onchange="Adjustments.getLocation(\''+indek+'\''
              +',\'location_id_'+indek+'\')"'
              +' id="location_id_'+indek+'">'
            +'<button type="button" id="btn_find" '
              +' onclick="Locations.lookUp(\''+indek+'\''
              +',\'location_id_'+indek+'\',-1)"></button>'
            +'<input type="text" '
              +' id="location_name_'+indek+'" disabled>'
          +'</li>'
        +'</ul>'      
      +'</div>'
    +'</div>'

    +'<details open>'
      +'<summary>Adjustment Details</summary>'
      +'<div id="adjustment_detail_'+indek+'"'
      +' style="width:100%;overflow:auto;">Move Details</div>'
    +'</details>'

    +'<ul>'
      +'<li>'
        +'<label>Employee ID:</label>'
        +'<input type="text" size="7"'
          +' onchange="Adjustments.getEmployee(\''+indek+'\''
          +',\'employee_id_'+indek+'\')"'
          +' id="employee_id_'+indek+'">'
        +'<button type="button" id="btn_find" '
          +' onclick="Employees.lookUp(\''+indek+'\''
          +',\'employee_id_'+indek+'\',-1)"></button>'
        +'<input type="text" '
          +' id="employee_name_'+indek+'" disabled>'
      +'</li>'
      +'<li><label>Reason:</label>'
        +'<input type="text"'
        +' id="adjustment_note_'+indek+'"'
        +' size="50">'
      +'</li>'
    +'</ul>'

    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);

  document.getElementById('adjustment_no_'+indek).focus();
  document.getElementById('adjustment_date_'+indek).value=tglSekarang();
}

Adjustments.formCreate=(indek)=>{
  Adjustments.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Adjustments.formPaging(indek);});
  toolbar.save(indek,()=>{Adjustments.createExecute(indek);});
  Adjustments.setRows(indek,[]);
}

Adjustments.createExecute=(indek)=>{
  db3.createOne(indek,{    
    "adjustment_no":getEV("adjustment_no_"+indek),
    "adjustment_date":getEV("adjustment_date_"+indek),
    "location_id":getEV("location_id_"+indek),
    "adjustment_detail":bingkai[indek].adjustment_detail,
    "employee_id":getEV("employee_id_"+indek),
    "adjustment_note":getEV("adjustment_note_"+indek)
  });
}

Adjustments.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "location_id":bingkai[indek].location_id,
    "adjustment_no":bingkai[indek].adjustment_no
  },(paket)=>{
    if (paket.err.id==0 || paket.count>0){
      const d=paket.data;
      setEV('adjustment_no_'+indek, d.adjustment_no);
      setEV('adjustment_date_'+indek, d.adjustment_date);      
      setEV('location_id_'+indek, d.location_id);
      setEV('location_name_'+indek, d.location_name);
      setEV('employee_id_'+indek, d.employee_id);
      setEV('employee_name_'+indek, d.employee_name);
      setEV('adjustment_note_'+indek, d.adjustment_note);
      Adjustments.setRows(indek,d.adjustment_detail);
    }
  });
  message.none(indek);
  return callback();
}

Adjustments.formUpdate=(indek,adjustment_no,location_id)=>{
  bingkai[indek].adjustment_no=adjustment_no;
  bingkai[indek].location_id=location_id;
  toolbar.none(indek);
  toolbar.hide(indek);  
  Adjustments.formEntry(indek,MODE_UPDATE);
  Adjustments.readOne(indek,()=>{
    toolbar.back(indek,()=>{Adjustments.formLast(indek);});
    toolbar.save(indek,()=>{Adjustments.updateExecute(indek);});
  });
}

Adjustments.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "edit_adjustment_no":bingkai[indek].adjustment_no,
    "edit_location_id":bingkai[indek].location_id,
    // modified
    "adjustment_no":getEV("adjustment_no_"+indek),
    "adjustment_date":getEV("adjustment_date_"+indek),
    "location_id":getEV("location_id_"+indek),
    "adjustment_detail":bingkai[indek].adjustment_detail,
    "employee_id":getEV("employee_id_"+indek),
    "adjustment_note":getEV("adjustment_note_"+indek)
  });
}

Adjustments.formDelete=(indek,adjustment_no,location_id)=>{
  bingkai[indek].adjustment_no=adjustment_no;
  bingkai[indek].location_id=location_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Adjustments.formEntry(indek,MODE_DELETE);
  Adjustments.readOne(indek,()=>{
    toolbar.back(indek,()=>{Adjustments.formLast(indek);});
    toolbar.delet(indek,()=>{Adjustments.deleteExecute(indek);});
  });
}

Adjustments.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "adjustment_no":bingkai[indek].adjustment_no,
    "location_id":bingkai[indek].location_id
  });
}

Adjustments.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Adjustments.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Adjustments.formPaging(indek));
}

Adjustments.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Adjustments.formResult(indek);
}

Adjustments.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Adjustments.formSearch(indek));
  db3.search(indek,()=>{
    Adjustments.readShow(indek);
  });
}

Adjustments.formLast=function(indek){
  bingkai[indek].text_search==''?
  Adjustments.formPaging(indek):
  Adjustments.formResult(indek);
}

Adjustments.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Adjustments.formPaging(indek));
  Adjustments.exportExecute(indek);
}

Adjustments.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'adjustments.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Adjustments.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Adjustments.formPaging(indek);});
  iii.uploadJSON(indek);
}

Adjustments.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "adjustment_no":d[i][1],
      "adjustment_date":d[i][2],
      "location_id":d[i][3],
      "adjustment_detail":d[i][4],
      "employee_id":d[i][5],
      "adjustment_note":d[i][6]
    }
    db3.query(indek,Adjustments.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Adjustments.setLocation=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const id_baris=bingkai[indek].id_baris;

  setEV(id_kolom, data.location_id);
  Adjustments.getLocation(indek,id_kolom,id_baris);
}

Adjustments.getLocation=(indek,id_kolom,baris)=>{
  Locations.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    if(paket.err.id==0){
      setEV('location_name_'+indek, paket.data.location_name);
    }
  });
}

Adjustments.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const id_baris=bingkai[indek].id_baris;
  setEV(id_kolom, data.account_id);
  //Adjustments.getAccount(indek,id_kolom,id_baris);
  Adjustments.setCell(indek,id_kolom);  
}
/*
Adjustments.getAccount=(indek,id_kolom,baris)=>{
  Accounts.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    if(paket.err.id==0){
      // setEV('cogs_account_name_'+indek, paket.data.account_name);
    }
  });
}*/

Adjustments.setRows=(indek,isi)=>{
  if(isi===undefined) isi=[];
  var panjang=isi.length;
  var html=Adjustments.tableHead(indek);
  
  bingkai[indek].adjustment_detail=isi;
  for (var i=0;i<panjang;i++){
    html+='<tr>'
      +'<td align="center">'+(i+1)+'</td>'

      +'<td style="margin:0;padding:0">'
        +'<input type="text" id="item_id_'+i+'_'+indek+'" '
        +' value="'+isi[i].item_id+'" size="9"'
        +'onchange="Adjustments.setCell(\''+indek+'\''
        +',\'item_id_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()"></td>'

      +'<td><button type="button" id="btn_find" '
      +' onclick="StockItems.lookUp(\''+indek+'\''
      +',\'item_id_'+i+'_'+indek+'\',\''+i+'\')"></button></td>'
      
      +'<td style="padding:0;margin:0;">'
        +'<input type="text" id="item_name_'+i+'_'+indek+'" '
        +' value="'+isi[i].item_name+'" disabled></td>'
        
    +'<td align="center" style="padding:0;margin:0;" >'
      +'<input type="text"'
      +' id="cogs_account_id_'+i+'_'+indek+'" '
      +' value="'+isi[i].cogs_account_id+'"'
      +' onchange="Adjustments.setCell(\''+indek+'\''
      +',\'cogs_account_id_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()" '
      +' style="text-align:center"'
      +' size="8"></td>'
      
      +'<td>'
        +'<button type="button"'
          +' id="btn_find" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'cogs_account_id_'+i+'_'+indek+'\');">'
        +'</button>'
        +'</td>'

      +'<td  align="center" style="padding:0;margin:0;">'
        +'<input type="text" id="unit_cost_'+i+'_'+indek+'" '
        +' value="'+isi[i].unit_cost+'" size="3" '
        +' style="text-align:center"'
        +' onchange="Adjustments.setCell(\''+indek+'\''
        +',\'unit_cost_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()" ></td>'
              
      +'<td  align="center" style="padding:0;margin:0;">'
        +'<input type="text" id="qty_adjust_'+i+'_'+indek+'" '
        +' value="'+isi[i].qty_adjust+'" size="3" '
        +' style="text-align:center"'
        +' onchange="Adjustments.setCell(\''+indek+'\''
        +',\'qty_adjust_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()" ></td>'
        
      +'<td style="margin:0;padding:0">'
        +'<input type="text" id="job_phase_cost_'+i+'_'+indek+'" '
        +' value="'+isi[i].job_phase_cost+'" size="6"'
        +'onchange="Adjustments.setCell(\''+indek+'\''
        +',\'job_phase_cost_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()"></td>'

      +'<td><button type="button" id="btn_find" '
        +' onclick="Jobs.lookUp(\''+indek+'\''
        +',\'job_phase_cost_'+i+'_'+indek+'\',\''+i+'\')">'
        +'</button></td>'
      
      +'<td align="center">'
        +'<button type="button" id="btn_add" '
        +' onclick="Adjustments.addRow(\''+indek+'\','+i+')" >'
        +'</button>'
        
        +'<button type="button" id="btn_remove" '
        +' onclick="Adjustments.removeRow(\''+indek+'\','+i+')" >'
        +'</button>'
      +'</td>'
      
      +'<td style="display:none;">'
        +'<input type="text" '
        +' id="inventory_account_id_'+i+'_'+indek+'"'
        +' value="'+isi[i].inventory_account_id+'"'
        +' onchange="Adjustments.setCell(\''+indek+'\''
        +',\'inventory_account_id_'+i+'_'+indek+'\')" '
        +' disabled>'
        
        +'<input type="text" '
        +' id="cogs_account_id_'+i+'_'+indek+'"'
        +' value="'+isi[i].cogs_account_id+'"'
        +' onchange="Adjustments.setCell(\''+indek+'\''
        +',\'cogs_account_id_'+i+'_'+indek+'\')" '
        +' disabled>'
      +'</td>'
      +'</tr>';
  }
  html+=Adjustments.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('adjustment_detail_'+indek).innerHTML=html;
  if(panjang==0)Adjustments.addRow(indek,0);
}

Adjustments.tableHead=(indek)=>{
  return '<table>'
    +'<thead>'
    +'<tr>'
    +'<th colspan=3>Item ID <i class="required">*</i></th>'
    +'<th>Description</th>'
    +'<th colspan="2">COGS<br>Account ID</th>'
    +'<th>Unit<br>Cost</th>'
    +'<th>Adjust<br>Quantity</th>'
    +'<th colspan=2>Job</th>'
    +'<th>Add/Rem</th>'
    +'<th style="display:none;">account_id(hide)</th>'
    +'</tr>'
    +'</thead>';
}

Adjustments.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td>#</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

Adjustments.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].adjustment_detail;
  
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris)Adjustments.newRow(newBasket);
  }
  if(oldBasket.length==0)Adjustments.newRow(newBasket);
  Adjustments.setRows(indek,newBasket);
}

Adjustments.newRow=(newBasket)=>{
  var myItem={};
  myItem.row_id=newBasket.length+1;
  myItem.item_id="";
  myItem.item_name="";
  myItem.cogs_account_id="";
  myItem.inventory_account_id="";
  myItem.unit_cost=0;
  myItem.qty_adjust=0;
  myItem.job_phase_cost="";
  newBasket.push(myItem);
}

Adjustments.removeRow=(indek,number)=>{
  var arr=bingkai[indek].adjustment_detail;
  var newBasket=[];

  Adjustments.setRows(indek,arr);
  for(let i=0;i<arr.length;i++){
    if(i!==number)newBasket.push(arr[i]);
  }
  Adjustments.setRows(indek,newBasket);
}

Adjustments.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].adjustment_detail;
  var baru=[];
  var isiEdit={};

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    if(id_kolom==('item_id_'+i+'_'+indek)){
      isiEdit.item_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      Adjustments.getItem(indek,'item_id_'+i+'_'+indek,i);
    }
    else if(id_kolom==('item_name_'+i+'_'+indek)){
      isiEdit.item_name=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('unit_cost_'+i+'_'+indek)){
      isiEdit.unit_cost=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('qty_adjust_'+i+'_'+indek)){
      isiEdit.qty_adjust=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('job_phase_cost_'+i+'_'+indek)){
      isiEdit.job_phase_cost=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('inventory_account_id_'+i+'_'+indek)){
      isiEdit.inventory_account_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('cogs_account_id_'+i+'_'+indek)){
      isiEdit.cogs_account_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else{
      baru.push(isi[i]);
    }
  }
  bingkai[indek].adjustment_detail=isi;
}

Adjustments.setStockItem=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;

  setEV(id_kolom, data.item_id);
  Adjustments.setCell(indek,id_kolom);
}

Adjustments.getItem=(indek,id_kolom,baris)=>{
  Items.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    const d=paket.data;
    setEV('item_name_'+baris+'_'+indek, d.item_name);
    setEV('inventory_account_id_'+baris+'_'+indek, d.inventory_account_id);
    setEV('cogs_account_id_'+baris+'_'+indek, d.cogs_account_id);
    
    Adjustments.setCell(indek,'item_name_'+baris+'_'+indek);
    Adjustments.setCell(indek,'inventory_account_id_'+baris+'_'+indek);
    Adjustments.setCell(indek,'cogs_account_id_'+baris+'_'+indek);
  });
}

Adjustments.setJob=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, data);
  Adjustments.setCell(indek,id_kolom);
}

Adjustments.setEmployee=(indek,d)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, d.employee_id);
  Adjustments.getEmployee(indek);
}

Adjustments.getEmployee=(indek)=>{
  setEV('employee_name_'+indek, '');
  Employees.getOne(indek,getEV('employee_id_'+indek),(paket)=>{
    if(paket.count>0){
      var d=paket.data;
      setEV('employee_name_'+indek, d.employee_name);      
    }
  });
}
/*EOF*/
