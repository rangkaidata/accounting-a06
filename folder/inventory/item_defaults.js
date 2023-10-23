/*
 * name: budiono
 * date: sep-06, 20:58, wed-2023; new;
 * edit: sep-16, 10:06, sat-2023; mod size;
 */ 
 
'use strict';

var ItemDefaults={
  url:'item_defaults',
  title:'Inventory Item Defaults'
};

ItemDefaults.getDefault=(indek)=>{
  let data_default={
    "cost_method":0,
    "item_tax_id":'',
    "location_id":'',
    "item_class":0,
    "default_detail":[],
    "freight_account_id":''
  };

  for(var i=0;i<8;i++){
    data_default.default_detail[i]={
      "sales_account_id":'',
      "sales_account_name":'',
      "inventory_account_id":'',
      "inventory_account_name":'',
      "wage_account_id":'',
      "wage_account_name":'',
      "cogs_account_id":'',
      "cogs_account_name":'',
      "income_account_id":'',
      "income_account_name":'',
    }
  }
    
  ItemDefaults.getOne(indek,(paket)=>{
    if(paket.err.id==0 && paket.count>0){ 
      bingkai[indek].data_default=paket.data;    
    }else{
      bingkai[indek].data_default=data_default;
    }
  });
}

ItemDefaults.show=(tiket)=>{
  tiket.modul=ItemDefaults.url;
  tiket.menu.name=ItemDefaults.title;
  
  const baru=exist(tiket);
  if(baru==-1){
    const newReg=new BingkaiUtama(tiket);
    const indek=newReg.show();
    ItemDefaults.getDefault(indek);
    ItemDefaults.formUpdate(indek);
  }else{
    show(baru);
  }
}

ItemDefaults.formEntry=(indek)=>{
  bingkai[indek].metode=MODE_UPDATE;
  var html='<div style="margin:1rem;">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin:0.5rem;"></div>'
      +'<form autocomplete="off">'    
        +'<ul>'
          +'<li>'
            +'<label>Cost Method:</label>'
            +'<select id="cost_method_'+indek+'">'
              +getCostMethod(indek)
            +'</select>'
          +'</li>'
          +'<li>'
            +'<label>Item Tax ID:</label>'
              +'<input type="text" id="item_tax_id_'+indek+'" '
              +' style="text-align:center"'
              +' size="5">'
            
            +'<button type="button" id="btn_find" '
              +' onclick="ItemTaxes.lookUp(\''+indek+'\''
              +',\'item_tax_id_'+indek+'\');"></button>'
          +'</li>'
          
          +'<li>'
            +'<label>Location ID:</label>'
            +'<input type="text" size="5"'
            +' id="location_id_'+indek+'"'
            +' onchange="ItemDefaults.getLocation(\''+indek+'\''
              +',\'location_id_'+indek+'\',\'sales\')">'
            
            +'<button type="button" class="btn_find" '
              +' onclick="Locations.lookUp(\''+indek+'\''
              +',\'location_id_'+indek+'\',\'sales\');">'
            +'</button>'
            
            +'<input type="text"'
            +' id="location_name_'+indek+'" disabled>'
          +'</li>'
        +'</ul>'
                
        +'<details open style="margin-bottom:10px;">'
        +'<summary>Inventory Item Default Details</summary>'          
          
          +'<p>'
          +'<label>Default Class</label>'
          +'<select id="item_class_'+indek+'" '
          +' onchange="ItemDefaults.itemClassMode(this.value,\''+indek+'\')">'
          +getItemClass(indek)
          +'</select>'
          +'</p>'
          
          +'<ul>'          
          +'<li><label>Sales Account:</label>'
            +'<input type="text" '
            +' id="sales_account_id_'+indek+'" '
            +' onchange="ItemDefaults.getAccount(\''+indek+'\''
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
            +'<input type="text"'
            +' id="inventory_account_id_'+indek+'"'
            +' onchange="ItemDefaults.getAccount(\''+indek+'\''
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
            +'<input type="text"'
            +' id="wage_account_id_'+indek+'" '
            +' onchange="ItemDefaults.getAccount(\''+indek+'\''
            +',\'wage_account_id_'+indek+'\',\'wage\')"'
            +' size="8">'
            
            +'<button type="button" class="btn_find" '
              +' id="wage_btn_'+indek+'" '
              +' onclick="Accounts.lookUp(\''+indek+'\''
              +',\'wage_account_id_'+indek+'\',\'wage\');">'
            +'</button>'
            
            +'<input type="text" id="wage_account_name_'+indek+'" disabled>'
            +'</li>'

          +'<li><label>COGS Acct:</label>'
            +'<input type="text"'
            +' id="cogs_account_id_'+indek+'" '
            +' onchange="ItemDefaults.getAccount(\''+indek+'\''
            +',\'cogs_account_id_'+indek+'\',\'cogs\')"'
            +' size="8">'
            
            +'<button type="button" class="btn_find" '
              +' id="cogs_btn_'+indek+'" '
              +' onclick="Accounts.lookUp(\''+indek+'\''
              +',\'cogs_account_id_'+indek+'\',\'cogs\');">'
            +'</button>'
            
            +'<input type="text" id="cogs_account_name_'+indek+'" disabled>'
            +'</li>'
            
          +'<li><label>Income Acct:</label>'
            +'<input type="text"'
            +' id="income_account_id_'+indek+'"'
            +' onchange="ItemDefaults.getAccount(\''+indek+'\''
            +',\'income_account_id_'+indek+'\',\'income\')"'
            +' size="8">'
            
            +'<button type="button" class="btn_find" '
              +' id="income_btn_'+indek+'" '
              +' onclick="Accounts.lookUp(\''+indek+'\''
              +',\'income_account_id_'+indek+'\',\'income\');">'
            +'</button>'
            
            +'<input type="text" id="income_account_name_'+indek+'" '
              +' disabled>'
            +'</li>'
          +'</ul>'
          
        +'</details>'
        
        +'<ul>'        
          +'<li>'
            +'<label>Freight Account ID:</label>'
            +'<input type="text"'
            +' id="freight_account_id_'+indek+'"'
            +' size="8">'

            +'<button type="button" class="btn_find" '
              +' onclick="Accounts.lookUp(\''+indek+'\''
              +',\'freight_account_id_'+indek+'\',\'freight\');">'
            +'</button>'
            
            +'<input type="text"'
            +' id="freight_account_name_'+indek+'" disabled>'
            
          +'</li>'
        +'</ul>'
        
      +'</form>'
    +'</div>';
    
  content.html(indek,html);
  document.getElementById("location_id_"+indek).focus;
  ItemDefaults.itemClassMode(0,indek);
}

ItemDefaults.formUpdate=(indek)=>{
  bingkai[indek].default_detail=[];
  for(var i=0;i<8;i++){
    bingkai[indek].default_detail[i]={
      "sales_account_id":'',
      "sales_account_name":'',
      "inventory_account_id":'',
      "inventory_account_name":'',
      "wage_account_id":'',
      "wage_account_name":'',
      "cogs_account_id":'',
      "cogs_account_name":'',
      "income_account_id":'',
      "income_account_name":'',
    }
  }
  
  ItemDefaults.formEntry(indek);
  
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.more(indek,()=>Menu.more(indek));
  toolbar.refresh(indek,()=>{ItemDefaults.formUpdate(indek);});
  ItemDefaults.readOne(indek,()=>{
    toolbar.save(indek,()=>{ItemDefaults.updateExecute(indek);});
    toolbar.delet(indek,()=>{ItemDefaults.deleteExecute(indek);});
    toolbar.download(indek,()=>{ItemDefaults.formExport(indek);});
    toolbar.upload(indek,()=>{ItemDefaults.formImport(indek);});
  });
}

ItemDefaults.readOne=(indek,c)=>{
  db3.readOne(indek,{},(paket)=>{
    if (paket.err.id==0 && paket.count>0){
      const d=paket.data;
      setEV('item_tax_id_'+indek,d.item_tax_id);
      setEV('location_id_'+indek,d.location_id);
      setEV('location_name_'+indek,d.location_name);
      setEV('freight_account_id_'+indek,d.freight_account_id);
      setEV('freight_account_name_'+indek,d.freight_account_name);
      setEI('cost_method_'+indek,d.cost_method);
      setEI('item_class_'+indek,d.item_class);
      
      bingkai[indek].default_detail=d.default_detail;
      ItemDefaults.itemClassMode(d.item_class,indek);
    }else{
      
    }
    message.none(indek);
    return c();
  });
}

ItemDefaults.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "cost_method":getEI('cost_method_'+indek),
    "item_tax_id":getEV('item_tax_id_'+indek),
    "location_id":getEV('location_id_'+indek),
    "item_class":getEI('item_class_'+indek),
    "default_detail":bingkai[indek].default_detail,
    "freight_account_id":getEV('freight_account_id_'+indek)
  });
}

ItemDefaults.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{});
}

ItemDefaults.itemClassMode=(mode,indek)=>{
  const isi=bingkai[indek].default_detail[mode];
  
  document.getElementById('sales_account_id_'+indek).disabled=true;
  document.getElementById('sales_btn_'+indek).disabled=true;
  document.getElementById('inventory_account_id_'+indek).disabled=true;
  document.getElementById('inventory_btn_'+indek).disabled=true;
  document.getElementById('wage_account_id_'+indek).disabled=true;
  document.getElementById('wage_btn_'+indek).disabled=true;
  document.getElementById('cogs_account_id_'+indek).disabled=true;
  document.getElementById('cogs_btn_'+indek).disabled=true;
  document.getElementById('income_account_id_'+indek).disabled=true;
  document.getElementById('income_btn_'+indek).disabled=true;

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
  
  if(mode==0 || mode==5){//0-stock & 5-Assembly
    document.getElementById('sales_account_id_'+indek).disabled=false;
    document.getElementById('sales_btn_'+indek).disabled=false;
    document.getElementById('inventory_account_id_'+indek).disabled=false;
    document.getElementById('inventory_btn_'+indek).disabled=false;
    document.getElementById('cogs_account_id_'+indek).disabled=false;
    document.getElementById('cogs_btn_'+indek).disabled=false;
  }
  if(mode==1){//1-Non-stock item
    document.getElementById('sales_account_id_'+indek).disabled=false;
    document.getElementById('sales_btn_'+indek).disabled=false;
    document.getElementById('wage_account_id_'+indek).disabled=false;
    document.getElementById('wage_btn_'+indek).disabled=false;
    document.getElementById('cogs_account_id_'+indek).disabled=false;
    document.getElementById('cogs_btn_'+indek).disabled=false;
  }
  if(mode==2){//2-Description only
  }
  if(mode==3 || mode==4){// 3-Service & 4-Labor
    document.getElementById('sales_account_id_'+indek).disabled=false;
    document.getElementById('sales_btn_'+indek).disabled=false;
    document.getElementById('wage_account_id_'+indek).disabled=false;
    document.getElementById('wage_btn_'+indek).disabled=false;
    document.getElementById('cogs_account_id_'+indek).disabled=false;
    document.getElementById('cogs_btn_'+indek).disabled=false;
  }
  if(mode==6 || mode==7){//6-Activity item & 7-Charge item
    document.getElementById('income_account_id_'+indek).disabled=false;
    document.getElementById('income_btn_'+indek).disabled=false;
  }
}

ItemDefaults.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  
  setEV(id_kolom, data.account_id);
  ItemDefaults.getAccount(indek,id_kolom,nama_kolom);
}

ItemDefaults.getAccount=(indek,id_kolom,alias)=>{
  const kelas=getEI('item_class_'+indek);
  var isi={};
  
  Accounts.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    let nm_account=undefined;
    if(paket.count!=0){
      nm_account=paket.data.account_name;
    }
    isi=bingkai[indek].default_detail[kelas];
    
    // alert(alias);

    switch(alias){
      case "sales":
        setEV('sales_account_name_'+indek, nm_account);
        isi.sales_account_id=getEV('sales_account_id_'+indek);
        isi.sales_account_name=getEV('sales_account_name_'+indek);
        break;
      case "inventory":
        setEV('inventory_account_name_'+indek, nm_account);
        isi.inventory_account_id=getEV('inventory_account_id_'+indek);
        isi.inventory_account_name=getEV('inventory_account_name_'+indek);
        break;
      case "wage":
        setEV('wage_account_name_'+indek, nm_account);
        isi.wage_account_id=getEV('wage_account_id_'+indek);
        isi.wage_account_name=getEV('wage_account_name_'+indek);
        break;
      case "cogs":
        setEV('cogs_account_name_'+indek, nm_account);
        isi.cogs_account_id=getEV('cogs_account_id_'+indek);
        isi.cogs_account_name=getEV('cogs_account_name_'+indek);
        break;
      case "income":
        setEV('income_account_name_'+indek, nm_account);
        isi.income_account_id=getEV('income_account_id_'+indek);
        isi.income_account_name=getEV('income_account_name_'+indek);
        break;
      case "freight":
        setEV('freight_account_name_'+indek, nm_account);
        break;
      default:
        alert(alias+' undefined. ')
    }
    bingkai[indek].default_detail[kelas]=isi;
  });
}

ItemDefaults.setItemTaxes=(indek,d)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, d.item_tax_id);
}

ItemDefaults.setLocation=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const id_baris=bingkai[indek].id_baris;

  setEV(id_kolom, data.location_id);
  ItemDefaults.getLocation(indek,id_kolom,id_baris);
}

ItemDefaults.getLocation=(indek,id_kolom,baris)=>{
  Locations.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    if(paket.err.id==0){
      setEV('location_name_'+indek, paket.data.location_name);
    }
  });
}

ItemDefaults.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>ItemDefaults.formUpdate(indek));
  ItemDefaults.exportExecute(indek);
}

ItemDefaults.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'item_defaults.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

ItemDefaults.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{ItemDefaults.formUpdate(indek);});
  iii.uploadJSON(indek);
}

ItemDefaults.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "cost_method":d[i][1],
      "item_tax_id":d[i][2],
      "location_id":d[i][3],
      "item_class":d[i][4],
      "default_detail":d[i][5],
      "freight_account_id":d[i][6]
    }
    db3.query(indek,ItemDefaults.url+'/update',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

ItemDefaults.getOne=(indek,callBack)=>{
  db3.query(indek,ItemDefaults.url+'/read_one',{},(paket)=>{
    return callBack(paket);
  });
}
// eof:
