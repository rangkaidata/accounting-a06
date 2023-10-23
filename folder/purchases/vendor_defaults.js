/*
 * auth: budiono;
 * date: sep-11, 15:32, mon-2023; new
 * edit: sep-16, 10:15, sat-2023; mod size;
 */ 
 
'use strict';

var VendorDefaults={
  url:'vendor_defaults',
  title:'Vendor Defaults'
};

VendorDefaults.getDefault=(indek)=>{
  VendorDefaults.getOne(indek,(paket)=>{
    if(paket.err.id==0 && paket.count>0){
      bingkai[indek].data_default=paket.data;
      bingkai[indek].discount_terms=paket.data.discount_terms;
    }else{
      bingkai[indek].data_default={
        'gl_account_id':'',
        'gl_account_name':'',
        'discount_account_id':'',
        'discount_account_name':'',
        'ap_account_id':'',
        'ap_account_name':'',
        'cash_account_id':'',
        'cash_account_name':'',
        'discount_terms':{
          'type':0,
          'due_in':'',
          'discount_in':0,
          'discount_percent':0,
          'displayed':''
        },
        'credit_limit':0
      }
      bingkai[indek].discount_terms=
        bingkai[indek].data_default.discount_terms
    }
  });
}

VendorDefaults.show=(karcis)=>{
  karcis.modul=VendorDefaults.url;
  karcis.menu.name=VendorDefaults.title;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newVen=new BingkaiUtama(karcis);
    const indek=newVen.show();
    VendorDefaults.formUpdate(indek);
  }else{
    show(baru);
  }
}

VendorDefaults.formEntry=(indek)=>{
  // biasakan menulis dengan lengkap:
  // contoh discount, bukan disingkat disc, tetapi tetap discount
  // karena sering terjadi kesalahan link antara kolom.

 bingkai[indek].metode=MODE_UPDATE;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">' 
    +'<details open>'
    +'<summary>Vendor Accounts</summary>'
      +'<ul>'
      +'<li><label>Purchase Acct.:</label>'
        +'<input type="text" id="gl_account_id_'+indek+'"'
        +' onchange="VendorDefaults.getAccount(\''+indek+'\''
        +',\'gl_account_id_'+indek+'\',\'gl\')"'
        +' size="8" style="text-align:center;">'
        
        +'<button type="button" id="btn_find" '
        +' onclick="Accounts.lookUp(\''+indek+'\''
        +',\'gl_account_id_'+indek+'\',\'gl\')">'
        +'</button>'
        
        +'<input type="text" '
        +' id="gl_account_name_'+indek+'" disabled>'
        
        +'</li>'
      
      +'<li><label>Discount Acct.:</label>'
        +'<input type="text"'
        +' id="discount_account_id_'+indek+'"'
        +' onchange="VendorDefaults.getAccount(\''+indek+'\''
        +',\'discount_account_id_'+indek+'\',\'discount\')"'
        +' size="8" style="text-align:center;">'

        +'<button type="button" id="btn_find" '
        +' onclick="Accounts.lookUp(\''+indek+'\''
        +',\'discount_account_id_'+indek+'\',\'discount\')">'
        +'</button>'
        
        +'<input type="text" '
        +' id="discount_account_name_'+indek+'" disabled>'
        +'</li>'
        
      +'<li><label>A/P Account.:</label>'
        +'<input type="text" id="ap_account_id_'+indek+'" '
        +' onchange="VendorDefaults.getAccount(\''+indek+'\''
        +',\'ap_account_id_'+indek+'\',\'ap\')"'
        +' size="8" style="text-align:center;">'
        
        +'<button type="button" id="btn_find" '
        +' onclick="Accounts.lookUp(\''+indek+'\''
        +',\'ap_account_id_'+indek+'\',\'ap\')">'
        +'</button>'
        
        +'<input type="text" '
        +' id="ap_account_name_'+indek+'" disabled>'
        +'</li>'
        
      +'<li><label>Cash Account.:</label>'
        +'<input type="text" id="cash_account_id_'+indek+'" '
        +' onchange="VendorDefaults.getAccount(\''+indek+'\''
        +',\'cash_account_id_'+indek+'\',\'cash\')"'
        +' size="8" style="text-align:center;">'
        
        +'<button type="button" id="btn_find" '
        +' onclick="Accounts.lookUp(\''+indek+'\''
        +',\'cash_account_id_'+indek+'\',\'cash\')">'
        +'</button>'
        
        +'<input type="text" '
        +' id="cash_account_name_'+indek+'" disabled>'
        +'</li>'
      +'</ul>'
    +'</details>'
    
    +'<details open>'
    +'<summary>Payment Terms</summary>'
      +'<ul>'

      +'<li><label>Standar Terms:</label>'
        +'<select id="type_'+indek+'"'
        +' onchange="VendorDefaults.mode(\''+indek+'\');">'
        +getDataTermsType(indek)
        +'</select>'
        +'</li>'

      +'<li><label>Net due in: </label>'
          +'<input type="text" id="due_in_'+indek+'" '
          +' onchange="VendorDefaults.calculateTerms(\''+indek+'\');"'
          +' size="9" style="text-align:center;">'
          +'</li>'
          
        +'<li><label>Discount in: </label>'
          +'<input type="text" id="discount_in_'+indek+'"'
          +' onchange="VendorDefaults.calculateTerms(\''+indek+'\');"'
          +' size="9" style="text-align:center;">'
          +'</li>'
          
        +'<li><label>Discount %: </label>'
          +'<input type="text" id="discount_percent_'+indek+'" '
          +' onchange="VendorDefaults.calculateTerms(\''+indek+'\');"'
          +'size="9" style="text-align:center;">'
          +'</li>'
          
        +'<li><label>Displayed: </label>'
          +'<input type="text"'
          +' id="displayed_'+indek+'"'
          +' size="15"'
          +' style="text-align:center;" disabled>'
          +'</li>'

      +'</ul>'
    +'</details>'
    
    +'<details open>'
    +'<summary>Credit Limit</summary>'
      +'<ul>'
      +'<li><label>Limit:</label>'
        +'<input type="text" id="credit_limit_'+indek+'" '
        +' style="text-align:center;" size="9">'
        +'</li>'

      +'</ul>'
    +'</details>'
    +'</form>'
    +'</div>'

  content.html(indek,html);
  statusbar.ready(indek);
}

VendorDefaults.mode=(indek)=>{
  const mode=document.getElementById('type_'+indek).value;
  document.getElementById('discount_percent_'+indek).disabled=true;
  document.getElementById('discount_in_'+indek).disabled=true;
  document.getElementById('due_in_'+indek).disabled=true;

  document.getElementById('discount_percent_'+indek).value=0;
  document.getElementById('discount_in_'+indek).value=0;
  document.getElementById('due_in_'+indek).value=0;

  switch(Number(mode)){
    case 0:
      document.getElementById('displayed_'+indek).value="C.O.D";
      break;
    case 1:
      document.getElementById('displayed_'+indek).value="Prepaid";
      break;
    default:
      document.getElementById('discount_percent_'+indek).disabled=false;
      document.getElementById('discount_in_'+indek).disabled=false;
      document.getElementById('due_in_'+indek).disabled=false;
      VendorDefaults.calculateTerms(indek);
  }
}

VendorDefaults.calculateTerms=(indek)=>{
  document.getElementById('displayed_'+indek).value
    =document.getElementById('discount_percent_'+indek).value+'% '
    +document.getElementById('discount_in_'+indek).value+', Net '
    +document.getElementById('due_in_'+indek).value+' Days';
}

VendorDefaults.formUpdate=(indek)=>{
  bingkai[indek].metode=MODE_UPDATE;
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.refresh(indek,()=>VendorDefaults.formUpdate(indek));
  toolbar.more(indek,()=>Menu.more(indek));
  VendorDefaults.formEntry(indek);
  VendorDefaults.readOne(indek,()=>{
    toolbar.save(indek,()=>VendorDefaults.updateExecute(indek));
    toolbar.delet(indek,()=>VendorDefaults.deleteExecute(indek));
    toolbar.download(indek,()=>{VendorDefaults.formExport(indek);});
    toolbar.upload(indek,()=>{VendorDefaults.formImport(indek);});
  });
}

VendorDefaults.readOne=(indek,callback)=>{
  db3.readOne(indek,{},(paket)=>{
    if(paket.err.id==0 && paket.count>0){
      const d=paket.data;
      const f=d.discount_terms;

      setEV('gl_account_id_'+indek, d.gl_account_id);
      setEV('gl_account_name_'+indek, d.gl_account_name);
        
      setEV('discount_account_id_'+indek, d.discount_account_id);
      setEV('discount_account_name_'+indek, d.discount_account_name);
      setEV('ap_account_id_'+indek, d.ap_account_id);
      setEV('ap_account_name_'+indek, d.ap_account_name);
      setEV('cash_account_id_'+indek, d.cash_account_id);
      setEV('cash_account_name_'+indek, d.cash_account_name);
        
      setEI('type_'+indek, f.type);
      setEV('due_in_'+indek, f.due_in);
      setEV('discount_in_'+indek, f.discount_in);
      setEV('discount_percent_'+indek, f.discount_percent);
      setEV('displayed_'+indek, f.displayed);

      setEV('credit_limit_'+indek, d.credit_limit);
    };
    message.none(indek);
    return callback();
  });
}

VendorDefaults.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    'gl_account_id':getEV('gl_account_id_'+indek),
    'discount_account_id':getEV('discount_account_id_'+indek),
    'ap_account_id':getEV('ap_account_id_'+indek),
    'cash_account_id':getEV('cash_account_id_'+indek),
    'discount_terms':{
      'type':getEI('type_'+indek),
      'due_in':getEV('due_in_'+indek),
      'discount_in':getEV('discount_in_'+indek),
      'discount_percent':getEV('discount_percent_'+indek),
      'displayed':getEV('displayed_'+indek),     
    },
    'credit_limit':getEV('credit_limit_'+indek),
  });
}

VendorDefaults.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{});
}

VendorDefaults.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  
  setEV(id_kolom, data.account_id);
  VendorDefaults.getAccount(indek,id_kolom,nama_kolom);
}

VendorDefaults.getAccount=(indek,id_kolom,alias)=>{
  Accounts.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    let nm_account=undefined;
    if(paket.count!=0){
      nm_account=paket.data.account_name;
    }
    switch(alias){
      case "ap":
        setEV('ap_account_name_'+indek, nm_account);
        break;
      case "gl":
        setEV('gl_account_name_'+indek, nm_account);
        break;
      case "cash":
        setEV('cash_account_name_'+indek, nm_account);
        break;
      case "discount":
        setEV('discount_account_name_'+indek, nm_account);
        break;
      default:
        alert(alias+' undefined in [vendor_defaults.js]')
    }
  });
}

VendorDefaults.getRecord=(indek,callback)=>{
  db3.query(indek,'vendor_defaults/read_one',{},
  (paket)=>{
    if(paket.err.id==0 && paket.count>0){
      return callback(paket);
    }else{
      console.log(paket);
    }
  })  
}

VendorDefaults.getOne=(indek,callBack)=>{
  db3.query(indek,VendorDefaults.url+'/read_one',{},(paket)=>{
    return callBack(paket);
  });
}

VendorDefaults.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>VendorDefaults.formUpdate(indek));
  VendorDefaults.exportExecute(indek);
}

VendorDefaults.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'vendor_defaults.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

VendorDefaults.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{VendorDefaults.formUpdate(indek);});
  iii.uploadJSON(indek);
}

VendorDefaults.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      'gl_account_id':d[i][1],
      'discount_account_id':d[i][2],
      'ap_account_id':d[i][3],
      'cash_account_id':d[i][4],
      'discount_terms':d[i][5],
      'credit_limit':d[i][6],
    }
    db3.query(indek,VendorDefaults.url+'/update',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

// eof:
