/*
 * name: budiono
 * date: sep-11, 12:08, mon-2023; new;
 * edit: sep-16, 15:16, sat-2023; size obj;
 */
  
'use strict';

var Items={
  url:'items',
  title:'Inventory Items',
  location_id:''// location_default
}

Items.show=(tiket)=>{
  tiket.modul=Items.url;
  tiket.menu.name=Items.title;

  const baru=exist(tiket);
  if(baru==-1){
    const newItm=new BingkaiUtama(tiket);
    const indek=newItm.show();
    Items.formPaging(indek);
  }else{
    show(baru);
  }
}

Items.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>Items.formCreate(indek));
  toolbar.search(indek,()=>Items.formSearch(indek));
  toolbar.refresh(indek,()=>Items.formPaging(indek));
  toolbar.download(indek,()=>Items.formExport(indek));
  toolbar.upload(indek,()=>Items.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  db3.readPaging(indek,()=>{
    Items.readShow(indek);
  });
  Items.getDefault(indek);
}

Items.getDefault=(indek)=>{
  ItemDefaults.getDefault(indek);
}

Items.readShow=(indek)=>{
  const mode=bingkai[indek].metode;
  const paket=bingkai[indek].paket;
  
  var html='<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"></div>'
    +'<p>Total: '+paket.count+' rows</p>';

  if (paket.err.id===0){
    if (mode==MODE_READ){
      if (paket.paging.first!=""){
        html+= '<button type="button" id="btn_first" '
        +' onclick="Items.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')"></button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button" '
          +' onclick="Items.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled >'
          +paket.paging.pages[x].page +'</button>'; 
        } else {
          html+= '<button type="button" '
          +' onclick="Items.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button" id="btn_last" '
        +'onclick="Items.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')"></button>';
      }
    }
  }

  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Item ID</th>'
    +'<th>Description</th>'
    +'<th>Class</th>'
    +'<th align="center">User</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data){
      html+='<tr>'
        +'<td align="center">'+paket.data[x].row_id+'</td>'
        +'<td align="left">'+tHTML(paket.data[x].item_id)+'</td>'
        +'<td align="left">'+tHTML(paket.data[x].item_name)+'</td>'
        +'<td align="center">'
          +default_item_class[paket.data[x].item_class]
          +'</td>'
        +'<td align="center">'+paket.data[x].info.user_name+'</td>'
        +'<td align="center">'
          +tglInt(paket.data[x].info.date_modified)+'</td>'
        +'<td align="center">'
          +'<button type="button" id="btn_change" '
          +' onclick="Items.formUpdate(\''+indek+'\''
          +',\''+paket.data[x].item_id+'\');">'
          +'</button>'
          +'</td>'
        +'<td align="center">'
          +'<button type="button" id="btn_delete" '
          +' onclick="Items.formDelete(\''+indek+'\''
          +',\''+paket.data[x].item_id+'\');">'
          +'</button>'
          +'</td>'
        +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

Items.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Items.formPaging(indek);
}

Items.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;

  var html=''
    +'<div style="padding:0.5rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off" style="margin-bottom:10px;">'
    
    +'<div style="display:grid;grid-template-columns:repeat(2,1fr);'
    +'padding-bottom:20px;">'
    
      +'<div>'
        +'<ul>'
        +'<li><label>Item ID<i class="required">*</i>:</label>'
          +'<input type="text" id="item_id_'+indek+'" '
          +' size="10"></li>'
        +'<li><label>Description:</label>'
          +'<input type="text" id="item_name_'+indek+'" '
          +' placeholder="for inventory ..."'
          +' size="40"></li>'
          
        +'<li><label>&nbsp;</label>'
          +'<input type="text" id="name_for_sales_'+indek+'" '
          +' size="40" placeholder="for Sales ..."></li>'
          
        +'<li><label>&nbsp;</label>'
          +'<input type="text" id="name_for_purchases_'+indek+'" '
          +' size="40" placeholder="for purchases ..."></li>'
        +'</ul>'
      +'</div>'
      
      +'<div>'    
        +'<ul>'
        +'<li><label>Item Class:</label>'
          +'<select id="item_class_'+indek+'" '
          +' onchange="Items.itemClassMode(this.value,\''+indek+'\')">'
          +getItemClass(indek)
          +'</select>'
          +'</li>'
        
        +'<li><label>&nbsp;</label>'
          +'<label><input type="checkbox" '
          +' id="item_inactive_'+indek+'" '
          +' value="Inactive">Inactive</label></li>'
        +'</ul>'
      +'</div>'
    +'</div>'
    
    +'<div style="display:grid;grid-template-columns:repeat(2,1fr);'
    +'padding-bottom:20px;">'
    
    +'<div>'
      +'<ul>'
        +'<li><label>Unit/Measure:</label>'
          +'<input type="text"'
          +' id="unit_measure_'+indek+'"'
          +' size="7">'
        +'</li>'
        
        +'<li><label>Item Type:</label>'
          +'<input type="text"'
          +' id="item_type_'+indek+'"'
          +' size="7">'
        +'</li>'

        +'<li><label>Location ID:</label>'
          +'<input type="text" id="location_id_'+indek+'" '
          +' style="text-align:center"'
          +' size="7">'

          +'<button type="button" id="btn_find" '
          +' onclick="Locations.lookUp(\''+indek+'\''
          +',\'location_id_'+indek+'\');"></button>'
          +'</li>'


      +'</ul>'
    +'</div>'
    
    +'<div>'
      +'<ul>'
      +'<li><label>Sales Account:</label>'
        +'<input type="text" '
        +' id="sales_account_id_'+indek+'" '
        +' onchange="Items.getAccount(\''+indek+'\''
        +',\'sales_account_id_'+indek+'\',\'sales\')"'
        +' size="8">'

        +'<button type="button" class="btn_find" '
          +' id="sales_btn_'+indek+'" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'sales_account_id_'+indek+'\',\'sales\');">'
        +'</button>'
        
        +'<input type="text"'
        +' id="sales_account_name_'+indek+'" disabled>'
        +'</li>'

      +'<li><label>Inventory Acct:</label>'
        +'<input type="text" id="inventory_account_id_'+indek+'"'
        +' onchange="Items.getAccount(\''+indek+'\''
        +',\'inventory_account_id_'+indek+'\',\'inventory\')" '
        +' size="8">'

        +'<button type="button" class="btn_find" '
          +' id="inventory_btn_'+indek+'" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'inventory_account_id_'+indek+'\',\'inventory\');">'
        +'</button>'

        +'<input type="text" '
        +' id="inventory_account_name_'+indek+'" disabled>'
        +'</li>'

      +'<li><label>Wage Acct:.</label>'
        +'<input type="text" id="wage_account_id_'+indek+'" '
        +' onchange="Items.getAccount(\''+indek+'\''
        +',\'wage_account_id_'+indek+'\',\'wage\')"'
        +' size="8">'
        
        +'<button type="button" class="btn_find" '
          +' id="wage_btn_'+indek+'" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'wage_account_id_'+indek+'\',\'wage\');">'
        +'</button>'
        
        +'<input type="text"'
        +' id="wage_account_name_'+indek+'"'
        +' disabled>'
        +'</li>'

      +'<li><label>COGS Acct:</label>'
        +'<input type="text" id="cogs_account_id_'+indek+'" '
        +' onchange="Items.getAccount(\''+indek+'\''
        +',\'cogs_account_id_'+indek+'\',\'cogs\')"'
        +' size="8">'
        
        +'<button type="button" class="btn_find" '
          +' id="cogs_btn_'+indek+'" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'cogs_account_id_'+indek+'\',\'cogs\');">'
        +'</button>'
        
        +'<input type="text"'
        +' id="cogs_account_name_'+indek+'"'
        +' disabled>'
        +'</li>'
        
      +'<li><label>Income Acct:</label>'
        +'<input type="text" id="income_account_id_'+indek+'"'
        +' onchange="Items.getAccount(\''+indek+'\''
        +',\'income_account_id_'+indek+'\',\'income\')"'
        +' size="8">'
        
        +'<button type="button" class="btn_find" '
          +' id="income_btn_'+indek+'" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'income_account_id_'+indek+'\',\'income\');">'
        +'</button>'
        
        +'<input type="text"'
        +' id="income_account_name_'+indek+'"'
        +' disabled>'
        +'</li>'
      +'</ul>'
    +'</div>'
    +'</div>'

    +'<div style="display:grid;grid-template-columns:repeat(2,1fr);'
    +'padding-bottom:20px;">'
    +'<div>'
      +'<ul>'
      
      +'<li>'
        +'<label>Cost Method:</label>'
        +'<select id="cost_method_'+indek+'">'
          +getCostMethod(indek)
        +'</select>'
      +'</li>'
      
      +'<li><label>Item Tax ID:</label>'
        +'<input type="text" id="item_tax_id_'+indek+'" '
        +' style="text-align:center"'
        +' size="5">'
        +'<button type="button" id="btn_find" '
        +' onclick="ItemTaxes.lookUp(\''+indek+'\''
        +',\'item_tax_id_'+indek+'\');"></button>'
        +'</li>'
      +'</ul>'
    +'</div>'

    +'<div>'
      +'<ul>'
      
      +'<li><label>Minimum Stock:</label>'
        +'<input type="text" id="minimum_stock_'+indek+'" '
        +' style="text-align:center"'
        +' size="5">'
        +'</li>'
        
      +'<li><label>Reorder Qty:</label>'
        +'<input type="text" id="reorder_quantity_'+indek+'" '
        +' style="text-align:center"'
        +' size="5">'
        +'</li>'

      +'<li><label>Vendor ID:</label>'
        +'<input type="text" '
        +' id="vendor_id_'+indek+'" '
        +' onchange="Items.getVendor(\''+indek+'\''
        +',\'vendor_id_'+indek+'\')"'
        +' size="10">'
        
        +'<button type="button" id="btn_find" '
          +' onclick="Vendors.lookUp(\''+indek+'\''
          +',\'vendor_id_'+indek+'\');"></button>'

        +'<input type="text" '
        +' id="vendor_name_'+indek+'" disabled '
        +' style="width:160px;">'
        +'</li>'
        
      +'</ul>'
    +'</div>'
    +'</div>'
    
    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);

  if (metode===MODE_CREATE){
    document.getElementById('item_id_'+indek).focus();
  }else{
    document.getElementById('item_id_'+indek).disabled=true;
    document.getElementById('item_class_'+indek).disabled=true;
    document.getElementById('item_name_'+indek).focus();
    // document.getElementById('detail_item_'+indek).style.visibility="hidden";
  }
  Items.itemClassMode(0,indek);
}

Items.itemClassMode=(mode,indek)=>{
  document.getElementById('sales_account_id_'+indek).disabled=true;
  document.getElementById('inventory_account_id_'+indek).disabled=true;
  document.getElementById('wage_account_id_'+indek).disabled=true;
  document.getElementById('cogs_account_id_'+indek).disabled=true;
  document.getElementById('income_account_id_'+indek).disabled=true;
  
  document.getElementById('sales_btn_'+indek).disabled=true;
  document.getElementById('inventory_btn_'+indek).disabled=true;
  document.getElementById('wage_btn_'+indek).disabled=true;
  document.getElementById('cogs_btn_'+indek).disabled=true;
  document.getElementById('income_btn_'+indek).disabled=true;
  
  if(mode==0 || mode==5){//0-stock & 5-Assembly
    document.getElementById('sales_account_id_'+indek).disabled=false;
    document.getElementById('inventory_account_id_'+indek).disabled=false;
    document.getElementById('cogs_account_id_'+indek).disabled=false;
    document.getElementById('sales_btn_'+indek).disabled=false;
    document.getElementById('inventory_btn_'+indek).disabled=false;
    document.getElementById('cogs_btn_'+indek).disabled=false;
  }
  if(mode==1){//1-Non-stock item
    document.getElementById('sales_account_id_'+indek).disabled=false;
    document.getElementById('wage_account_id_'+indek).disabled=false;
    document.getElementById('cogs_account_id_'+indek).disabled=false;
    document.getElementById('sales_btn_'+indek).disabled=false;
    document.getElementById('wage_btn_'+indek).disabled=false;
    document.getElementById('cogs_btn_'+indek).disabled=false;
  }
  if(mode==2){//2-Description only
  }
  if(mode==3 || mode==4){// 3-Service & 4-Labor
    document.getElementById('sales_account_id_'+indek).disabled=false;
    document.getElementById('wage_account_id_'+indek).disabled=false;
    document.getElementById('cogs_account_id_'+indek).disabled=false;
    document.getElementById('sales_btn_'+indek).disabled=false;
    document.getElementById('wage_btn_'+indek).disabled=false;
    document.getElementById('cogs_btn_'+indek).disabled=false;
  }
  if(mode==6 || mode==7){//6-Activity item & 7-Charge item
    document.getElementById('income_account_id_'+indek).disabled=false;
    document.getElementById('income_btn_'+indek).disabled=false;
  }
  
  if(bingkai[indek].metode==MODE_CREATE){
    Items.setAccountDefault(indek,mode)
  }
}

Items.formCreate=(indek)=>{
  Items.formEntry(indek,MODE_CREATE);
  Items.setDefault(indek);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Items.formPaging(indek);});
  toolbar.save(indek,()=>{Items.createExecute(indek);});  
}

Items.setDefault=(indek)=>{
  const d=bingkai[indek].data_default;
  setEV('item_tax_id_'+indek,d.item_tax_id);
  setEV('cost_method_'+indek,d.cost_method);
  setEV('item_class_'+indek,d.item_class);
  Items.setAccountDefault(indek,d.item_class);
  Items.itemClassMode(d.item_class,indek);
}

Items.setAccountDefault=(indek,nomer)=>{
  const isi=bingkai[indek].data_default.default_detail[nomer];
  // set values
  setEV('sales_account_id_'+indek,isi.sales_account_id);
  setEV('sales_account_name_'+indek,isi.sales_account_name);
  setEV('inventory_account_id_'+indek,isi.inventory_account_id);
  setEV('inventory_account_name_'+indek,isi.inventory_account_name);
  setEV('wage_account_id_'+indek,isi.wage_account_id);
  setEV('wage_account_name_'+indek,isi.wage_account_name);
  setEV('cogs_account_id_'+indek,isi.cogs_account_id);
  setEV('cogs_account_name_'+indek,isi.cogs_account_name);
  setEV('income_account_id_'+indek,isi.income_account_id);
  setEV('income_account_name_'+indek,isi.income_account_name);
}

Items.createExecute=(indek)=>{
  db3.createOne(indek,{
    "item_id":getEV("item_id_"+indek),
    "item_name":getEV("item_name_"+indek),
    "item_class":getEI("item_class_"+indek),
    "item_inactive":getEC("item_inactive_"+indek),    
    "name_for_sales":getEV("name_for_sales_"+indek),
    "name_for_purchases":getEV("name_for_purchases_"+indek),
    "unit_measure":getEV("unit_measure_"+indek),
    "item_type":getEV("item_type_"+indek),
    "location_id":getEV("location_id_"+indek),
    "sales_account_id":getEV("sales_account_id_"+indek),
    "inventory_account_id":getEV("inventory_account_id_"+indek),
    "wage_account_id":getEV("wage_account_id_"+indek),
    "cogs_account_id":getEV("cogs_account_id_"+indek),
    "income_account_id":getEV("income_account_id_"+indek),
    "cost_method":getEI("cost_method_"+indek),
    "item_tax_id":getEV("item_tax_id_"+indek),
    "minimum_stock":getEV("minimum_stock_"+indek),
    "reorder_quantity":getEV("reorder_quantity_"+indek),
    "vendor_id":getEV("vendor_id_"+indek),
    "custom_field":{
      "new_field_1":"value 1",
      "new_field_2":"value 2"
    }
  },(paket)=>{// bila digabung stok;
    if(paket.err.id==0){
      if(getEV("item_class_"+indek)==0 || 
        getEV("item_class_"+indek)==5){
          //Items.createBeginBalance(indek);
      }
    }
  });
}
/*
Items.createBeginBalance=(indek)=>{
  db3.query(indek,'item_begins/update',{
    "item_id":getEV('item_id_'+indek),
    "begin_detail":bingkai[indek].item_detail
  },(paket)=>{
    console.log(paket);
  });
}*/

Items.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "item_id":bingkai[indek].item_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0) {
      const data=paket.data;
      setEV('item_id_'+indek, data.item_id);
      setEV('item_name_'+indek, data.item_name);
      setEV('item_class_'+indek, data.item_class);
      setEC('item_inactive_'+indek, data.item_inactive);
      setEV('name_for_sales_'+indek, data.name_for_sales);
      setEV('name_for_purchases_'+indek, data.name_for_purchases);
      setEV('unit_measure_'+indek, data.unit_measure);
      setEV('item_type_'+indek, data.item_type);
      setEV('location_id_'+indek, data.location_id);
      setEV('sales_account_id_'+indek, data.sales_account_id);
      setEV('sales_account_name_'+indek, data.sales_account_name);
      setEV('inventory_account_id_'+indek, data.inventory_account_id);
      setEV('inventory_account_name_'+indek, data.inventory_account_name);
      setEV('wage_account_id_'+indek, data.wage_account_id);
      setEV('wage_account_name_'+indek, data.wage_account_name);
      setEV('cogs_account_id_'+indek, data.cogs_account_id);
      setEV('cogs_account_name_'+indek, data.cogs_account_name);
      setEV('income_account_id_'+indek, data.income_account_id);
      setEV('income_account_name_'+indek, data.income_account_name);
      
      setEI('cost_method_'+indek, data.cost_method);
      setEV('item_tax_id_'+indek, data.item_tax_id);
      
      setEV('minimum_stock_'+indek, data.minimum_stock);
      setEV('reorder_quantity_'+indek, data.reorder_quantity);
      
      setEV('vendor_id_'+indek, data.vendor_id);
      setEV('vendor_name_'+indek, data.vendor_name);

      Items.itemClassMode(paket.data.item_class,indek);
    }
    message.none(indek);
    return callback();
  });
}

Items.formUpdate=(indek,item_id)=>{
  bingkai[indek].item_id=item_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Items.formEntry(indek,MODE_UPDATE);
  Items.readOne(indek,()=>{
    toolbar.back(indek,()=>Items.formLast(indek));
    toolbar.save(indek,()=>Items.updateExecute(indek));
  });
}

Items.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "item_id":bingkai[indek].item_id,
    "item_name":getEV("item_name_"+indek),
    "item_inactive":getEC("item_inactive_"+indek),
    
    "name_for_sales":getEV("name_for_sales_"+indek),
    "name_for_purchases":getEV("name_for_purchases_"+indek),

    "unit_measure":getEV("unit_measure_"+indek),
    "item_type":getEV("item_type_"+indek),
    "location_id":getEV("location_id_"+indek),

    "sales_account_id":getEV("sales_account_id_"+indek),
    "inventory_account_id":getEV("inventory_account_id_"+indek),
    "wage_account_id":getEV("wage_account_id_"+indek),
    "cogs_account_id":getEV("cogs_account_id_"+indek),
    "income_account_id":getEV("income_account_id_"+indek),

    "item_tax_id":getEV("item_tax_id_"+indek),
    "minimum_stock":getEV("minimum_stock_"+indek),
    "reorder_quantity":getEV("reorder_quantity_"+indek),
    
    "vendor_id":getEV("vendor_id_"+indek),

    "custom_field":{
      "edit_field_1":"edit_value",
      "edit_field_2":"edit_value"
    }
  });
}

Items.formDelete=(indek,item_id)=>{
  bingkai[indek].item_id=item_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Items.formEntry(indek,MODE_DELETE);
  Items.readOne(indek,()=>{
    toolbar.back(indek,()=>{Items.formLast(indek);});
    toolbar.delet(indek,()=>{Items.deleteExecute(indek);});
  });
}

Items.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "item_id":bingkai[indek].item_id
  });
}

Items.formSearch=(indek)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Items.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Items.formPaging(indek);});
}

Items.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Items.formResult(indek);
}

Items.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Items.formSearch(indek);});
  db3.search(indek,(paket)=>{
    Items.readShow(indek);
  });
}

Items.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Items.formPaging(indek):
  Items.formResult(indek);
}

Items.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Items.formPaging(indek));
  Items.exportExecute(indek);
}


Items.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'items.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });  
}

Items.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Items.formPaging(indek);});
  iii.uploadJSON(indek);
}

Items.importExecute=(indek)=>{
  var oNomer=0;
  var oMsg='';
  var obj;
  var html='';
  var dataImport=bingkai[indek].dataImport.data;
  var jumlahData=dataImport.length;
  document.getElementById('btn_import_all_'+indek).disabled=true;  
  for (var i=0;i<dataImport.length;i++){
    obj = {
      "item_id":dataImport[i][1],
      "item_name":dataImport[i][2],
      "item_class":dataImport[i][3],
      "item_inactive":dataImport[i][4],
      "name_for_sales":dataImport[i][5],
      "name_for_purchases":dataImport[i][6],
      "unit_measure":dataImport[i][7],
      "item_type":dataImport[i][8],
      "location_id":dataImport[i][9],
      "sales_account_id":dataImport[i][10],
      "inventory_account_id":dataImport[i][11],
      "wage_account_id":dataImport[i][12],
      "cogs_account_id":dataImport[i][13],
      "income_account_id":dataImport[i][14],
      "cost_method":dataImport[i][15],
      "item_tax_id":dataImport[i][16],
      "minimum_stock":dataImport[i][17],
      "reorder_quantity":dataImport[i][18],
      "vendor_id":dataImport[i][19],
      "custom_field":dataImport[i][20],
    }
    db3.query(indek, Items.url+'/create',obj,(paket)=>{  
      oNomer++;
      oMsg+='['+oNomer+'] '+db.error(paket)+'<br>';
      html="<h4>Message Proccess:</h4>"+oMsg;
      if (oNomer===jumlahData){
        document.getElementById("msgImport_"+indek).innerHTML
        =html+'<h4>End Proccess.</h4>';
        document.getElementById('btn_import_all_'+indek).disabled=false;
        toolbar.wait(indek,END);
        statusbar.ready(indek);
      }
      else{
        document.getElementById("msgImport_"+indek).innerHTML
        =html+'<h4>Please wait ... ['+oNomer+'/'+jumlahData+']</h4>';
        statusbar.html(indek,(oNomer+'/'+jumlahData));
      }
    });
  }
}

Items.lookUp=(indek,id_kolom,nama_kolom)=>{
  bingkai[indek].id_kolom=id_kolom;
  bingkai[indek].nama_kolom=nama_kolom;

  objPop=new ItemLook(indek);
  objPop.show();
}

Items.getAccount=(indek,id_kolom,alias)=>{
  Accounts.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    let nm_account=undefined;
    if(paket.count!=0){
      nm_account=paket.data.account_name;
    }
    switch(alias){
      case "sales":
        setEV('sales_account_name_'+indek, nm_account);
        break;
      case "inventory":
        setEV('inventory_account_name_'+indek, nm_account);
        break;
      case "wage":
        setEV('wage_account_name_'+indek, nm_account);
        break;
      case "cogs":
        setEV('cogs_account_name_'+indek, nm_account);
        break;
      case "income":
        setEV('income_account_name_'+indek, nm_account);
        break;
      default:
        alert(alias+' undefined. ')
    }
  });
}

Items.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  
  setEV(id_kolom, data.account_id);
  Items.getAccount(indek,id_kolom,nama_kolom);
}

Items.setItemTaxes=(indek,d)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, d.item_tax_id);
}

Items.setVendor=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, data.vendor_id);
  Items.getVendor(indek,id_kolom);
}

Items.getVendor=(indek,id_kolom)=>{
  setEV('vendor_name_'+indek, undefined);
  Vendors.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    if(paket.count!=0){
      setEV('vendor_name_'+indek, paket.data.vendor_name);
    }
  });
}

Items.getOne=(indek,item_id,callBack)=>{
  db3.query(indek,'items/read_one',{
    "item_id":item_id
  },(paket)=>{
    return callBack(paket);
  });
}

Items.setLocation=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const id_baris=bingkai[indek].id_baris;

  setEV(id_kolom, data.location_id);
}

//eof: 
