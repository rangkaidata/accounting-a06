/*
 * name: budiono;
 * date: oct-12, 19:12, thu-2023; new;
 * edit: oct-13, 09:27, fri-2023; xHTML;
 */ 
 
'use strict';

var Builds={
  url:'builds',
  title:'Build Assemblies'
}

Builds.show=(karcis)=>{
  karcis.modul=Builds.url;
  karcis.menu.name=Builds.title;
  karcis.child_free=false;

  const baru=exist(karcis);
  if(baru==-1){
    const newTxs=new BingkaiUtama(karcis);
    const indek=newTxs.show();
    Builds.formPaging(indek);
  }else{
    show(baru);
  }
}

Builds.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>{Builds.formCreate(indek);});
  toolbar.search(indek,()=>{Builds.formSearch(indek);});
  toolbar.refresh(indek,()=>{Builds.formPaging(indek);});
  toolbar.download(indek,()=>{Builds.formExport(indek);});
  toolbar.upload(indek,()=>{Builds.formImport(indek);});
  toolbar.more(indek,()=>{Menu.more(indek);});
  db3.readPaging(indek,()=>{
    Builds.readShow(indek);
  });
}

Builds.readShow=(indek)=>{
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
        +' onclick="Builds.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Builds.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page +'</button>';  
        } else {
          html+= '<button type="button" '
          +' onclick="Builds.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>'; 
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last" '
        +' onclick="Builds.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }

  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="3">Build No.</th>'
    +'<th>Date</th>'
    +'<th>Item Name</th>'
    +'<th>Qty Build</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].location_id+'</td>'
        +'<td align="left">'+paket.data[x].build_no+'</td>'
        +'<td align="left">'+tglWest(paket.data[x].build_date)+'</td>'
        +'<td align="left">'+xHTML(paket.data[x].item_name)+'</td>'
        +'<td align="center">'+paket.data[x].build_qty+'</td>'
        
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)+'</td>'
        +'<td align="center"><button type="button" '
          +' id="btn_change" onclick="Builds.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].build_no+'\''
          +',\''+paket.data[x].location_id+'\''
          +',\''+paket.data[x].item_id+'\''
          +');"></button></td>'
        +'<td align="center"><button type="button" '
          +' id="btn_delete" onclick="Builds.formDelete(\''+indek+'\''
          +',\''+paket.data[x].build_no+'\''
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

Builds.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Builds.formPaging(indek);
}

Builds.formEntry=(indek,metode)=>{
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
        +' onchange="Builds.getBom(\''+indek+'\');">'
        
        +'<button type="button" id="btn_find" '
        +' onclick="Boms.lookUp(\''+indek+'\''
        +',\'item_id_'+indek+'\',-1)"></button>'        
        
        +'<input type="text" '
        +' id="item_name_'+indek+'" disabled>'
        +'</li>'

      +'<li><label>Quantity:</label>'
        +'<input type="text" size="3"'
        +' style="text-align:center;"'
        +' id="build_qty_'+indek+'" '
        +' onchange="Builds.setCell(\''+indek+'\')">'
        +'</li>'
      +'</ul></div>'

      +'<div><ul>'
        +'<li><label>Date:</label>'
          +'<input type="date" id="build_date_'+indek+'">'
          +'</li>'
          
        +'<li><label>Build No.:</label>'
          +'<input type="text" size="9"'
          +' id="build_no_'+indek+'">'
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
      +'<div id="build_detail_'+indek+'"'
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
      +'<input type="text" id="build_note_'+indek+'" size="50%"></li>'
    
    +'</ul>'
    
    +'</form>'
    +'</div>';
  content.html(indek,html);
  statusbar.ready(indek);
  
  document.getElementById('item_id_'+indek).focus();
  document.getElementById('build_date_'+indek).value=tglSekarang();
}

Builds.formCreate=(indek)=>{
  Builds.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Builds.formPaging(indek);});
  toolbar.save(indek,()=>{Builds.createExecute(indek);});
  
  bingkai[indek].isiTabel=[];
  Builds.setRows(indek,[]);
}

Builds.createExecute=(indek)=>{
  db3.createOne(indek,{
    "item_id":getEV("item_id_"+indek),
    "build_qty":getEV("build_qty_"+indek),
    "build_date":getEV("build_date_"+indek),
    "build_no":getEV("build_no_"+indek),
    "location_id":getEV("location_id_"+indek),
    "employee_id":getEV("employee_id_"+indek),
    "build_note":getEV("build_note_"+indek)
  });
}

Builds.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "build_no":bingkai[indek].build_no,
    "location_id":bingkai[indek].location_id,
    "item_id":bingkai[indek].item_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count!=0){
      const d=paket.data;
      setEV('build_no_'+indek, d.build_no);
      setEV('build_date_'+indek, d.build_date);
      setEV('build_qty_'+indek, d.build_qty);
      
      setEV('item_id_'+indek, d.item_id);
      setEV('item_name_'+indek, d.item_name);

      setEV('location_id_'+indek, d.location_id);
      setEV('build_note_'+indek, d.build_note);
      setEV('employee_id_'+indek, d.employee_id);
      setEV('employee_name_'+indek, d.employee_name);
      
      Builds.setRows(indek,d.build_detail);
    }
    message.none(indek);
    return callback();
  });
}

Builds.formUpdate=(indek,build_no,location_id,item_id)=>{
  bingkai[indek].build_no=build_no;
  bingkai[indek].location_id=location_id;
  bingkai[indek].item_id=item_id;

  toolbar.none(indek);
  toolbar.hide(indek);
  Builds.formEntry(indek,MODE_UPDATE);
  Builds.readOne(indek,()=>{
    toolbar.back(indek,()=>{Builds.formLast(indek);});
    toolbar.save(indek,()=>{Builds.updateExecute(indek);});
  });
}

Builds.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "edit_location_id":bingkai[indek].location_id,
    "edit_build_no":bingkai[indek].build_no,
    "edit_item_id":bingkai[indek].item_id,
    // modified
    "location_id":getEV("location_id_"+indek),
    "build_no":getEV("build_no_"+indek),
    "build_date":getEV("build_date_"+indek),
    "item_id":getEV("item_id_"+indek),
    "build_qty":getEV("build_qty_"+indek),
    "employee_id":getEV("employee_id_"+indek),
    "build_note":getEV("build_note_"+indek)
  });
}

Builds.formDelete=(indek,build_no,location_id,item_id)=>{
  bingkai[indek].build_no=build_no;
  bingkai[indek].location_id=location_id;
  bingkai[indek].item_id=item_id;

  toolbar.none(indek);
  toolbar.hide(indek);  
  Builds.formEntry(indek,MODE_DELETE);
  Builds.readOne(indek,()=>{
    toolbar.back(indek,()=>{Builds.formLast(indek);});
    toolbar.delet(indek,()=>{Builds.deleteExecute(indek);});
  });
}

Builds.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "location_id":bingkai[indek].location_id,
    "build_no":bingkai[indek].build_no,
    "item_id":bingkai[indek].item_id
  });
}

Builds.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Builds.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Builds.formPaging(indek);});
}

Builds.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Builds.formResult(indek);
}

Builds.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Builds.formSearch(indek);});
  db3.search(indek,()=>{
    Builds.readShow(indek);
  });
}

Builds.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Builds.formPaging(indek):
  Builds.formResult(indek);
}

Builds.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Builds.formPaging(indek));
  Builds.exportExecute(indek);
}

Builds.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'builds.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Builds.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,function(){Builds.formPaging(indek);});
  iii.uploadJSON(indek);
}

Builds.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "item_id":d[i][1],
      "build_qty":d[i][2],
      "build_date":d[i][3],
      "build_no":d[i][4],
      "location_id":d[i][5],
      "employee_id":d[i][6],
      "build_note":d[i][7]
    }
    db3.query(indek,Builds.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Builds.setRows=(indek,isi)=>{
  if(isi===undefined) isi=[];
  
  var panjang=isi.length;
  var html=Builds.tableHead(indek);
  var qty_required=0;

  bingkai[indek].isiTabel=isi;
  
  for (var i=0;i<panjang;i++){
    qty_required=Number(isi[i].qty_needed)
      *Number(getEV('build_qty_'+indek))

    html+='<tr>'
      +'<td align="center">'+(i+1)+'</td>'
      
      +'<td>'+isi[i].item_id+'</td>'
      +'<td>'+xHTML(isi[i].item_name)+'</td>'
      +'<td align="center">'+isi[i].qty_needed+'</td>'
      +'<td align="center">'+qty_required+'</td>'
      +'</td>'
      +'</tr>';
  }
  html+=Builds.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('build_detail_'+indek).innerHTML=html;
  
  if(panjang==0) Builds.addRow(indek,0);
}

Builds.tableHead=function(indek){
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

Builds.tableFoot=function(indek){
  return '<tfoot>'
    +'<tr>'
    +'<td colspan=5>&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

Builds.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];

  oldBasket=bingkai[indek].isiTabel;

  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris)Builds.newRow(newBasket);
  }
  if(oldBasket.length==0)Builds.newRow(newBasket);
  Builds.setRows(indek,newBasket);
}

Builds.newRow=(newBasket)=>{    
  var myItem={};
  myItem.row_id=newBasket.length+1;
  myItem.item_id="";
  myItem.item_name="";
  myItem.qty_needed=0;
  myItem.qty_required=0;
  newBasket.push(myItem);
}

Builds.setCell=function(indek){
  var isi=bingkai[indek].isiTabel;
  var baru = [];
  var isiEdit = {};
  const txt=getEV('build_qty_'+indek);

  for (var i=0;i<isi.length; i++){
    isiEdit = isi[i];
    if(isNaN(txt))txt=0;
    isiEdit.qty_required=Number(isi[i].qty_needed)*Number(txt);
    baru.push(isiEdit);
  }
  
  bingkai[indek].isiTabel=baru;
  Builds.setRows(indek,baru);
}

Builds.setLocation=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const id_baris=bingkai[indek].id_baris;

  setEV(id_kolom, data.location_id);
}

Builds.setBom=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const id_baris=bingkai[indek].id_baris;

  setEV(id_kolom, data.item_id);
  setEV('item_name_'+indek, data.item_name);
  Builds.getBom(indek);
}

Builds.getBom=(indek)=>{
  Boms.getOne(indek, getEV('item_id_'+indek), (paket)=>{
    if(paket.err.id==0 && paket.count!=0){
      const d=paket.data;
      setEV('item_name_'+indek, d.item_name);
      Builds.setRows(indek, d.bom_detail);
    }else{
      Builds.setRows(indek,[]);
    }
  });
}

Builds.setEmployee=(indek,d)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, d.employee_id);
  Builds.getEmployee(indek);
}

Builds.getEmployee=(indek)=>{
  setEV('employee_name_'+indek, '');
  Employees.getOne(indek,getEV('employee_id_'+indek),(paket)=>{
    if(paket.count>0){
      var d=paket.data;
      setEV('employee_name_'+indek, d.employee_name);      
    }
  });
}

/*EOF*/
