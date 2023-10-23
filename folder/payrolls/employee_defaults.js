/*
 * name: budiono
 * date: sep-12, 13:07, tue-2023; new;
 */

'use strict';

var EmployeeDefaults={
  url:'employee_defaults',
  title:'Employee Defaults',
  hourly:{},
  salary:{},
  field:{},
  payroll:{}
};

EmployeeDefaults.show=(karcis)=>{
  karcis.modul=EmployeeDefaults.url;
  karcis.menu.name=EmployeeDefaults.title;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newVen=new BingkaiUtama(karcis);
    const indek=newVen.show();
    EmployeeDefaults.formUpdate(indek);
  }else{
    show(baru);
  }
}

EmployeeDefaults.getDefault=(indek,res)=>{
  EmployeeDefaults.getOne(indek,(paket)=>{
    if(paket.err.id==0 && paket.count>0){
      bingkai[indek].data_default=paket.data;
    }else{
      bingkai[indek].data_default={
        'gl_account_id':'a',
        'gl_account_name':'b',
        'cash_account_id':'c',
        'cash_account_name':'d',
        'hourly_detail':[{
          'row_id':0,
          'field_name':'',
          'gl_account_id':''
        }],
        'salary_detail':[{
          'row_id':0,
          'field_name':'',
          'gl_account_id':''
        }],
        'employee_detail':[{
          'row_id':0,
          'field_name':'',
          'field_type':0,
          'gl_account_id':'',
          'formula':-1,
          'amount':0
        }],
        'payroll_detail':[{
          'row_id':0,
          'field_name':'',
          'liability_account_id':'',
          'expense_account_id':'',
          'formula':-1,
          'amount':0
        }],
      }
    }
    return res();
  });  
}

EmployeeDefaults.formUpdate=(indek)=>{
  bingkai[indek].metode=MODE_UPDATE;
  EmployeeDefaults.formEntry(indek);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.more(indek,()=>Menu.more(indek));
  toolbar.refresh(indek,()=>EmployeeDefaults.formUpdate(indek));
  EmployeeDefaults.readOne(indek,()=>{
    toolbar.save(indek,()=>EmployeeDefaults.updateExecute(indek));
    toolbar.delet(indek,()=>EmployeeDefaults.deleteExecute(indek));
    toolbar.download(indek,()=>{EmployeeDefaults.formExport(indek);});
    toolbar.upload(indek,()=>{EmployeeDefaults.formImport(indek);});
  });
}

EmployeeDefaults.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    'cash_account_id':getEV('cash_account_id_'+indek),
    'pay_frequency':getEI('pay_frequency_'+indek),
    'hourly_detail':bingkai[indek].hourly_detail,
    'salary_detail':bingkai[indek].salary_detail,
    'employee_detail':bingkai[indek].employee_detail,
    'payroll_detail':bingkai[indek].payroll_detail
  });
}

EmployeeDefaults.formEntry=(indek)=>{
  bingkai[indek].metode=MODE_UPDATE;

  var html=''
    +'<div style="padding:0.5rem">'
      +content.title(indek)
      +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
      +'<form autocomplete="off">' 
      
        +'<details open>'
          +'<summary>Account</summary>'

          +'<ul>'
          +'<li><label>Cash Account:</label>'
            +'<input type="text"'
            +' id="cash_account_id_'+indek+'"'
            +' onchange="EmployeeDefaults.getAccount(\''+indek+'\''
            +',\'cash_account_id_'+indek+'\',\'cash\')"'
            +' size="8" style="text-align:center;">'
            
            +'<button type="button"'
            +' id="btn_find" '
            +' onclick="Accounts.lookUp(\''+indek+'\''
            +',\'cash_account_id_'+indek+'\',\'cash\')">'
            +'</button>'
            
            +'<input type="text" '
            +' id="cash_account_name_'+indek+'" disabled>'
            
            +'</li>'
          +'<li><label>Pay Frequency:</label>'
            +'<select id="pay_frequency_'+indek+'">'
            // +' onchange="PayrollPeriods.startDate(\''+indek+'\')">'
            +getDataPayFrequency(indek)
            +'</select></li>'
          +'</ul>'

        +'</details>'
        
        +'<details open>'
          +'<summary>Hourly Field</summary>'
          +'<div id="hourly_detail_'+indek+'" style="width:0;">'
          +'</div>'
        +'</details>'  
        
        +'<details open>'
          +'<summary>Salary Field</summary>'
          +'<div id="salary_detail_'+indek+'" style="width:0;">'
          +'</div>'
        +'</details>'
        
        +'<details open>'
          +'<summary>Deduction and Addition Field</summary>'          
          +'<div id="employee_detail_'+indek+'" style="width:0;">'
          +'</div>'
        +'</details>'

        +'<details open>'
          +'<summary>Payrol Tax Field</summary>'
          +'<div id="payroll_detail_'+indek+'" style="width:0;">'
          +'</div>'
        +'</details>'

      +'</form>'
    +'</div>'

  content.html(indek,html);
  statusbar.ready(indek);
}

EmployeeDefaults.readOne=(indek,callback)=>{
  EmployeeDefaults.hourly.setRows(indek,[]);
  EmployeeDefaults.salary.setRows(indek,[]);
  EmployeeDefaults.field.setRows(indek,[]);
  EmployeeDefaults.payroll.setRows(indek,[]);
  
  db3.readOne(indek,{},(paket)=>{
    if(paket.err.id==0 && paket.count>0){
      const a=paket.data;
      
      setEV('cash_account_id_'+indek,a.cash_account_id);
      setEV('cash_account_name_'+indek,a.cash_account_name);
      setEV('pay_frequency_'+indek,a.pay_frequency);
      
      EmployeeDefaults.hourly.setRows(indek,a.hourly_detail);
      EmployeeDefaults.salary.setRows(indek,a.salary_detail);
      EmployeeDefaults.field.setRows(indek,a.employee_detail);
      EmployeeDefaults.payroll.setRows(indek,a.payroll_detail);
    }
    message.none(indek);
    return callback();
  });
}

EmployeeDefaults.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  
  document.getElementById(id_kolom).value=data.account_id;

  switch (nama_kolom){
    case "cash":
      document.getElementById('cash_account_name_'+indek).value=data.account_name;
      break;
    case "hourly":
      setEV(id_kolom,data.account_id);
      EmployeeDefaults.hourly.setCell(indek,id_kolom); 
      break;
    case "salary":
      setEV(id_kolom, data.account_id);
      EmployeeDefaults.salary.setCell(indek,id_kolom); 
      break;
    case "employee":
      setEV(id_kolom, data.account_id);
      EmployeeDefaults.field.setCell(indek,id_kolom); 
      break;
    case "liability":
      setEV(id_kolom, data.account_id);
      EmployeeDefaults.payroll.setCell(indek,id_kolom); 
      break;
    case "expense":
      setEV(id_kolom, data.account_id);
      EmployeeDefaults.payroll.setCell(indek,id_kolom); 
      break;
    default:
      alert(nama_kolom+' belum kedaftar.')
  }
}

EmployeeDefaults.hourly.setRows=(indek,isi)=>{  
  if(isi===undefined)isi=[];    
  var panjang=isi.length;
  
  var html=EmployeeDefaults.hourly.tableHead(indek);
  
  bingkai[indek].hourly_detail=isi;
  
  for (var i=0;i<panjang;i++){

    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    
    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="hourly_field_name_'+i+'_'+indek+'"'
      +' value="'+isi[i].field_name+'"'
      +' onchange="EmployeeDefaults.hourly.setCell(\''+indek+'\''
      +',\'hourly_field_name_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"'
      +' placeholder="Hourly field"'
      +' style="text-align:left"'
      +' size="10">'
      +'</td>'
    
    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="hourly_gl_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].gl_account_id+'"'
      +' onchange="EmployeeDefaults.hourly.setCell(\''+indek+'\''
      +',\'hourly_gl_account_id_'+i+'_'+indek+'\''
      +',\'hourly\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center;"'
      +' size="8">'
      +'</td>'
      
    +'<td><button type="button"'
      +' id="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'hourly_gl_account_id_'+i+'_'+indek+'\''
      +',\'hourly\');">'
      +'</button>'
      +'</td>'

    +'<td align="center">'
      +'<button type="button"'
      +' id="btn_add"'
      +' onclick="EmployeeDefaults.hourly.addRow(\''+indek+'\','+i+')" >'
      +'</button>'
      
      +'<button type="button"'
      +' id="btn_remove"'
      +' onclick="EmployeeDefaults.hourly.removeRow(\''+indek+'\','+i+')" >'
      +'</button>'
    +'</td>'
    +'</tr>';
  }
  html+=EmployeeDefaults.hourly.tableFoot(indek);
  document.getElementById('hourly_detail_'+indek).innerHTML=html;
  if(panjang==0)EmployeeDefaults.hourly.addRow(indek,0);
}

EmployeeDefaults.hourly.tableHead=(indek)=>{
  return '<table>'
  +'<thead>'
    +'<tr>'
    +'<th colspan="2">Field Name</th>'
    +'<th colspan="2">G/L Account</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
  +'</thead>';
}

EmployeeDefaults.hourly.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan=5>&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

EmployeeDefaults.hourly.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].hourly_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) newRow(newBasket);
  }
  if(oldBasket.length==0) newRow(newBasket);
  EmployeeDefaults.hourly.setRows(indek,newBasket);
  
  function newRow(newBas){
    var myItem={};
    myItem.row_id=newBas.length+1;
    myItem.field_name='';
    myItem.gl_account_id='';
    newBas.push(myItem);
  }
}

EmployeeDefaults.hourly.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].hourly_detail;
  var newBasket=[];
  
  EmployeeDefaults.hourly.setRows(indek,oldBasket);
  for(let i=0;i<oldBasket.length;i++){
    if (i!=(number)){
      newBasket.push(oldBasket[i]);
    }
  }
  EmployeeDefaults.hourly.setRows(indek,newBasket);
}

EmployeeDefaults.hourly.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].hourly_detail;
  var baru = [];
  var isiEdit = {};

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    if(id_kolom==('hourly_field_name_'+i+'_'+indek)){
      isiEdit.field_name=getEV(id_kolom);
      baru.push(isiEdit);
            
    }else if(id_kolom==('hourly_gl_account_id_'+i+'_'+indek)){
      isiEdit.gl_account_id=getEV(id_kolom);
      baru.push(isiEdit);

    }else{
      baru.push(isi[i]);
    }
  }
}

EmployeeDefaults.salary.setRows=(indek,isi)=>{
  if(isi===undefined)isi=[];    
  var panjang=isi.length;
  var html=EmployeeDefaults.salary.tableHead(indek);
  
  bingkai[indek].salary_detail=isi;
  
  for (var i=0;i<panjang;i++){

    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    
    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="salary_field_name_'+i+'_'+indek+'"'
      +' value="'+isi[i].field_name+'"'
      +' onchange="EmployeeDefaults.salary.setCell(\''+indek+'\''
      +',\'salary_field_name_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"'
      +' placeholder="Salary field"'
      +' style="text-align:left"'
      +' size="10">'
      +'</td>'
    
    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="salary_gl_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].gl_account_id+'"'
      +' onchange="EmployeeDefaults.salary.setCell(\''+indek+'\''
      +',\'salary_gl_account_id_'+i+'_'+indek+'\',\'salary\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center;"'
      +' size="8">'
      +'</td>'
      
    +'<td><button type="button"'
      +' id="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'salary_gl_account_id_'+i+'_'+indek+'\',\'salary\');">'
      +'</button>'
      +'</td>'

    +'<td align="center">'
      +'<button type="button"'
      +' id="btn_add"'
      +' onclick="EmployeeDefaults.salary.addRow(\''+indek+'\','+i+')" >'
      +'</button>'
      
      +'<button type="button"'
      +' id="btn_remove"'
      +' onclick="EmployeeDefaults.salary.removeRow(\''+indek+'\','+i+')" >'
      +'</button>'
    +'</td>'
    +'</tr>';

  }
  
  html+=EmployeeDefaults.salary.tableFoot(indek);
  var budi = JSON.stringify(isi);
  document.getElementById('salary_detail_'+indek).innerHTML=html;
  
  if(panjang==0)EmployeeDefaults.salary.addRow(indek,0);
}

EmployeeDefaults.salary.tableHead=(indek)=>{
  return '<table>'
  +'<thead>'
    +'<tr>'
    +'<th colspan="2">Field Name</th>'
    +'<th colspan="2">G/L Account</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
  +'</thead>';
}

EmployeeDefaults.salary.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan=5>&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

EmployeeDefaults.salary.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].salary_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris)newRow(newBasket);
  }
  if(oldBasket.length==0) newRow(newBasket);
  EmployeeDefaults.salary.setRows(indek,newBasket);
  
  function newRow(newBas){
    var myItem={};
    myItem.row_id=newBasket.length+1;
    myItem.field_name='';
    myItem.gl_account_id='';
    newBas.push(myItem);
  }  
}

EmployeeDefaults.salary.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].salary_detail;
  var newBasket=[];
  
  EmployeeDefaults.salary.setRows(indek,oldBasket);
  for(let i=0;i<oldBasket.length;i++){
    if (i!=(number)){
      newBasket.push(oldBasket[i]);
    }
  }
  EmployeeDefaults.salary.setRows(indek,newBasket);
}

EmployeeDefaults.salary.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].salary_detail;
  var baru = [];
  var isiEdit = {};

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    if(id_kolom==('salary_field_name_'+i+'_'+indek)){
      isiEdit.field_name=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
            
    }else if(id_kolom==('salary_gl_account_id_'+i+'_'+indek)){
      isiEdit.gl_account_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);

    }else{
      baru.push(isi[i]);
    }
  }
}

EmployeeDefaults.getRecord=(indek,callback)=>{
  db3.query(indek,'employee_defaults/read_one',{},(paket)=>{
    if(paket.err.id==0 && paket.count>0){
      return callback(paket);
    }
  })
}

EmployeeDefaults.getOne=(indek,callBack)=>{
  db3.query(indek,EmployeeDefaults.url+'/read_one',{},(paket)=>{
    return callBack(paket);
  });
}

EmployeeDefaults.getAccount=(indek,id_kolom,alias)=>{
  Accounts.getOne(indek,
    document.getElementById(id_kolom).value,
  (paket)=>{
    let nm_account=undefined;
    if(paket.count!=0){
      nm_account=paket.data.account_name;
    }
    switch(alias){
      case "cash":
        setEV('cash_account_name_'+indek, nm_account);
        break;
      default:
        alert(alias+' undefined. ')
    }
  });
}

EmployeeDefaults.field.setRows=(indek,isi)=>{
  if(isi===undefined)isi=[];    
  var panjang=isi.length;
  var html=EmployeeDefaults.field.tableHead(indek);
  bingkai[indek].employee_detail=isi;

  for (var i=0;i<panjang;i++){
    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    
    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="employee_field_name_'+i+'_'+indek+'"'
      +' value="'+isi[i].field_name+'"'
      +' size="10" placeholder="Employee Field"'
      +' style="text-align:left"'
      +' onchange="EmployeeDefaults.field.setCell(\''+indek+'\''
      +',\'employee_field_name_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()">'
      +'</td>'

    +'<td>'
      +'<select id="employee_field_type_'+i+'_'+indek+'"'
      +' onchange="EmployeeDefaults.field.setCell(\''+indek+'\''
      +',\'employee_field_type_'+i+'_'+indek+'\')">'
      +getDataFieldType(indek, isi[i].field_type)
      +'</select>'
    +'</td>'

    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="employee_gl_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].gl_account_id+'"'
      +' onchange="EmployeeDefaults.field.setCell(\''+indek+'\''
      +',\'employee_gl_account_id_'+i+'_'+indek+'\',\'employee\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center;"'
      +' size="8">'
      +'</td>'
      
    +'<td><button type="button"'
      +' id="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'employee_gl_account_id_'+i+'_'+indek+'\',\'employee\');">'
      +'</button>'
      +'</td>'
    
    +'<td  align="center" style="padding:0;margin:0;">'  
    +'<select id="employee_formula_'+i+'_'+indek+'"'
      +' onchange="EmployeeDefaults.field.setCell(\''+indek+'\''
      +',\'employee_formula_'+i+'_'+indek+'\')">'
      +getFormula(indek,isi[i].formula)
      +'</select>'
      +'</td>'

    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="employee_amount_'+i+'_'+indek+'"'
      +' value="'+isi[i].amount+'"'
      +' onchange="EmployeeDefaults.field.setCell(\''+indek+'\''
      +',\'employee_amount_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center"'
      +' size="5" >'
      +'</td>'

    +'<td align="center">'
      +'<button type="button"'
      +' id="btn_add"'
      +' onclick="EmployeeDefaults.field.addRow(\''+indek+'\','+i+')" >'
      +'</button>'

      +'<button type="button"'
      +' id="btn_remove"'
      +' onclick="EmployeeDefaults.field.removeRow(\''+indek+'\','+i+')" >'
      +'</button>'
    +'</td>'
    +'</tr>';
  }

  html+=EmployeeDefaults.field.tableFoot(indek);
  document.getElementById('employee_detail_'+indek).innerHTML=html;
  if(panjang==0)EmployeeDefaults.field.addRow(indek,0);
}

EmployeeDefaults.field.tableHead=(indek)=>{
  return '<table>'
  +'<thead>'
    +'<tr>'
    +'<th colspan="2">Field Name</th>'
    +'<th>Field Type</th>'
    +'<th colspan="2">G/L Account</th>'
    +'<th>Formula</th>'
    +'<th>Amount</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
  +'</thead>';
}

EmployeeDefaults.field.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td>&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

EmployeeDefaults.field.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].employee_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) newRow(newBasket);
  }
  if(oldBasket.length==0) newRow(newBasket);
  EmployeeDefaults.field.setRows(indek,newBasket);

  function newRow(newBas){
    var myItem={};
    myItem.row_id=newBas.length+1;
    myItem.field_name='';
    myItem.field_type=0;
    myItem.gl_account_id='';
    myItem.formula=-1;
    myItem.amount=0;
    newBas.push(myItem);
  }
}

EmployeeDefaults.field.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].employee_detail;
  var newBasket=[];

  EmployeeDefaults.field.setRows(indek,oldBasket);
  for(let i=0;i<oldBasket.length;i++){
    if (i!=(number)){
      newBasket.push(oldBasket[i]);
    }
  }
  EmployeeDefaults.field.setRows(indek,newBasket);
}

EmployeeDefaults.field.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].employee_detail;
  var baru = [];
  var isiEdit = {};

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    if(id_kolom==('employee_field_name_'+i+'_'+indek)){
      isiEdit.field_name=getEV(id_kolom);
      baru.push(isiEdit);
      
    }else if(id_kolom==('employee_field_type_'+i+'_'+indek)){
      isiEdit.field_type=getEI(id_kolom);
      baru.push(isiEdit);
            
    }else if(id_kolom==('employee_gl_account_id_'+i+'_'+indek)){
      isiEdit.gl_account_id=getEV(id_kolom);
      baru.push(isiEdit);
      
    }else if(id_kolom==('employee_formula_'+i+'_'+indek)){
      isiEdit.formula=getEI(id_kolom);
      baru.push(isiEdit);
      
    }else if(id_kolom==('employee_amount_'+i+'_'+indek)){
      isiEdit.amount=getEV(id_kolom);
      baru.push(isiEdit);

    }else{
      baru.push(isi[i]);
    }
  }
}

EmployeeDefaults.payroll.setRows=(indek,isi)=>{
  if(isi===undefined)isi=[];    
  var panjang=isi.length;
  var html=EmployeeDefaults.payroll.tableHead(indek);
  bingkai[indek].payroll_detail=isi;
  
  for (var i=0;i<panjang;i++){
    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    
    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="payroll_field_name_'+i+'_'+indek+'"'
      +' value="'+isi[i].field_name+'"'
      +' onchange="EmployeeDefaults.payroll.setCell(\''+indek+'\''
      +',\'payroll_field_name_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"'
      +' placeholder="Payroll Field"'
      +' style="text-align:left"'
      +' size="10" >'
      +'</td>'

    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="payroll_liability_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].liability_account_id+'"'
      +' onchange="EmployeeDefaults.payroll.setCell(\''+indek+'\''
      +',\'payroll_liability_account_id_'+i+'_'+indek+'\''
      +',\'liability\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center;"'
      +' size="8">'
      +'</td>'

    +'<td style="padding:0;margin:0;">'
      +'<button type="button"'
      +' id="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'payroll_liability_account_id_'+i+'_'+indek+'\''
      +',\'liability\');">'
      +'</button>'
      +'</td>'

    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="payroll_expense_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].expense_account_id+'"'
      +' onchange="EmployeeDefaults.payroll.setCell(\''+indek+'\''
      +',\'payroll_expense_account_id_'+i+'_'+indek+'\''
      +',\'expense\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center;"'
      +' size="8">'
      +'</td>'
      
    +'<td style="padding:0;margin:0;">'
      +'<button type="button"'
      +' id="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'payroll_expense_account_id_'+i+'_'+indek+'\''
      +',\'expense\');">'
      +'</button>'
      +'</td>'
      
    +'<td  align="center" style="padding:0;margin:0;">'  
    +'<select id="payroll_formula_'+i+'_'+indek+'"'
      +' onchange="EmployeeDefaults.payroll.setCell(\''+indek+'\''
      +',\'payroll_formula_'+i+'_'+indek+'\')">'
      +getFormula(indek,isi[i].formula)
      +'</select>'
      +'</td>'
      
    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="payroll_amount_'+i+'_'+indek+'"'
      +' value="'+isi[i].amount+'"'
      +' onchange="EmployeeDefaults.payroll.setCell(\''+indek+'\''
      +',\'payroll_amount_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center"'
      +' size="3" >'
      +'</td>'
      
    +'<td align="center">'
      +'<button type="button"'
      +' id="btn_add"'
      +' onclick="EmployeeDefaults.payroll.addRow(\''+indek+'\','+i+')" >'
      +'</button>'
      
      +'<button type="button"'
      +' id="btn_remove"'
      +' onclick="EmployeeDefaults.payroll.removeRow(\''+indek+'\','+i+')" >'
      +'</button>'
    +'</td>'
    +'</tr>';
  }
  html+=EmployeeDefaults.payroll.tableFoot(indek);
  document.getElementById('payroll_detail_'+indek).innerHTML=html;
  if(panjang==0)EmployeeDefaults.payroll.addRow(indek,0);
}

EmployeeDefaults.payroll.tableHead=(indek)=>{
  return '<table>'
  +'<thead>'
    +'<tr>'
    +'<th colspan="2">Field Name</th>'
    +'<th colspan="2">Liability Account</th>'
    +'<th colspan="2">Expense Account</th>'
    +'<th>Formula</th>'
    +'<th>Amount</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
  +'</thead>';
}

EmployeeDefaults.payroll.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan="9">&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

EmployeeDefaults.payroll.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].payroll_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) newRow(newBasket);
  }
  if(oldBasket.length==0) newRow(newBasket);
  EmployeeDefaults.payroll.setRows(indek,newBasket);

  function newRow(newBas){
    var myItem={};
    myItem.row_id=newBas.length+1;
    myItem.field_name='';
    myItem.liability_account_id='';
    myItem.expense_account_id='';
    myItem.formula=-1;
    myItem.amount=0;
    newBas.push(myItem);
  }
}

EmployeeDefaults.payroll.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].payroll_detail;
  var baru=[];
  var isiEdit={};

  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    if(id_kolom==('payroll_field_name_'+i+'_'+indek)){
      isiEdit.field_name=getEV(id_kolom);
      baru.push(isiEdit);
            
    }else if(id_kolom==('payroll_liability_account_id_'+i+'_'+indek)){
      isiEdit.liability_account_id=getEV(id_kolom);
      baru.push(isiEdit);
      
    }else if(id_kolom==('payroll_expense_account_id_'+i+'_'+indek)){
      isiEdit.expense_account_id=getEV(id_kolom);
      baru.push(isiEdit);

    }else if(id_kolom==('payroll_formula_'+i+'_'+indek)){
      isiEdit.formula=getEI(id_kolom);
      baru.push(isiEdit);
      
    }else if(id_kolom==('payroll_amount_'+i+'_'+indek)){
      isiEdit.amount=getEV(id_kolom);
      baru.push(isiEdit);

    }else{
      baru.push(isi[i]);
    }
  }
}

EmployeeDefaults.payroll.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].payroll_detail;
  var newBasket=[];
  
  EmployeeDefaults.payroll.setRows(indek,oldBasket);
  for(let i=0;i<oldBasket.length;i++){
    if (i!=(number)) newBasket.push(oldBasket[i]);
  }
  EmployeeDefaults.payroll.setRows(indek,newBasket);
}

EmployeeDefaults.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>EmployeeDefaults.formUpdate(indek));
  EmployeeDefaults.exportExecute(indek);
}

EmployeeDefaults.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'employee_defaults.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

EmployeeDefaults.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{EmployeeDefaults.formUpdate(indek);});
  iii.uploadJSON(indek);
}

EmployeeDefaults.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      'cash_account_id':d[i][1],
      'pay_frequency':d[i][2],
      'hourly_detail':d[i][3],
      'salary_detail':d[i][4],
      'employee_detail':d[i][5],
      'payroll_detail':d[i][6]
    }
    db3.query(indek,EmployeeDefaults.url+'/update',o,(paket)=>{  
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

EmployeeDefaults.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{});
}

// eof:
