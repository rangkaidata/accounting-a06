/*
 * name: budiono;
 * date: sep-11, 16:09, mon-2023; new;
 * edit: sep-12, 12:18, tue-2023; 
 * edit: sep-16, 11:14, sat-2023; 
 * edit: sep-18, 16:25, mon-2023; 
 * edit: sep-19, 21:33, tue-2023;
 */ 
 
'use strict';

var CustomerDefaults={
  url:'customer_defaults',
  title:'Customer Defaults'
};

CustomerDefaults.getDefault=(indek)=>{
  CustomerDefaults.getOne(indek,(paket)=>{
    if(paket.err.id==0 && paket.count>0){
      bingkai[indek].data_default=paket.data;
    }else{
      bingkai[indek].data_default={
        'gl_account_id':'',
        'gl_account_name':'',
        'discount_account_id':'',
        'discount_account_name':'',
        'ar_account_id':'',
        'ar_account_name':'',
        'cash_account_id':'',
        'cash_account_name':'',
        'pay_method_id':'',
        'discount_terms':{
          'type':0,
          'due_in':'',
          'discount_in':0,
          'discount_percent':0,
          'displayed':''
        },
        'credit_limit':0
      }
    }
  });
}

CustomerDefaults.show=(karcis)=>{
  karcis.modul=CustomerDefaults.url;
  karcis.menu.name=CustomerDefaults.title;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newVen=new BingkaiUtama(karcis);
    const indek=newVen.show();
    CustomerDefaults.formUpdate(indek);
  }else{
    show(baru);
  }
}

CustomerDefaults.formEntry=(indek)=>{
  bingkai[indek].metode=MODE_UPDATE;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off">' 
    +'<details open>'
    +'<summary>Customer Accounts</summary>'
      +'<ul>'
      +'<li><label>GL Sales Acct.:</label>'
        +'<input type="text" style="text-align:center;"'
          +' id="gl_account_id_'+indek+'"'
          +' onchange="CustomerDefaults.getAccount(\''+indek+'\''
          +',\'gl_account_id_'+indek+'\',\'gl\')"'
          +' size="8">'
        
        +'<button type="button"'
          +' id="btn_find" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'gl_account_id_'+indek+'\',\'gl\')">'
          +'</button>'
        
        +'<input type="text" id="gl_account_name_'+indek+'"'
          +' disabled>'
          +'</li>'
      
      +'<li><label>Discount Acct.:</label>'
        +'<input type="text"'
          +' style="text-align:center;"'
          +' id="discount_account_id_'+indek+'"'
          +' onchange="CustomerDefaults.getAccount(\''+indek+'\''
          +',\'discount_account_id_'+indek+'\',\'discount\')"'
          +' size="8">'
          
        +'<button type="button"'
          +' id="btn_find" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'discount_account_id_'+indek+'\',\'discount\')">'
          +'</button>'

        +'<input type="text" '
          +' id="discount_account_name_'+indek+'" disabled>'
          +'</li>'
        
      +'<li><label>AR Account.:</label>'
        +'<input type="text"'
          +' style="text-align:center;"'
          +' id="ar_account_id_'+indek+'"'
          +' onchange="CustomerDefaults.getAccount(\''+indek+'\''
          +',\'ar_account_id_'+indek+'\',\'ar\')"'
          +' size="8">'
        
        +'<button type="button" id="btn_find" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'ar_account_id_'+indek+'\',\'ar\')">'
          +'</button>'

        +'<input type="text"'
          +' id="ar_account_name_'+indek+'"'
          +' disabled>'
          +'</li>'

      +'<li><label>Cash Account.:</label>'
        +'<input type="text"'
          +' style="text-align:center;"'
          +' id="cash_account_id_'+indek+'"'
          +' onchange="CustomerDefaults.getAccount(\''+indek+'\''
          +',\'cash_account_id_'+indek+'\',\'cash\')"'
          +' size="8">'
        
        +'<button type="button" id="btn_find" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'cash_account_id_'+indek+'\',\'cash\')">'
          +'</button>'
        
        +'<input type="text"'
          +' id="cash_account_name_'+indek+'"disabled>'
          +'</li>'

      +'<li><label>Paymt Method:</label>'
        +'<input type="text"'
          +' style="text-align:center;"'
          +' id="pay_method_id_'+indek+'"'
          +' size="8">'
        
        +'<button type="button" id="btn_find" '
          +' onclick="PayMethods.lookUp(\''+indek+'\''
          +',\'pay_method_id_'+indek+'\')">'
          +'</button>'
        +'</li>'
        
      +'</ul>'
    +'</details>'
    
    +'<details open>'
    +'<summary>Payment Terms</summary>'
      +'<ul>'

      +'<li><label>Standar Terms:</label>'
        +'<select id="terms_type_'+indek+'" '
        +' onchange="CustomerDefaults.mode(\''+indek+'\')">'
        +getDataTermsType(indek)
        +'</select>'
        +'</li>'

      +'<li><label>Net due in: </label>'
          +'<input type="text" '
          +' id="terms_due_in_'+indek+'" size="5"'
          +' onchange="CustomerDefaults.calculateTerms(\''+indek+'\');"'
          +' style="text-align:center;"></li>'
          
        +'<li><label>Discount in: </label>'
          +'<input type="text" '
          +' id="terms_discount_in_'+indek+'" size="5"'
          +' onchange="CustomerDefaults.calculateTerms(\''+indek+'\');"'
          +' style="text-align:center;"></li>'
          
        +'<li><label>Discount %: </label>'
          +'<input type="text"'
          +' id="terms_discount_percent_'+indek+'" size="5"'
          +' onchange="CustomerDefaults.calculateTerms(\''+indek+'\');"'
          +' style="text-align:center;"></li>'
          
        +'<li><label>Displayed: </label>'
          +'<input type="text"'
          +' id="terms_displayed_'+indek+'"'
          +' size="15"'
          +' style="text-align:center;"'
          +' disabled></li>'

      +'</ul>'
    +'</details>'
    
    +'<details open>'
    +'<summary>Credit Limit</summary>'
      +'<ul>'
      +'<li><label>Limit:</label>'
        +'<input type="text" '
        +' id="credit_limit_'+indek+'" size="5"'
        +' style="text-align:center;"></li>'

      +'</ul>'
    +'</details>'
    +'</form>'
    +'</div>'

  content.html(indek,html);
  statusbar.ready(indek);
}

CustomerDefaults.mode=(indek)=>{
  const mode=document.getElementById('terms_type_'+indek).value;
  document.getElementById('terms_discount_percent_'+indek).disabled=true;
  document.getElementById('terms_discount_in_'+indek).disabled=true;
  document.getElementById('terms_due_in_'+indek).disabled=true;

  document.getElementById('terms_discount_percent_'+indek).value=0;
  document.getElementById('terms_discount_in_'+indek).value=0;
  document.getElementById('terms_due_in_'+indek).value=0;

  switch(Number(mode)){
  case 0:
    document.getElementById('terms_displayed_'+indek).value="C.O.D";
    break;
  case 1:
    document.getElementById('terms_displayed_'+indek).value="Prepaid";
    break;
  default:
    document.getElementById('terms_discount_percent_'+indek).disabled=false;
    document.getElementById('terms_discount_in_'+indek).disabled=false;
    document.getElementById('terms_due_in_'+indek).disabled=false;
    CustomerDefaults.calculateTerms(indek);
  }
}

CustomerDefaults.calculateTerms=(indek)=>{
  document.getElementById('terms_displayed_'+indek).value
    =document.getElementById('terms_discount_percent_'+indek).value+'% '
    +document.getElementById('terms_discount_in_'+indek).value+', Net '
    +document.getElementById('terms_due_in_'+indek).value+' Days';
}

CustomerDefaults.formUpdate=(indek)=>{
  bingkai[indek].metode=MODE_UPDATE;

  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.more(indek,()=>Menu.more(indek));
  toolbar.refresh(indek,()=>CustomerDefaults.formUpdate(indek));
  CustomerDefaults.formEntry(indek);
  CustomerDefaults.readOne(indek,()=>{
    toolbar.save(indek,()=>CustomerDefaults.updateExecute(indek));
    toolbar.delet(indek,()=>CustomerDefaults.deleteExecute(indek));
    toolbar.download(indek,()=>{CustomerDefaults.formExport(indek);});
    toolbar.upload(indek,()=>{CustomerDefaults.formImport(indek);});
  });
}

CustomerDefaults.readOne=(indek,callback)=>{
  db3.readOne(indek,{},(paket)=>{
    if(paket.err.id==0 && paket.count>0){
      const d=paket.data;
      const t=paket.data.discount_terms;
      
      setEV('gl_account_id_'+indek, d.gl_account_id);
      setEV('gl_account_name_'+indek, d.gl_account_name);
      setEV('discount_account_id_'+indek, d.discount_account_id);
      setEV('discount_account_name_'+indek, d.discount_account_name);
      setEV('ar_account_id_'+indek, d.ar_account_id);
      setEV('ar_account_name_'+indek, d.ar_account_name);
      setEV('cash_account_id_'+indek, d.cash_account_id);
      setEV('cash_account_name_'+indek, d.cash_account_name);
      setEV('pay_method_id_'+indek, d.pay_method_id);

      setEI('terms_type_'+indek, t.type);
      setEV('terms_due_in_'+indek, t.due_in);
      setEV('terms_discount_in_'+indek, t.discount_in);
      setEV('terms_discount_percent_'+indek, t.discount_percent);
      setEV('terms_displayed_'+indek, t.displayed);

      setEV('credit_limit_'+indek, d.credit_limit);
      
      // CustomerDefaults.mode(indek);
    };
    message.none(indek);
    return callback();
  });
}

CustomerDefaults.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    'gl_account_id':getEV('gl_account_id_'+indek),
    'discount_account_id':getEV('discount_account_id_'+indek),
    'ar_account_id':getEV('ar_account_id_'+indek),
    'cash_account_id':getEV('cash_account_id_'+indek),
    'pay_method_id':getEV('pay_method_id_'+indek),
    'discount_terms':{
      'type':getEI('terms_type_'+indek),
      'due_in':getEV('terms_due_in_'+indek),
      'discount_in':getEV('terms_discount_in_'+indek),
      'discount_percent':getEV('terms_discount_percent_'+indek),
      'displayed':getEV('terms_displayed_'+indek)
    },
    'credit_limit':getEV('credit_limit_'+indek)
  });
}

CustomerDefaults.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{});
}

CustomerDefaults.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  
  setEV(id_kolom, data.account_id);
  CustomerDefaults.getAccount(indek,id_kolom,nama_kolom);
}

CustomerDefaults.getAccount=(indek,id_kolom,alias)=>{
  Accounts.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    let nm_account=undefined;
    if(paket.count!=0){
      nm_account=paket.data.account_name;
    }
    switch(alias){
      case "ar":
        setEV('ar_account_name_'+indek, nm_account);
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
        alert(alias+' undefined in [customer_defaults.js]')
    }
  });
}

CustomerDefaults.getOne=(indek,callBack)=>{
  db3.query(indek,CustomerDefaults.url+'/read_one',{},(paket)=>{
    return callBack(paket);
  });
}

CustomerDefaults.setPayMethod=(indek,d)=>{
  setEV('pay_method_id_'+indek, d.pay_method_id);
}

CustomerDefaults.formExport=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>CustomerDefaults.formUpdate(indek));
  CustomerDefaults.exportExecute(indek);
}

CustomerDefaults.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'customer_defaults.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

CustomerDefaults.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{CustomerDefaults.formUpdate(indek);});
  iii.uploadJSON(indek);
}

CustomerDefaults.importExecute=(indek)=>{
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
      'ar_account_id':d[i][3],
      'cash_account_id':d[i][4],
      'pay_method_id':d[i][5],
      'discount_terms':d[i][6],
      'credit_limit':d[i][7],
      'finance_charges':d[i][8]
    }
    db3.query(indek,CustomerDefaults.url+'/update',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}
//eof: 
