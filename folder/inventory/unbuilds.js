/*
 * name: budiono
 * date: oct 13, 09:40, fri-2023; new;
 * edit: oct-13, 09:47, fri-2023; xHTML;
 */ 
 
'use strict';

var Unbuilds={
  url:'unbuilds',
  title:'Unbuild Assemblies',
}

Unbuilds.show=(karcis)=>{
  karcis.modul=Unbuilds.url;
  karcis.menu.name=Unbuilds.title;
  karcis.child_free=false;

  const baru=exist(karcis);
  if(baru==-1){
    const newTxs=new BingkaiUtama(karcis);
    const indek=newTxs.show();
    Unbuilds.formPaging(indek);
  }else{
    show(baru);
  }
}

Unbuilds.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>{Unbuilds.formCreate(indek);});
  toolbar.search(indek,()=>{Unbuilds.formSearch(indek);});
  toolbar.refresh(indek,()=>{Unbuilds.formPaging(indek);});
  toolbar.download(indek,()=>{Unbuilds.formExport(indek);});
  toolbar.upload(indek,()=>{Unbuilds.formImport(indek);});
  toolbar.more(indek,()=>{Menu.more(indek);});
  db3.readPaging(indek,()=>{
    Unbuilds.readShow(indek);
  });
}

Unbuilds.readShow=(indek)=>{
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
        +' onclick="Unbuilds.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Unbuilds.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page +'</button>';  
        } else {
          html+= '<button type="button" '
          +' onclick="Unbuilds.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last" '
        +' onclick="Unbuilds.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }

  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="3">Unbuild No.</th>'
    +'<th>Date</th>'
    +'<th>Item Name</th>'
    +'<th>Qty Unbuild</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].location_id+'</td>'
        +'<td align="left">'+paket.data[x].unbuild_no+'</td>'
        +'<td align="left">'+tglWest(paket.data[x].unbuild_date)+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].item_name)+'</td>'
        +'<td align="center">'+paket.data[x].unbuild_qty+'</td>'
        
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)+'</td>'
        +'<td align="center"><button type="button" '
          +' id="btn_change" onclick="Unbuilds.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].unbuild_no+'\''
          +',\''+paket.data[x].location_id+'\''
          +',\''+paket.data[x].item_id+'\''
          +');"></button></td>'
        +'<td align="center"><button type="button" '
          +' id="btn_delete" onclick="Unbuilds.formDelete(\''+indek+'\''
          +',\''+paket.data[x].unbuild_no+'\''
          +',\''+paket.data[x].location_id+'\''
          +',\''+paket.data[x].item_id+'\''
          +');"></button></td>'
        +'</tr>';
    }
  }

  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Unbuilds.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Unbuilds.formPaging(indek);
}

Unbuilds.formEntry=(indek,metode)=>{
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

      +'<div><ul>'

      +'<li><label>Item ID:</label>'
        +'<input type="text" size="9"'
        +' id="item_id_'+indek+'" '
        +' onchange="Unbuilds.getBom(\''+indek+'\');">'
        
        +'<button type="button" id="btn_find" '
        +' onclick="Boms.lookUp(\''+indek+'\''
        +',\'item_id_'+indek+'\',-1)"></button>'        
        
        +'<input type="text" id="item_name_'+indek+'" disabled>'
        +'</li>'
        
      +'<li><label>Quantity:</label>'
        +'<input type="text" size="3"'
        +' style="text-align:center;"'
        +' id="unbuild_qty_'+indek+'" '
        +' onchange="Unbuilds.setCell(\''+indek+'\')">'
        +'</li>'
      +'</ul></div>'

      +'<div><ul>'
        +'<li><label>Date:</label>'
          +'<input type="date" id="unbuild_date_'+indek+'">'
          +'</li>'
          
        +'<li><label>Unbuild No.:</label>'
          +'<input type="text" size="9"'
          +' id="unbuild_no_'+indek+'">'
          +'</li>'
          
        +'<li><label>Location ID:</label>'
          +'<input type="text" size="9"'
          +' id="location_id_'+indek+'">'
                    
          +'<button type="button" id="btn_find" '
          +' onclick="Locations.lookUp(\''+indek+'\''
          +',\'location_id_'+indek+'\',-1)"></button>'
          +'</li>'
      
      +'</ul></div>'
    +'</div>'
    
    +'<details open>'
      +'<summary>Details</summary>'
      +'<div id="unbuild_detail_'+indek+'"'
      +' style="width:100%;overflow:auto;">bom detail</div>'
    +'</details>'
    
    +'<ul>'
    +'<li><label>Supervisor:</label>'
      +'<input type="text" size="9"'
      +' id="employee_id_'+indek+'"'
      +' onchange="Builds.getEmployee(\''+indek+'\')">'
      
      +'<button type="button" id="btn_find" '
      +' onclick="Employees.lookUp(\''+indek+'\''
      +',\'employee_id_'+indek+'\',-1)"></button>'
      
      +'<input type="text" id="employee_name_'+indek+'" disabled>'
      +'</li>'

    +'<li><label>Reason:</label>'
      +'<input type="text" id="unbuild_note_'+indek+'" size="50%"></li>'
    
    +'</ul>'
    
    +'</form>'
    +'</div>';
  content.html(indek,html);
  statusbar.ready(indek);
  
  document.getElementById('item_id_'+indek).focus();
  document.getElementById('unbuild_date_'+indek).value=tglSekarang();
}

Unbuilds.formCreate=(indek)=>{
  Unbuilds.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Unbuilds.formPaging(indek);});
  toolbar.save(indek,()=>{Unbuilds.createExecute(indek);});
  
  bingkai[indek].isiTabel=[];
  Unbuilds.setRows(indek,[]);
}

Unbuilds.createExecute=(indek)=>{
  db3.createOne(indek,{
    "item_id":getEV("item_id_"+indek),
    "unbuild_qty":getEV("unbuild_qty_"+indek),
    "unbuild_date":getEV("unbuild_date_"+indek),
    "unbuild_no":getEV("unbuild_no_"+indek),
    "location_id":getEV("location_id_"+indek),
    "employee_id":getEV("employee_id_"+indek),
    "unbuild_note":getEV("unbuild_note_"+indek)
  });
}

Unbuilds.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "unbuild_no":bingkai[indek].unbuild_no,
    "location_id":bingkai[indek].location_id,
    "item_id":bingkai[indek].item_id,
  },(paket)=>{
    if (paket.err.id==0 && paket.count!=0){
      const d=paket.data;
      setEV('unbuild_no_'+indek, d.unbuild_no);
      setEV('unbuild_date_'+indek, d.unbuild_date);
      setEV('unbuild_qty_'+indek, d.unbuild_qty);
      
      setEV('item_id_'+indek, d.item_id);
      setEV('item_name_'+indek, d.item_name);
      
      setEV('location_id_'+indek, d.location_id);
      setEV('unbuild_note_'+indek, d.unbuild_note);
      setEV('employee_id_'+indek, d.employee_id);
      
      Unbuilds.setRows(indek,d.unbuild_detail);
    }
    message.none(indek);
    return callback();
  });
}

Unbuilds.formUpdate=(indek,unbuild_no,location_id,item_id)=>{
  bingkai[indek].unbuild_no=unbuild_no;
  bingkai[indek].location_id=location_id;
  bingkai[indek].item_id=item_id;

  toolbar.none(indek);
  toolbar.hide(indek);  
  Unbuilds.formEntry(indek,MODE_UPDATE);
  Unbuilds.readOne(indek,()=>{
    toolbar.back(indek,()=>{Unbuilds.formLast(indek);});
    toolbar.save(indek,()=>{Unbuilds.updateExecute(indek);});
  });
}

Unbuilds.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "edit_location_id":bingkai[indek].location_id,
    "edit_unbuild_no":bingkai[indek].unbuild_no,
    "edit_item_id":bingkai[indek].item_id,
    // modified
    "item_id":getEV("item_id_"+indek),
    "unbuild_qty":getEV("unbuild_qty_"+indek),
    "unbuild_date":getEV("unbuild_date_"+indek),
    "unbuild_no":getEV("unbuild_no_"+indek),
    "location_id":getEV("location_id_"+indek),
    "employee_id":getEV("employee_id_"+indek),
    "unbuild_note":getEV("unbuild_note_"+indek)
  });
}

Unbuilds.formDelete=(indek,unbuild_no,location_id,item_id)=>{
  bingkai[indek].unbuild_no=unbuild_no;
  bingkai[indek].location_id=location_id;
  bingkai[indek].item_id=item_id;

  toolbar.none(indek);
  toolbar.hide(indek);  
  Unbuilds.formEntry(indek,MODE_DELETE);
  Unbuilds.readOne(indek,()=>{
    toolbar.back(indek,()=>{Unbuilds.formLast(indek);});
    toolbar.delet(indek,()=>{Unbuilds.deleteExecute(indek);});
  });
}

Unbuilds.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "location_id":bingkai[indek].location_id,
    "unbuild_no":bingkai[indek].unbuild_no,
    "item_id":bingkai[indek].item_id,
  });
}

Unbuilds.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Unbuilds.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Unbuilds.formPaging(indek);});
}

Unbuilds.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Unbuilds.formResult(indek);
}

Unbuilds.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Unbuilds.formSearch(indek);});
  db3.search(indek,()=>{
    Unbuilds.readShow(indek);
  });
}

Unbuilds.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Unbuilds.formPaging(indek):
  Unbuilds.formResult(indek);
}

Unbuilds.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Unbuilds.formPaging(indek));
  Unbuilds.exportExecute(indek);
}

Unbuilds.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'unbuilds.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Unbuilds.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,function(){Unbuilds.formPaging(indek);});
  iii.uploadJSON(indek);
}

Unbuilds.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "item_id":d[i][1],
      "unbuild_qty":d[i][2],
      "unbuild_date":d[i][3],
      "unbuild_no":d[i][4],
      "location_id":d[i][5],
      "employee_id":d[i][6],
      "unbuild_note":d[i][7]
    }
    db3.query(indek,Unbuilds.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Unbuilds.setRows=(indek,isi)=>{
  if(isi===undefined) isi=[];
  
  var panjang=isi.length;
  var html=Unbuilds.tableHead(indek);
  var qty_required=0;
  var qty_unbuild=getEV('unbuild_qty_'+indek);
  
  // convert to number
  if(isNaN(Number(qty_unbuild)))qty_unbuild=0;

  bingkai[indek].isiTabel=isi;
  
  for (var i=0;i<panjang;i++){
    qty_required=Number(isi[i].qty_needed)*qty_unbuild;

    html+='<tr>'
      +'<td align="center">'+(i+1)+'</td>'
      
      +'<td>'+isi[i].item_id+'</td>'
      +'<td>'+xHTML(isi[i].item_name)+'</td>'
      +'<td align="center">'+isi[i].qty_needed+'</td>'
      +'<td align="center">'+qty_required+'</td>'
      +'</td>'
      +'</tr>';
  }
  html+=Unbuilds.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('unbuild_detail_'+indek).innerHTML=html;
  
  if(panjang==0) Unbuilds.addRow(indek,0);
}

Unbuilds.tableHead=function(indek){
  return '<table>'
    +'<thead>'
    +'<tr>'
    +'<th>No.</th>'
    +'<th>Item ID</th>'
    +'<th>Item Name</th>'
    +'<th>Qty Needed</th>'
    +'<th>Qty Required</th>'
    +'</tr>'
    +'</thead>';
}

Unbuilds.tableFoot=function(indek){
  return '<tfoot>'
    +'<tr>'
    +'<td colspan=6>&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

Unbuilds.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];

  oldBasket=bingkai[indek].isiTabel;

  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris)Unbuilds.newRow(newBasket);
  }
  if(oldBasket.length==0)Unbuilds.newRow(newBasket);
  Unbuilds.setRows(indek,newBasket);
}

Unbuilds.newRow=(newBasket)=>{    
  var myItem={};
  myItem.row_id=newBasket.length+1;
  myItem.item_id="";
  myItem.item_name="";
  myItem.qty_needed=0;
  myItem.qty_required=0;
  newBasket.push(myItem);
}

Unbuilds.setCell=function(indek){
  var isi=bingkai[indek].isiTabel;
  var baru = [];
  var isiEdit = {};
  var qty_unbuild=getEV('unbuild_qty_'+indek);
  if(isNaN(Number(qty_unbuild)))qty_unbuild=0;
  
  for (var i=0;i<isi.length; i++){
    isiEdit = isi[i];
    if(isNaN(Number(isi[i].qty_needed))) isi[i].qty_needed=0;
    // calculate
    isiEdit.qty_required=isi[i].qty_needed*qty_unbuild;
    baru.push(isiEdit);
  }
  
  bingkai[indek].isiTabel=baru;
  Unbuilds.setRows(indek,baru);
}

Unbuilds.setLocation=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const id_baris=bingkai[indek].id_baris;

  setEV(id_kolom, data.location_id);
}

Unbuilds.setBom=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const id_baris=bingkai[indek].id_baris;

  setEV(id_kolom, data.item_id);
  setEV('item_name_'+indek, data.item_name);

  Unbuilds.getBom(indek);
}

Unbuilds.getBom=(indek)=>{
  Boms.getOne(indek,getEV('item_id_'+indek),(paket)=>{
    if(paket.err.id==0 && paket.count!=0){
      const d=paket.data;
      setEV('item_name_'+indek, d.item_name);
      Unbuilds.setRows(indek, d.bom_detail);
    }else{
      Unbuilds.setRows(indek,[]);
    }
  });
}

Unbuilds.setEmployee=(indek,d)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, d.employee_id);
  Unbuilds.getEmployee(indek);
}

Unbuilds.getEmployee=(indek)=>{
  setEV('employee_name_'+indek, '');
  Employees.getOne(indek,getEV('employee_id_'+indek),(paket)=>{
    if(paket.count>0){
      var d=paket.data;
      setEV('employee_name_'+indek, d.employee_name);      
    }
  });
}

/*EOF*/
