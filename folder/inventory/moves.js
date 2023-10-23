/*
 * name: budiono;
 * date: oct-13, 15:08, fri-2023; new;
 */ 

'use strict';

var Moves={
  'url':'moves',
  'title':'Item Moves'
}

Moves.show=(tiket)=>{
  tiket.modul=Moves.url;
  tiket.menu.name=Moves.title;

  const baru=exist(tiket);
  if(baru==-1){
    const newTxs=new BingkaiUtama(tiket);
    const indek=newTxs.show();
    Moves.formPaging(indek);
  }else{
    show(baru);
  }
}

Moves.formPaging=(indek)=>{
  bingkai[indek].metode=MODE_READ;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Moves.formCreate(indek));
  toolbar.search(indek,()=>Moves.formSearch(indek));
  toolbar.refresh(indek,()=>Moves.formPaging(indek));
  toolbar.download(indek,()=>Moves.formExport(indek));
  toolbar.upload(indek,()=>Moves.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    Moves.readShow(indek);
  });
}

Moves.readShow=(indek)=>{
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
        +' onclick="Moves.gotoPage(\''+indek+'\','
        +'\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Moves.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page 
          +'</button>'; 
        } else {
          html+= '<button type="button" '
          +' onclick="Moves.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page
          +'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last" onclick="Moves.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">From</th>'
    +'<th>To</th>'
    +'<th>Date</th>'
    +'<th>Move#</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+paket.data[x].location_id+'</td>'
        +'<td align="left">'+paket.data[x].to_location_id+'</td>'
        +'<td align="left">'+tglWest(paket.data[x].move_date)+'</td>'
        +'<td align="left">'+paket.data[x].move_no+'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)
          +'</td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_change" '
          +' onclick="Moves.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].move_no+'\''
          +',\''+paket.data[x].location_id+'\''
          +');">'
          +'</button></td>'
        +'<td align="center">'
          +'<button type="button" '
          +' id="btn_delete" '
          +' onclick="Moves.formDelete(\''+indek+'\''
          +',\''+paket.data[x].move_no+'\''
          +',\''+paket.data[x].location_id+'\''
          +');">'
          +'</button></td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Moves.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Moves.formPaging(indek);
}

Moves.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">'
    
    +'<div style="display:grid;'
      +'grid-template-columns:repeat(2,1fr);'
      +'padding-bottom:10px;">'

      +'<div>'
        +'<ul>'
          +'<li>'
            +'<label>To location ID:</label>'
            +'<input type="text" id="to_location_id_'+indek+'"'
            +' onchange="Moves.getLocation(\''+indek+'\''
            +',\'to_location_id_'+indek+'\',\'to\')" '
            +' size="9">'
            
            +'<button type="button" id="btn_find" '
            +' onclick="Locations.lookUp(\''+indek+'\''
            +',\'to_location_id_'+indek+'\',\'to\')"></button>'        

          +'</li>'
          +'<li>'
            +'<label>&nbsp;</label>'
            +'<input type="text" '
            +' id="to_location_name_'+indek+'" disabled>'
            +'</li>'
        +'</ul>'
      +'</div>'

      +'<div>'
        +'<ul>'
          +'<li>'
            +'<label>Location ID:</label>'
            +'<input type="text" id="location_id_'+indek+'"'
            +' onchange="Moves.getLocation(\''+indek+'\''
            +',\'location_id_'+indek+'\',\'from\')" '
            +' size="9">'

            +'<button type="button" id="btn_find" '
            +' onclick="Locations.lookUp(\''+indek+'\''
            +',\'location_id_'+indek+'\',\'from\')"></button>'
          +'</li>'

          +'<li>'
            +'<label>&nbsp;</label>'
            +'<input type="text" '
            +' id="location_name_'+indek+'" disabled>'

          +'</li>'
            
          +'<li><label>Move No.:</label>'
            +'<input type="text" id="move_no_'+indek+'"'
            +' size="9">'
          +'</li>'
          
          +'<li><label>Date:</label>'
            +'<input type="date" id="move_date_'+indek+'" '
            +' size="30">'
          +'</li>'

        +'</ul>'
      +'</div>'
    +'</div>'
        
    +'<details open>'
      +'<summary>Move Details</summary>'
      +'<div id="move_detail_'+indek+'"'
      +' style="width:100%;overflow:auto;">Move Details</div>'
    +'</details>'
      
    +'<ul>'
    
    +'<li><label>Employee ID:</label>'
      +'<input type="text" size="9" '
      +' id="employee_id_'+indek+'"'
      +' onchange="Moves.getEmployee(\''+indek+'\')">'

      +'<button type="button" id="btn_find" '
      +' onclick="Employees.lookUp(\''+indek+'\''
      +',\'employee_id_'+indek+'\')"></button>'
      
      +'<input type="text" '
      +' id="employee_name_'+indek+'" disabled>'
      +'</li>'
      

    +'<li><label>Note:</label>'
      +'<input type="text" id="move_note_'+indek+'"></li>'

    +'</ul>'
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);
  
  document.getElementById('to_location_id_'+indek).focus();
  document.getElementById('move_date_'+indek).value=tglSekarang();
}


Moves.formCreate=(indek)=>{
  Moves.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Moves.formPaging(indek));
  toolbar.save(indek,()=>Moves.createExecute(indek));
  Moves.setRows(indek,[]);
}

Moves.createExecute=(indek)=>{
  db3.createOne(indek,{
    "to_location_id":getEV("to_location_id_"+indek),
    "location_id":getEV("location_id_"+indek),
    "move_no":getEV("move_no_"+indek),
    "move_date":getEV("move_date_"+indek),
    "move_detail":bingkai[indek].move_detail,
    "employee_id":getEV("employee_id_"+indek),
    "move_note":getEV("move_note_"+indek),
  });
}

Moves.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "location_id":bingkai[indek].location_id,
    "move_no":bingkai[indek].move_no
  },(paket)=>{
    if (paket.err.id==0||paket.count>0){
      const d=paket.data;
      setEV('to_location_id_'+indek, d.to_location_id);
      setEV('to_location_name_'+indek, d.to_location_name);
      setEV('location_id_'+indek, d.location_id);
      setEV('location_name_'+indek, d.location_name);
      setEV('move_no_'+indek, d.move_no);
      setEV('move_date_'+indek, d.move_date);
      setEV('employee_id_'+indek, d.employee_id);
      setEV('employee_name_'+indek, d.employee_name);
      setEV('move_note_'+indek, d.move_note);
      Moves.setRows(indek,d.move_detail);
    }
    message.none(indek);
    return callback();
  });
}

Moves.formUpdate=(indek,move_no,location_id)=>{
  bingkai[indek].move_no=move_no;
  bingkai[indek].location_id=location_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Moves.formEntry(indek,MODE_UPDATE);
  Moves.readOne(indek,()=>{
    toolbar.back(indek,()=>Moves.formLast(indek));
    toolbar.save(indek,()=>Moves.updateExecute(indek));
  });
}

Moves.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "edit_location_id":bingkai[indek].location_id,
    "edit_move_no":bingkai[indek].move_no,
    // modified
    "to_location_id":getEV("to_location_id_"+indek),
    "location_id":getEV("location_id_"+indek),
    "move_no":getEV("move_no_"+indek),
    "move_date":getEV("move_date_"+indek),
    "move_detail":bingkai[indek].move_detail,
    "employee_id":getEV("employee_id_"+indek),
    "move_note":getEV("move_note_"+indek),
  });
}

Moves.formDelete=(indek,move_no,location_id)=>{
  bingkai[indek].move_no=move_no;
  bingkai[indek].location_id=location_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Moves.formEntry(indek,MODE_DELETE);
  Moves.readOne(indek,()=>{
    toolbar.back(indek,()=>Moves.formLast(indek));
    toolbar.delet(indek,()=>Moves.deleteExecute(indek));
  });
}

Moves.deleteExecute=function(indek){
  db3.deleteOne(indek,{
    "location_id":bingkai[indek].location_id,
    "move_no":bingkai[indek].move_no,
  });
}

Moves.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Moves.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Moves.formPaging(indek));
}

Moves.searchExecute=function(indek){
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Moves.formResult(indek);
}

Moves.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Moves.formSearch(indek));
  db3.search(indek,()=>{
    Moves.readShow(indek);
  });
}

Moves.formLast=function(indek){
  bingkai[indek].text_search==''?
  Moves.formPaging(indek):
  Moves.formResult(indek);
}

Moves.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Moves.formPaging(indek));
  Moves.exportExecute(indek);
}

Moves.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'moves.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Moves.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Moves.formPaging(indek);});
  iii.uploadJSON(indek);
}

Moves.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "to_location_id":d[i][1],
      "location_id":d[i][2],
      "move_no":d[i][3],
      "move_date":d[i][4],
      "move_detail":d[i][5],
      "employee_id":d[i][6],
      "move_note":d[i][7]
    }
    db3.query(indek,Moves.url+'/create',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Moves.setLocation=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const id_baris=bingkai[indek].id_baris;

  setEV(id_kolom, data.location_id);
  Moves.getLocation(indek,id_kolom,id_baris);
}

Moves.getLocation=(indek,id_kolom,baris)=>{
  Locations.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    if(paket.err.id==0){
      switch(baris){
        case "from":
          setEV('location_name_'+indek, paket.data.location_name);
          break;
        case "to":
          setEV('to_location_name_'+indek, paket.data.location_name);
          break;
      }
    }
  });
}

Moves.setRows=function(indek,isi){
  if(isi===undefined) isi=[];
  var panjang=isi.length;
  var html=Moves.tableHead(indek);
  
  bingkai[indek].move_detail=isi;
  for (var i=0;i<panjang;i++){
    html+='<tr>'
      +'<td align="center">'+(i+1)+'</td>'

      +'<td style="margin:0;padding:0">'
        +'<input type="text" id="item_id_'+i+'_'+indek+'" '
        +' value="'+isi[i].item_id+'" size="9"'
        +'onchange="Moves.setCell(\''+indek+'\''
        +',\'item_id_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()"></td>'

      +'<td><button type="button" id="btn_find" '
      +' onclick="StockItems.lookUp(\''+indek+'\''
      +',\'item_id_'+i+'_'+indek+'\',\''+i+'\')">'
      +'</button></td>'
      
      +'<td style="padding:0;margin:0;">'
        +'<input type="text" id="item_name_'+i+'_'+indek+'" '
        +' value="'+isi[i].item_name+'" disabled></td>'
      
      +'<td  align="center" style="padding:0;margin:0;">'
        +'<input type="text" id="qty_moved_'+i+'_'+indek+'" '
        +' value="'+isi[i].qty_moved+'" size="3" '
        +' style="text-align:center"'
        +' onchange="Moves.setCell(\''+indek+'\''
        +',\'qty_moved_'+i+'_'+indek+'\')" '
        +' onfocus="this.select()" ></td>'
      
      +'<td align="center">'
        +'<button type="button" id="btn_add" '
        +' onclick="Moves.addRow(\''+indek+'\','+i+')" ></button>'
        +'<button type="button" id="btn_remove" '
        +' onclick="Moves.removeRow(\''+indek+'\','+i+')" ></button>'
      +'</td>'
      +'</tr>';
  }
  html+=Moves.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('move_detail_'+indek).innerHTML=html;
  if(panjang==0)Moves.addRow(indek,0);
}

Moves.tableHead=(indek)=>{
  return '<table>'
    +'<thead>'
    +'<tr>'
    +'<th colspan=3>Item ID <i class="required">*</i></th>'
    +'<th>Description</th>'
    +'<th>Qty Moved</th>'
    +'<th>Add/Remove</th>'
    +'</tr>'
    +'</thead>';
}

Moves.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan="6">&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

Moves.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].move_detail;
  
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris)Moves.newRow(newBasket);
  }
  if(oldBasket.length==0)Moves.newRow(newBasket);
  Moves.setRows(indek,newBasket);
}

Moves.newRow=(newBasket)=>{
  var myItem={};
  myItem.row_id=newBasket.length+1;
  myItem.item_id="";
  myItem.item_name="";
  myItem.qty_moved=0;
  newBasket.push(myItem);
}

Moves.removeRow=(indek,number)=>{
  var arr=bingkai[indek].move_detail;
  var newBasket=[];
  Moves.setRows(indek,arr);
  for(let i=0;i<arr.length;i++){
    if(i!==number)newBasket.push(arr[i]);
  }
  Moves.setRows(indek,newBasket);
}

Moves.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].move_detail;
  var baru=[];
  var isiEdit={};

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    if(id_kolom==('item_id_'+i+'_'+indek)){
      isiEdit.item_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      Moves.getItem(indek,'item_id_'+i+'_'+indek,i);
    }
    else if(id_kolom==('item_name_'+i+'_'+indek)){
      isiEdit.item_name=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else if(id_kolom==('qty_moved_'+i+'_'+indek)){
      isiEdit.qty_moved=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
    }
    else{
      baru.push(isi[i]);
    }
  }
  bingkai[indek].move_detail=isi;
}

Moves.setStockItem=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;

  setEV(id_kolom, data.item_id);
  Moves.setCell(indek,id_kolom);
}

Moves.getItem=(indek,id_kolom,baris)=>{
  Items.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    setEV('item_name_'+baris+'_'+indek, paket.data.item_name);
    Moves.setCell(indek,'item_name_'+baris+'_'+indek);
  });
}

Moves.setEmployee=(indek,d)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, d.employee_id);
  Moves.getEmployee(indek);
}

Moves.getEmployee=(indek)=>{
  setEV('employee_name_'+indek, '');
  Employees.getOne(indek,getEV('employee_id_'+indek),(paket)=>{
    if(paket.count>0){
      var d=paket.data;
      setEV('employee_name_'+indek, d.employee_name);      
    }
  });
}
/*EOF*/
