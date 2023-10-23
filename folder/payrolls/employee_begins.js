/*
 * name: budiono
 * date: sep-30, 07:09, sat-2023; new;
*/

'use strict';

var EmployeeBegins={
  url:'employee_begins',
  title:'Employee Begins',
  gross:{},
  employee:{},
  payroll:{},
};

EmployeeBegins.show=(karcis)=>{
  karcis.modul=EmployeeBegins.url;
  karcis.menu.name=EmployeeBegins.title;
  karcis.child_free=false;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newEmp=new BingkaiUtama(karcis);
    const indek=newEmp.show();
    EmployeeDefaults.getDefault(indek,()=>{
      bingkai[indek].pay_frequency=bingkai[indek].data_default.pay_frequency;
      EmployeeBegins.formPaging(indek);
    });
  }else{
    show(baru);
  }
}

EmployeeBegins.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>{EmployeeBegins.formCreate(indek);});
  toolbar.search(indek,()=>{EmployeeBegins.formSearch(indek);});
  toolbar.refresh(indek,()=>{EmployeeBegins.formPaging(indek);});
  toolbar.download(indek,()=>EmployeeBegins.formExport(indek));
  toolbar.upload(indek,()=>EmployeeBegins.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));  
  db3.readPaging(indek,()=>{
    EmployeeBegins.readShow(indek);
  });
}

EmployeeBegins.readShow=(indek)=>{
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
        +' onclick="EmployeeBegins.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="EmployeeBegins.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled>'
          +paket.paging.pages[x].page 
          +'</button>'; 
        } else {
          html+= '<button type="button"'
          +' onclick="EmployeeBegins.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last"'
        +' onclick="EmployeeBegins.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border="1">'
    +'<tr>'
    +'<th colspan="2">Employee ID</th>'
    +'<th>Name</th>'
    +'<th>Amount</th>'
    +'<th>User</th>'
    +'<th>Modified</th>'
    +'<th colspan=2>Action</th>'
    +'</tr>';

  if (paket.err.id===0){
    for (var x in paket.data) {
      html+='<tr>'
      +'<td align="center">'+paket.data[x].row_id+'</td>'
      +'<td align="left">'+paket.data[x].employee_id+'</td>'
      +'<td align="left">'+xHTML(paket.data[x].employee_name)+'</td>'
      +'<td align="left">0</td>'
      +'<td align="center">'+paket.data[x].info.user_name+'</td>'
      +'<td align="center">'
        +tglInt(paket.data[x].info.date_modified)
        +'</td>'
      +'<td align="center">'

      +'<button type="button"'
        +' id="btn_change"'
        +' onclick="EmployeeBegins.formUpdate(\''+indek+'\''
        +',\''+paket.data[x].employee_id+'\');">'
        +'</button>'
        +'</td>'
        
      +'<td align="center">'
        +'<button type="button"'
        +' id="btn_delete"'
        +' onclick="EmployeeBegins.formDelete(\''+indek+'\''
        +',\''+paket.data[x].employee_id+'\');">'
        +'</button>'
        +'</td>'
      +'</tr>';
    }
  }
  html+='</table></div>';
  content.html(indek,html);
  if(paket.err.id!=0) content.infoPaket(indek,paket);
}

EmployeeBegins.formCreate=(indek)=>{
  EmployeeBegins.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>EmployeeBegins.formPaging(indek));
  toolbar.save(indek,()=>EmployeeBegins.createExecute(indek));  
  EmployeeBegins.setDefault(indek);
}

EmployeeBegins.createExecute=(indek)=>{
  db3.createOne(indek,{
    "employee_id":getEV("employee_id_"+indek),
    "cash_account_id":getEV("cash_account_id_"+indek),

    "gross_detail":bingkai[indek].gross_detail,
    "employee_detail":bingkai[indek].employee_detail,
    "payroll_detail":bingkai[indek].payroll_detail,

    "vacation":getEV('vacation_'+indek),
    "sick":getEV('sick_'+indek)
  });
}

EmployeeBegins.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'"'
      +' style="margin-bottom:1rem;line-height:1.5rem;"></div>'
    +'<form autocomplete="off">'
    +'<div style="display:grid'
      +';grid-template-columns:repeat(2,1fr)'
      +';padding-bottom:20px;">'
      
    +'<div>'
      +'<ul>'    
      +'<li><label>Employee ID'
        +'<i style="color:red">&nbsp;*</i>:'
        +'</label>'
        +'<input type="text"'
        +' id="employee_id_'+indek+'"'
        +' onchange="EmployeeBegins.getEmployee(\''+indek+'\')"'
        +' size="12">'
        
        +'<button type="button"'
        +' id="btn_find" '
        +' onclick="Employees.lookUp(\''+indek+'\''
        +',\'employee_id_'+indek+'\')">'
        +'</button>'
        +'</li>'
        
      +'<li><label>&nbsp;</label>'
        +'<input type="text"'
        +' id="employee_name_'+indek+'" disabled>'
        +'</li>'

      +'<li><label>Amount:</label>'
        +'<input type="text"'
        +' id="payroll_amount_'+indek+'"'
        +' style="text-align:center;"'
        +' size="9" disabled>'
        +'</li>'
        
      +'</ul>'
    +'</div>'

      +'<div style="padding-left:1rem;">'
        +'<div><label style="display:block;">Cash Account'
          +'<i style="color:red">&nbsp;*</i>:</label>'
          +'<input type="text"'
          +' id="cash_account_id_'+indek+'"'
          +' size="9">'
        +'<button type="button"'
          +' id="btn_find" '
          +' onclick="Accounts.lookUp(\''+indek+'\''
          +',\'cash_account_id_'+indek+'\',\'cash\')">'
          +'</button>'
        +'<br><input type="text"'
          +' id="cash_account_name_'+indek+'" disabled>'
          +'</div>'
          
        +'<div><label style="display:block;">Frequency:</label>'
            +'<select id="pay_frequency_'+indek+'" disabled>'
            +getDataPayFrequency(indek)
            +'</select>'
          +'</div>'



      +'</div>'
    +'</div>'
    
    +'<details open>'
    +'<summary>Gross Fields</Summary>'
      +'<div id="gross_detail_'+indek+'"></div>'
    +'</details>'
    
    +'<details open>'
    +'<summary>Deduction and Addition Fields</Summary>'
      +'<div id="employee_detail_'+indek+'"></div>'
    +'</details>'
    
    +'<details open>'
    +'<summary>Payroll Taxes Fields</Summary>'
      +'<div id="payroll_detail_'+indek+'"></div>'
    +'</details>'
    
    +'<details open>'
    +'<summary>Vacation and Sick Time</Summary>'
      +'<ul>'
      +'<li><label>Vacation:</label>'
        +'<input type="text"'
        +' id="vacation_'+indek+'"'
        +' style="text-align:center;"'
        +' size="3">'
        +'</li>'
        
      +'<li><label>Sick:</label>'
        +'<input type="text"'
        +' id="sick_'+indek+'"'
        +' style="text-align:center;"'
        +' size="3">'
        +'</li>'
      
      +'</ul>'
    +'</details>'
    

    +'</form>'
    +'</div>';

  content.html(indek,html);
  statusbar.ready(indek);
  
  document.getElementById('employee_id_'+indek).focus();
}

EmployeeBegins.employee.setRows=(indek, isi)=>{
  if(isi===undefined)isi=[];    
  var panjang=isi.length;
  var html=EmployeeBegins.employee.tableHead(indek);
  var sum_amount=0;
  
  bingkai[indek].employee_detail=isi;
  
  for (var i=0;i<panjang;i++){
    sum_amount+=Number(isi[i].amount);

    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    
    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="employee_field_name_'+i+'_'+indek+'"'
      +' value="'+isi[i].field_name+'"'
      +' onchange="EmployeeBegins.employee.setCell(\''+indek+'\''
      +',\'employee_field_name_'+i+'_'+indek+'\')"'
      +' size="10"'
      +' style="text-align:left"'
      +' placeholder="Employee">'
      +'</td>'

    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="employee_gl_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].gl_account_id+'"'
      +' size="4"'
      +' style="text-align:center;"'
      +' onchange="EmployeeBegins.employee.setCell(\''+indek+'\''
      +',\'employee_gl_account_id_'+i+'_'+indek+'\''
      +',\'employee\')" '
      +' onfocus="this.select()" >'
      +'</td>'
      
    +'<td><button type="button"'
      +' id="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'employee_gl_account_id_'+i+'_'+indek+'\''
      +',\'employee\');">'
      +'</button>'
      +'</td>'
      
    +'<td  align="center" style="padding:0;margin:0;">'
      +'<select id="employee_formula_'+i+'_'+indek+'"'
      +' onchange="EmployeeBegins.employee.setCell(\''+indek+'\''
      +',\'employee_formula_'+i+'_'+indek+'\')">'
      +getFormula(indek,isi[i].formula, isi[i].formula)
      +'</select>'
    +'</td>'
      
    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="employee_amount_'+i+'_'+indek+'"'
      +' value="'+isi[i].amount+'"'
      +' size="3"'
      +' style="text-align:center;"'
      +' onchange="EmployeeBegins.employee.setCell(\''+indek+'\''
      +',\'employee_amount_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()" >'
      +'</td>'

    +'<td align="center">'
      +'<button type="button"'
      +' id="btn_add"'
      +' onclick="EmployeeBegins.employee.addRow(\''+indek+'\','+i+')" >'
      +'</button>'
      
      +'<button type="button"'
      +' id="btn_remove"'
      +' onclick="EmployeeBegins.employee.removeRow(\''+indek+'\','+i+')" >'
      +'</button>'
    +'</td>'
    +'</tr>';
  }
  
  html+=EmployeeBegins.employee.tableFoot(indek);
  bingkai[indek].sum_employee=sum_amount;
  document.getElementById('employee_detail_'+indek).innerHTML=html;
  if(panjang==0) EmployeeBegins.employee.addRow(indek,0);
  
  setEI("payroll_total_employee_"+indek,Number(bingkai[indek].sum_employee).toFixed(2));
}

EmployeeBegins.employee.tableHead=(indek)=>{
  return '<table style="display:block;">'
  +'<thead>'
    +'<tr>'
    +'<th colspan="2">Field Name</th>'
    +'<th colspan="2">G/L Account</th>'
    +'<th>Formula</th>'
    +'<th>Amount</th>'
    +'<th colspan"2">Add/Rem</th>'
    +'</tr>'
  +'</thead>';
}

EmployeeBegins.employee.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan=4 align="right">'
      +'<strong>Employee Field:</strong>'
      +'</td>'
    +'<td align="center">'
      +'<strong>'
      +'<label id="payroll_total_employee_'+indek+'"></label>'
      +'</strong>'
      +'</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

EmployeeBegins.employee.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].employee_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) newRow(newBasket);
  }
  if(oldBasket.length==0) newRow(newBasket);
  EmployeeBegins.employee.setRows(indek,newBasket);

  function newRow(newBas){
    var myItem={};
    myItem.row_id=newBas.length+1;
    myItem.field_name='';
    myItem.gl_account_id='';
    myItem.amount=0;
    myItem.formula=-1;
    newBas.push(myItem);
  }
}

EmployeeBegins.employee.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].employee_detail;
  var baru = [];
  var isiEdit = {};
  
  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];

    if(id_kolom==('employee_field_name_'+i+'_'+indek)){
      isiEdit.field_name=getEV(id_kolom);
      baru.push(isiEdit);
            
    }else if(id_kolom==('employee_gl_account_id_'+i+'_'+indek)){
      isiEdit.gl_account_id=getEV(id_kolom);
      baru.push(isiEdit);

    }else if(id_kolom==('employee_amount_'+i+'_'+indek)){
      isiEdit.amount=getEV(id_kolom);
      baru.push(isiEdit);
      
    }else if(id_kolom==('employee_formula_'+i+'_'+indek)){
      isiEdit.formula=getEI(id_kolom);
      baru.push(isiEdit);
      
    }else{
      baru.push(isi[i]);
    }
  }
}

EmployeeBegins.employee.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].employee_detail;
  var newBasket=[];
  
  EmployeeBegins.employee.setRows(indek,oldBasket);
  for(let i=0;i<oldBasket.length;i++){
    if (i!=(number)){
      newBasket.push(oldBasket[i]);
    }
  }
  EmployeeBegins.employee.setRows(indek,newBasket);
}

EmployeeBegins.setDefault=(indek)=>{
  bingkai[indek].sum_gross=0;
  bingkai[indek].sum_employee=0;
  bingkai[indek].sum_payroll=0;
  
  var d=bingkai[indek].data_default;
  bingkai[indek].pay_frequency=d.pay_frequency;
  
  setEV('cash_account_id_'+indek, d.cash_account_id);
  setEV('cash_account_name_'+indek, d.cash_account_name);
  setEI('pay_frequency_'+indek, d.pay_frequency);

  EmployeeBegins.gross.setRows(indek,[]);
  EmployeeBegins.employee.setRows(indek, d.employee_detail );
  EmployeeBegins.payroll.setRows(indek, d.payroll_detail);
}

EmployeeBegins.payroll.setRows=(indek,isi)=>{
  if(isi===undefined)isi=[];    
  var panjang=isi.length;
  var html=EmployeeBegins.payroll.tableHead(indek);
  bingkai[indek].payroll_detail=isi;
  
  for (var i=0;i<panjang;i++){
    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    
    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="payroll_field_name_'+i+'_'+indek+'"'
      +' value="'+isi[i].field_name+'"'
      +' onchange="EmployeeBegins.payroll.setCell(\''+indek+'\''
      +',\'payroll_field_name_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"'
      +' style="text-align:left"'
      +' size="10" placeholder="Payroll Tax">'
      +'</td>'

    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="payroll_liability_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].liability_account_id+'"'
      +' onchange="EmployeeBegins.payroll.setCell(\''+indek+'\''
      +',\'payroll_liability_account_id_'+i+'_'+indek+'\''
      +',\'liability\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center;"'
      +' size="4">'
      +'</td>'

    +'<td><button type="button"'
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
      +' onchange="EmployeeBegins.payroll.setCell(\''+indek+'\''
      +',\'payroll_expense_account_id_'+i+'_'+indek+'\''
      +',\'expense\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center;"'
      +' size="4">'
      +'</td>'
      
    +'<td><button type="button"'
      +' id="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'payroll_expense_account_id_'+i+'_'+indek+'\''
      +',\'expense\');">'
      +'</button>'
      +'</td>'
      
    +'<td  align="center" style="padding:0;margin:0;">'
      +'<select id="payroll_formula_'+i+'_'+indek+'"'
      +' onchange="EmployeeBegins.payroll.setCell(\''+indek+'\''
      +',\'payroll_formula_'+i+'_'+indek+'\')">'
      +getFormula(indek,isi[i].formula)
      +'</select>'
    +'</td>'

    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="payroll_amount_'+i+'_'+indek+'"'
      +' value="'+isi[i].amount+'"'
      +' onchange="EmployeeBegins.payroll.setCell(\''+indek+'\''
      +',\'payroll_amount_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center"'
      +' size="3">'
      +'</td>'

    +'<td align="center">'
      +'<button type="button"'
      +' id="btn_add"'
      +' onclick="EmployeeBegins.payroll.addRow(\''+indek+'\','+i+')" >'
      +'</button>'
      
      +'<button type="button"'
      +' id="btn_remove"'
      +' onclick="EmployeeBegins.payroll.removeRow(\''+indek+'\','+i+')" >'
      +'</button>'
    +'</td>'
    +'</tr>';
  }
  html+=EmployeeBegins.payroll.tableFoot(indek);
  document.getElementById('payroll_detail_'+indek).innerHTML=html;
  if(panjang==0)EmployeeBegins.payroll.addRow(indek,0);
}

EmployeeBegins.payroll.tableHead=(indek)=>{
  return '<table style="display:block;">'
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

EmployeeBegins.payroll.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan="7">&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

EmployeeBegins.payroll.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].payroll_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) newRow(newBasket);
  }
  if(oldBasket.length==0) newRow(newBasket);
  EmployeeBegins.payroll.setRows(indek,newBasket);

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

EmployeeBegins.payroll.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].payroll_detail;
  var baru = [];
  var isiEdit = {};

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

EmployeeBegins.payroll.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].payroll_detail;
  var newBasket=[];
  
  EmployeeBegins.payroll.setRows(indek,oldBasket);
  for(let i=0;i<oldBasket.length;i++){
    if (i!=(number)){
      newBasket.push(oldBasket[i]);
    }
  }
  EmployeeBegins.payroll.setRows(indek,newBasket);
}

EmployeeBegins.setEmployee=(indek,d)=>{
  const id_kolom=bingkai[indek].id_kolom;
  setEV(id_kolom, d.employee_id);
  EmployeeBegins.getEmployee(indek);
}

EmployeeBegins.getEmployee=(indek)=>{
  Employees.getOne(indek,getEV('employee_id_'+indek),(paket)=>{
    if(paket.count>0){
      var d=paket.data;
      setEV('employee_name_'+indek, d.employee_name);
      setEI('pay_frequency_'+indek, d.pay_frequency );
      
      EmployeeBegins.gross.setRows(indek,d.gross_detail );
      EmployeeBegins.employee.setRows(indek,d.employee_detail );
      EmployeeBegins.payroll.setRows(indek,d.payroll_detail );
      
    }else{
      setEV('employee_name_'+indek, '');
      setEI('pay_frequency_'+indek, 0);
      
      EmployeeBegins.gross.setRows(indek,[] );
      EmployeeBegins.employee.setRows(indek,[] );
      EmployeeBegins.payroll.setRows(indek,[] );
    }
  });
}

EmployeeBegins.gross.setRows=(indek, isi)=>{
  if(isi===undefined)isi=[];    
  var panjang=isi.length;
  var html=EmployeeBegins.gross.tableHead(indek);
  var sum_amount=0;
  bingkai[indek].gross_detail=isi;
  
  for (var i=0;i<panjang;i++){
    sum_amount+=Number(isi[i].amount);

    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    
    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' value="'+isi[i].field_name+'"'
      +' size="10"'
      +' style="text-align:left"'
      +' disabled>'
      +'</td>'
    
    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="gl_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].gl_account_id+'"'
      +' size="4"'
      +' style="text-align:center;"'
      +' onchange="EmployeeBegins.gross.setCell(\''+indek+'\''
      +',\'gl_account_id_'+i+'_'+indek+'\',\'gl\')" '
      +' onfocus="this.select()" >'
      +'</td>'
      
    +'<td><button type="button"'
      +' id="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'gl_account_id_'+i+'_'+indek+'\',\'gl\');">'
      +'</button>'
      +'</td>'
      
    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="rate_'+i+'_'+indek+'"'
      +' value="'+isi[i].rate+'"'
      +' size="3"'
      +' style="text-align:center;"'
      +' disabled>'
      +'</td>'
      
    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="amount_'+i+'_'+indek+'"'
      +' value="'+isi[i].amount+'"'
      +' size="3"'
      +' style="text-align:center;"'
      +' onchange="EmployeeBegins.gross.setCell(\''+indek+'\''
      +',\'amount_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()" >'
      +'</td>'
    +'</tr>';
  }
  
  html+=EmployeeBegins.gross.tableFoot(indek);
  bingkai[indek].sum_gross=sum_amount;
  document.getElementById('gross_detail_'+indek).innerHTML=html;
  if(panjang==0) EmployeeBegins.gross.addRow(indek,0);
  setEI("payroll_total_gross_"+indek, bingkai[indek].sum_gross);
}

EmployeeBegins.gross.tableHead=(indek)=>{
  return '<table style="display:block;">'
  +'<caption class="required" id="title_pay_info_'+indek+'">'
  +'</caption>'
  +'<thead>'
    +'<tr>'
    +'<th colspan="2">Field Name</th>'
    +'<th colspan="2">G/L Account</th>'
    +'<th>Rate</th>'
    +'<th>Amount</th>'
    +'</tr>'
  +'</thead>';
}

EmployeeBegins.gross.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan="5" align="right">'
      +'<strong>Gross Pay:</strong>'
      +'</td>'
    +'<td align="center">'
      +'<strong><label id="payroll_total_gross_'+indek+'"></strong>'
      +'</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

EmployeeBegins.gross.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].gross_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) newRow(newBasket);
  }
  if(oldBasket.length==0) newRow(newBasket);
  EmployeeBegins.gross.setRows(indek,newBasket);

  function newRow(newBas){
    var myItem={};
    myItem.row_id=newBas.length+1;
    myItem.field_name='';
    myItem.gl_account_id='';
    myItem.rate=0;
    myItem.amount=0;
    newBas.push(myItem);
  }
}

EmployeeBegins.gross.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].gross_detail;
  var baru = [];
  var isiEdit = {};
  
  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    //if(id_kolom==('field_name_'+i+'_'+indek)){
      //isiEdit.field_name=getEV(id_kolom);
      //baru.push(isiEdit);
    //}else 
    if(id_kolom==('gl_account_id_'+i+'_'+indek)){
      isiEdit.gl_account_id=getEV(id_kolom);
      baru.push(isiEdit);
      
    }else if(id_kolom==('rate_'+i+'_'+indek)){
      isiEdit.rate=getEV(id_kolom);
      baru.push(isiEdit);
      
    }else if(id_kolom==('amount_'+i+'_'+indek)){
      isiEdit.amount=getEV(id_kolom);
      baru.push(isiEdit);
      
    }else{
      baru.push(isi[i]);
    }
  }
}

EmployeeBegins.readOne=(indek,callback)=>{
  db3.readOne(indek,{
    "employee_id":bingkai[indek].employee_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0) {
      const d=paket.data;
      setEV('employee_id_'+indek,d.employee_id);
      setEV('employee_name_'+indek,d.employee_name);
      setEV('cash_account_id_'+indek,d.cash_account_id);
      setEV('cash_account_name_'+indek,d.cash_account_name);
      
      setEI('pay_frequency_'+indek,d.pay_frequency);
      setEV('sick_'+indek,d.sick);
      setEV('vacation_'+indek,d.vacation);
      
      EmployeeBegins.gross.setRows(indek,d.gross_detail);
      EmployeeBegins.employee.setRows(indek,d.employee_detail);
      EmployeeBegins.payroll.setRows(indek,d.payroll_detail);
    }
    message.none(indek);
    return callback();
  })
}

EmployeeBegins.formDelete=(indek,employee_id)=>{
  bingkai[indek].employee_id=employee_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  EmployeeBegins.formEntry(indek,MODE_DELETE);
  EmployeeBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>{EmployeeBegins.formLast(indek);});
    toolbar.delet(indek,()=>{EmployeeBegins.deleteExecute(indek);});
  });
}

EmployeeBegins.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "employee_id":bingkai[indek].employee_id
  });
}

EmployeeBegins.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  EmployeeBegins.formPaging(indek):
  EmployeeBegins.formResult(indek);
}

EmployeeBegins.formUpdate=(indek,employee_id)=>{
  bingkai[indek].employee_id=employee_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  EmployeeBegins.formEntry(indek,MODE_UPDATE);
  EmployeeBegins.readOne(indek,()=>{
    toolbar.back(indek,()=>{EmployeeBegins.formLast(indek);});
    toolbar.save(indek,()=>{EmployeeBegins.updateExecute(indek);});
  });
}

EmployeeBegins.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "employee_id":getEV("employee_id_"+indek),
    "cash_account_id":getEV("cash_account_id_"+indek),

    "gross_detail":bingkai[indek].gross_detail,
    "employee_detail":bingkai[indek].employee_detail,
    "payroll_detail":bingkai[indek].payroll_detail,

    "vacation":getEV('vacation_'+indek),
    "sick":getEV('sick_'+indek)
  });
}

EmployeeBegins.setAccount=(indek,data)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  setEV(id_kolom, data.account_id);
 
  switch(nama_kolom){
    case "cash":
      break;
    case "gl":
      EmployeeBegins.gross.setCell(indek,id_kolom);
      break;
    case "employee":
      EmployeeBegins.employee.setCell(indek,id_kolom);
      break;
    case "liability":
      EmployeeBegins.payroll.setCell(indek,id_kolom);
      break;
    case "expense":
      EmployeeBegins.payroll.setCell(indek,id_kolom);
      break;
  }
}

EmployeeBegins.formSearch=(indek,txt)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>EmployeeBegins.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>EmployeeBegins.formPaging(indek));
}

EmployeeBegins.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  EmployeeBegins.formResult(indek);
}

EmployeeBegins.formResult=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>EmployeeBegins.formSearch(indek));
  db3.search(indek,()=>{
    EmployeeBegins.readShow(indek);
  });
}

EmployeeBegins.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>EmployeeBegins.formPaging(indek));
  EmployeeBegins.exportExecute(indek);
}

EmployeeBegins.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'employee_begins.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

EmployeeBegins.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{EmployeeBegins.formPaging(indek);});
  iii.uploadJSON(indek);
}

EmployeeBegins.importExecute=(indek)=>{
  var oNomer=0;
  var oMsg='';
  var obj;
  var html='';
  var dataImport=bingkai[indek].dataImport.data;
  var jumlahData=dataImport.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<dataImport.length;i++){
    obj = {            
      "employee_id":dataImport[i][1],
      "cash_account_id":dataImport[i][2],
      "gross_detail":dataImport[i][3],
      "employee_detail":dataImport[i][4],
      "payroll_detail":dataImport[i][5],
      "vacation":dataImport[i][6],
      "sick":dataImport[i][7]
    }
    db3.query(indek,EmployeeBegins.url+'/create',obj,(paket)=>{  
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

/*EOF*/
