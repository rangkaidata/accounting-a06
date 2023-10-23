/*
 * name: budiono
 * date: sep-12, 22:11, tue-2023; new;
 * edit: sep-19, 20:39, tue-2023; 
 */ 

'use strict';

var Employees={
  url:'employees',
  title:'Employees',
  employee:{},
  payroll:{}
};

Employees.show=(karcis)=>{
  karcis.modul=Employees.url;
  karcis.menu.name=Employees.title;
  karcis.child_free=false;
  
  const baru=exist(karcis);
  if(baru==-1){
    const newEmp=new BingkaiUtama(karcis);
    const indek=newEmp.show();
    
    EmployeeDefaults.getDefault(indek,()=>{
      Employees.formPaging(indek);
    });
  }else{
    show(baru);
  }
}

Employees.formPaging=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.neuu(indek,()=>{Employees.formCreate(indek);});
  toolbar.search(indek,()=>{Employees.formSearch(indek);});
  toolbar.refresh(indek,()=>{Employees.formPaging(indek);});
  toolbar.download(indek,()=>Employees.formExport(indek));
  toolbar.upload(indek,()=>Employees.formImport(indek));
  toolbar.more(indek,()=>Menu.more(indek));  
  db3.readPaging(indek,()=>{
    Employees.readShow(indek);
  });
}

Employees.getDefault=(indek)=>{
  EmployeeDefaults.getDefault(indek);
}

Employees.readShow=(indek)=>{
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
        +' onclick="Employees.gotoPage(\''+indek+'\''
        +',\''+paket.paging.first+'\')">'
        +'</button>';
      }
      for (x in paket.paging.pages){
        if (paket.paging.pages[x].current_page=="yes"){
          html+= '<button type="button"'
          +' onclick="Employees.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')" disabled>'
          +paket.paging.pages[x].page 
          +'</button>'; 
        } else {
          html+= '<button type="button"'
          +' onclick="Employees.gotoPage(\''+indek+'\''
          +',\''+paket.paging.pages[x].page+'\')">'
          +paket.paging.pages[x].page+'</button>';  
        }
      }
      if (paket.paging.last!=""){
        html+='<button type="button"'
        +' id="btn_last"'
        +' onclick="Employees.gotoPage(\''+indek+'\''
        +',\''+paket.paging.last+'\')">'
        +'</button>';
      }
    }
  }
  
  html+='<table border=1>'
    +'<tr>'
    +'<th colspan="2">Employee ID</th>'
    +'<th>Name</th>'
    +'<th>Address</th>'
    +'<th>Frequency</th>'
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
      +'<td align="left">'
        +xHTML(paket.data[x].employee_address.street_1)+'</td>'
      +'<td align="center">'
        +array_pay_frequency[paket.data[x].pay_frequency]+'</td>'
      +'<td align="center">'+paket.data[x].info.user_name+'</td>'
      +'<td align="center">'
        +tglInt(paket.data[x].info.date_modified)
        +'</td>'
      +'<td align="center">'

      +'<button type="button"'
        +' id="btn_change"'
        +' onclick="Employees.formUpdate(\''+indek+'\''
        +',\''+paket.data[x].employee_id+'\');">'
        +'</button>'
        +'</td>'
        
      +'<td align="center">'
        +'<button type="button"'
        +' id="btn_delete"'
        +' onclick="Employees.formDelete(\''+indek+'\''
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

Employees.gotoPage=(indek,page)=>{
  bingkai[indek].page=page;
  Employees.formPaging(indek);
}

Employees.formEntry=(indek,metode)=>{
  bingkai[indek].metode=metode;
  var html=''
    +'<div style="padding:0.5rem">'
    +content.title(indek)
    +'<div id="msg_'+indek+'" style="margin-bottom:1rem;"></div>'
    +'<form autocomplete="off" style="padding-bottom:10rem;">'
    +'<ul>'
      +'<li><label>Employee ID:<i class="required"> *</i></label>'
        +'<input type="text"'
        +' id="employee_id_'+indek+'">'
        +'</li>'
      
      +'<li><label>Name</label>'
        +'<input type="text"'
        +' id="employee_name_'+indek+'">'
        +'</li>'
      
      +'<li><label>Class</label>'
        +'<select id="employee_class_'+indek+'">'
        +getEmployeeClass(indek)
        +'</select>'
        +'</i>'
      
      +'<li><label>&nbsp;</label>'
      +'<label>'
      +'<input type="checkbox"'
      +' id="employee_inactive_'+indek+'">'
      +'Inactive'
      +'</label>'
      +'</li>'
    +'</ul>'  
      
    +'<details open>'
    +'<summary>General</summary>'
    +'<div style="display:grid;'
      +'grid-template-columns:repeat(3,1fr);">'
      
      +'<div style="padding-right:10px;">'
        +'<ul>'
        +'<li><label>Address</label>&nbsp;'
          +'<input type="text"'
          +' id="employee_address_1_'+indek+'">'
          +'</li>'

        +'<li><label>&nbsp;</label>&nbsp;'
          +'<input type="text" '
          +' id="employee_address_2_'+indek+'">'
          +'</li>'
          
          +'<li><label>City</label>&nbsp;'
          +'<input type="text"'
          +' id="employee_city_'+indek+'">'
          +'</li>'
          
          +'<li><label>State</label>&nbsp;'
          +'<input type="text"'
          +' id="employee_state_'+indek+'">'
          +'</li>'
      
        +'<li><label>Zip</label>&nbsp;'
          +'<input type="text"'
          +' id="employee_zip_'+indek+'">'
          +'</li>'
        
        +'<li><label>Country</label>&nbsp;'
          +'<input type="text"'
          +' id="employee_country_'+indek+'">'
          +'</li>'

        +'</ul>'
      +'</div>'
      
      +'<div style="padding-right:10px;">'
        +'<ul>'

        +'<li><label>Social Security#</label>&nbsp;'
          +'<input type="text" '
          +' id="employee_social_security_'+indek+'"'
          +' size="9">'
          +'</li>'
    
        +'<li><label>Type</label>&nbsp;'
          +'<input type="text"'
          +' id="employee_type_'+indek+'"'
          +' size="9">'
          +'</li>'
        +'</ul>'
        
        +'<br>'
        +'<ul>'
        +'<li><label>Phone</label>&nbsp;'
          +'<input type="text"'
          +' id="employee_telephone_'+indek+'"'
          +' size="12">'
          +'</li>'
          
        +'<li><label>Mobile</label>&nbsp;'
          +'<input type="text"'
          +' id="mobile_'+indek+'"'
          +' size="12">'
          +'</li>'
          
        +'<li><label>Email</label>&nbsp;'
          +'<input type="text"'
          +' id="employee_email_'+indek+'"'
          +' size="20">'
          +'</li>'
        +'</ul>'
      +'</div>'
   
      +'<div>'
        +'<ul>'
        +'<li>'
          +'<label><input type="checkbox"'
          +' id="employee_pensiun_'+indek+'">Pension</label>'
          +'</li>'

        +'<li>'
          +'<label><input type="checkbox"'
          +' id="employee_deffered_'+indek+'">Deffered</label>'
          +'</li>'

        +'</ul>'
        +'<br>'
        
        +'<label style="display:block;">Date Hired:</label>'
          +'<input type="date"'
          +' id="employee_date_hired_'+indek+'">'

        +'<label style="display:block;">Date Raise:</label>'
          +'<input type="date"'
          +' id="employee_date_last_raise_'+indek+'">'

        +'<label style="display:block;">Date Terminated:</label>'
          +'<input type="date"'
          +' id="employee_date_terminated_'+indek+'">'
        
      +'</div>'
    +'</div>'
    +'</details>'    
    
    +'<details open>'
      +'<summary>Withholding Information</summary>'
      +'<div style="width:0;">'
        +'<table>'
          +'<th>Field<br>Names</th>'
          +'<th>Filling<br>Status</th>'
          +'<th>Allowances</th>'
          +'<th>Additional<br>withholding</th>'
          +'<th>State/<br>Locally</th>'
          
          +'<tr>'
            +'<td align="left">Federal</td>'
            +'<td align="center">'
              +'<select id="federal_status_'+indek+'">'
              +getEmployeeFillingStatus(indek)
              +'</select>'
              +'</td>'
              
            +'<td align="center"><input type="text"'
              +' id="federal_allowances_'+indek+'"'
              +' style="text-align:center;"'
              +' size="3">'
              +'</td>'
              
            +'<td align="center"><input type="text" '
              +' id="federal_additional_'+indek+'"'
              +' style="text-align:center;"'
              +' size="3"></td>'
              
            +'<td>&nbsp;</td>'
          +'</tr>'
          
          +'<tr>'
            +'<td align="left">State</td>'
            +'<td align="center">'
              +'<select id="state_status_'+indek+'">'
              +getEmployeeFillingStatus(indek)
              +'</select>'
              +'</td>'
              
            +'<td align="center"><input type="text" '
              +' id="state_allowances_'+indek+'"'
              +' style="text-align:center;"'
              +' size="3">'
              +'</td>'
              
            +'<td align="center"><input type="text" '
              +' id="state_additional_'+indek+'"'
              +' style="text-align:center;"'
              +' size="3"></td>'
              
            +'<td align="center"><input type="text" '
              +' id="state_id_'+indek+'"'
              +' style="text-align:center;"'
              +' size="3"></td>'
          +'</tr>'
          
          +'<tr>'
            +'<td align="left">Local</td>'
            +'<td align="center">'
              +'<select id="local_status_'+indek+'">'
              +getEmployeeFillingStatus(indek)
              +'</select>'
              +'</td>'
              
            +'<td align="center"><input type="text"'
              +' id="local_allowances_'+indek+'"'
              +' style="text-align:center;"'
              +' size="3">'
              +'</td>'
              
            +'<td align="center"><input type="text"'
              +' id="local_additional_'+indek+'"' 
              +' style="text-align:center;"'
              +' size="3"></td>'
              
            +'<td align="center"><input type="text"'
              +' id="local_id_'+indek+'"' 
              +' style="text-align:center;"'
              +' size="3">'
              +' </td>'
          +'</tr>'

          +'<tr>'
            +'<td align="left">401k %</td>'
            +'<td>&nbsp;</td>'
            +'<td>&nbsp;</td>'
            +'<td align="center"><input type="text"'
              +' id="field_401k_additional_'+indek+'"'
              +' style="text-align:center;"'
              +' size="3"></td>'
              
            +'<td>&nbsp;</td>'
          +'</tr>'
          
          +'<tr>'
            +'<td align="left">Special 1</td>'
            +'<td>&nbsp;</td>'
            
            +'<td align="center"><input type="text"'
              +' id="special_1_allowances_'+indek+'"' 
              +' style="text-align:center;"'
              +'size="3"></td>'
              
            +'<td align="center"><input type="text"'
              +' id="special_1_additional_'+indek+'"'
              +' style="text-align:center;"'
              +' size="3"></td>'
            
            +'<td>&nbsp;</td>'
          +'</tr>'
          
          +'<tr>'
            +'<td align="left">Special 2</td>'
            +'<td>&nbsp;</td>'
            +'<td align="center"><input type="text"' 
              +' id="special_2_allowances_'+indek+'"' 
              +' style="text-align:center;"'
              +' size="3"></td>'
              
            +'<td align="center"><input type="text"'
              +' id="special_2_additional_'+indek+'"' 
              +' style="text-align:center;"'
              +' size="3"></td>'
            +'<td>&nbsp;</td>'
          +'</tr>'

        +'</table>'
        +'</div>'
    +'</details>'
    
    +'<details open>'
    +'<summary>Gross Field</summary>'
    +'<div style="display:grid;'
      +'grid-template-columns:repeat(2,1fr);">'
      
      +'<div>'
        +'<ul>'
        +'<li><label>Pay Method</label>'
          +'<select id="employee_pay_method_'+indek+'"'
          +' onChange="Employees.getPayInfo(\''+indek+'\')">'
          +getEmployeePayMethod(indek)
          +'</select>'
          +'</li>'

        +'<li><label>Hourly Billing</label>'
          +'<input type="text"'
          +' id="employee_hourly_billing_rate_'+indek+'"'
          +' style="text-align:center;"'
          +' size="5">'
          +'</li>'
        
        +'</ul>'        
        
      +'</div>'
      
      +'<div>'
        +'<ul>'
        +'<li><label>Frequency</label>'
          +'<select id="employee_pay_frequency_'+indek+'">'
          +'<option>0-Weekly</option>'
          +'<option>1-Bi-weekly</option>'
          +'<option>2-Semi-monthly</option>'
          +'<option>3-Monthly</option>'
          +'<option>4-Annualy</option>'
          +'</select>'
          +'</li>'
        
        +'<li><label>Hours Pay Periode:</label>'
          +'<input type="text"'
          +' id="employee_hour_pay_period_'+indek+'"'
          +' style="text-align:center;"'
          +' size="5">'
          +'</li>'
        
        +'</ul>'
      +'</div>'
    +'</div>'
    
    +'<div>'
        +'<div id="gross_detail_'+indek+'"'
        +' style="padding-top:1rem;width:0;"></div>'
    +'</div>'
    +'</details>'
    
    +'<details open>'
    +'<summary>Deduction and Addition Field</summary>'
      +'<div id="employee_detail_'+indek+'"'
      +' style="width:0;"></div>'
    +'</details>'

    +'<details open>'
    +'<summary>Payroll Tax Field</summary>'
    +'<div id="payroll_detail_'+indek+'"'
    +' style="width:0;"></div>'
    +'</details>'

    +'<details>'
    +'<summary>Vacation and Sick Time</summary>'
    +'</details>'    
    
    +'</form>'
    +'</div>';
    content.html(indek,html);
    statusbar.ready(indek);
    if(metode==MODE_CREATE){
      document.getElementById("employee_id_"+indek).focus();  
    }else{
      document.getElementById("employee_id_"+indek).disabled=true;
    }
}

Employees.setDefault=(indek)=>{
  bingkai[indek].gross_detail=[];
  const a=bingkai[indek].data_default;
  
  Employees.setRows(indek,a.salary_detail);
  Employees.employee.setRows(indek,a.employee_detail);
  Employees.payroll.setRows(indek,a.payroll_detail);
  
  setEI('title_pay_info_'+indek,"Salary");  
}

Employees.formCreate=(indek)=>{
  Employees.formEntry(indek,MODE_CREATE);
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Employees.formPaging(indek);});
  toolbar.save(indek,()=>{Employees.createExecute(indek);});
  Employees.setDefault(indek);
}

Employees.createExecute=(indek)=>{
  db3.createOne(indek,{
    "employee_id":getEV("employee_id_"+indek),
    "employee_name":getEV("employee_name_"+indek),
    "employee_inactive":getEC("employee_inactive_"+indek),
    "employee_class":getEI("employee_class_"+indek),
    "employee_address":{
      "street_1":getEV('employee_address_1_'+indek),
      "street_2":getEV('employee_address_2_'+indek),
      "city":getEV('employee_city_'+indek),
      "state":getEV('employee_state_'+indek),
      "zip":getEV('employee_zip_'+indek),
      "country":getEV('employee_country_'+indek)
    },
    "social_security":getEV('employee_social_security_'+indek),
    "employee_type":getEV('employee_type_'+indek),
    "employee_phone":getEV('employee_telephone_'+indek),
    "employee_mobile":getEV('mobile_'+indek),
    "employee_email":getEV('employee_email_'+indek),
    "date_hired":getEV('employee_date_hired_'+indek),
    "date_last_raise":getEV('employee_date_last_raise_'+indek),
    "date_terminated":getEV('employee_date_terminated_'+indek),
    "field_federal":{
      "status":getEI('federal_status_'+indek)
      ,"allowances":getEV('federal_allowances_'+indek)
      ,"additional":getEV('federal_additional_'+indek)},
    "field_state":{
      "status":getEI('state_status_'+indek)
      ,"allowances":getEV('state_allowances_'+indek)
      ,"additional":getEV('state_additional_'+indek)
      ,"state_id":getEV('state_id_'+indek)},
    "field_local":{
      "status":getEI('local_status_'+indek)
      ,"allowances":getEV('local_allowances_'+indek)
      ,"additional":getEV('local_additional_'+indek)
      ,"local_id":getEV('local_id_'+indek)},
    "field_401k":{
      "additional":getEV('field_401k_additional_'+indek)},
    "field_special_1":{
      "allowances":getEV('special_1_allowances_'+indek)
      ,"additional":getEV('special_1_additional_'+indek)},
    "field_special_2":{
      "allowances":getEV('special_2_allowances_'+indek)
      ,"additional":getEV('special_2_additional_'+indek)},
    "pension":getEC('employee_pensiun_'+indek),
    "deffered":getEC('employee_deffered_'+indek),
    
    "pay_method":getEI('employee_pay_method_'+indek),
    "pay_frequency":getEI('employee_pay_frequency_'+indek),
    
    "hour_pay_period":getEV('employee_hour_pay_period_'+indek),
    "hourly_billing_rate":getEV('employee_hourly_billing_rate_'+indek),
    
    "gross_detail":bingkai[indek].gross_detail,
    "employee_detail":bingkai[indek].employee_detail,
    "payroll_detail":bingkai[indek].payroll_detail,

    "custom_field":{
      "a":""
    }
  });
}

Employees.readOne=(indek,eop)=>{
  db3.readOne(indek,{
    "employee_id":bingkai[indek].employee_id
  },(paket)=>{
    if (paket.err.id==0 && paket.count>0) {
      const emp=paket.data;
      
      setEV('employee_id_'+indek, emp.employee_id);
      setEV('employee_name_'+indek, emp.employee_name);
      setEI('employee_class_'+indek, emp.employee_class);
      setEC('employee_inactive_'+indek, emp.employee_inactive);
      
      setEV('employee_address_1_'+indek, emp.employee_address.street_1);
      setEV('employee_address_2_'+indek, emp.employee_address.street_2);
      setEV('employee_city_'+indek, emp.employee_address.city);
      setEV('employee_state_'+indek, emp.employee_address.state);
      setEV('employee_zip_'+indek, emp.employee_address.zip);
      setEV('employee_country_'+indek, emp.employee_address.country);
      
      setEV('employee_social_security_'+indek, emp.social_security);
      setEV('employee_type_'+indek, emp.employee_type);
      setEV('employee_telephone_'+indek, emp.employee_phone);
      setEV('mobile_'+indek, emp.employee_mobile);
      setEV('employee_email_'+indek, emp.employee_email);

      setEC('employee_pensiun_'+indek, emp.pension);
      setEC('employee_deffered_'+indek, emp.deffered);
      
      setEV('employee_date_hired_'+indek, emp.date_hired);
      setEV('employee_date_last_raise_'+indek, emp.date_last_raise);
      setEV('employee_date_terminated_'+indek, emp.date_terminated);
      
      setEV('federal_status_'+indek, emp.field_federal.status);
      setEV('federal_allowances_'+indek, emp.field_federal.allowances);
      setEV('federal_additional_'+indek, emp.field_federal.additional);
      
      setEV('state_status_'+indek, emp.field_state.status);
      setEV('state_allowances_'+indek, emp.field_state.allowances);
      setEV('state_additional_'+indek, emp.field_state.additional);
      setEV('state_id_'+indek, emp.field_state.state_id);
      
      setEV('local_status_'+indek, emp.field_local.status);
      setEV('local_allowances_'+indek, emp.field_local.allowances);
      setEV('local_additional_'+indek, emp.field_local.additional);
      setEV('local_id_'+indek, emp.field_local.local_id);
      
      setEV('field_401k_additional_'+indek, emp.field_401k.additional);
      
      setEV('special_1_allowances_'+indek, emp.field_special_1.allowances);
      setEV('special_1_additional_'+indek, emp.field_special_1.additional);
      
      setEV('special_2_allowances_'+indek, emp.field_special_2.allowances);
      setEV('special_2_additional_'+indek, emp.field_special_2.additional);

      setEI('employee_pay_method_'+indek, emp.pay_method);
      setEI('employee_pay_frequency_'+indek, emp.pay_frequency);

      setEV('employee_hour_pay_period_'+indek, emp.hour_pay_periode);
      setEV('employee_hourly_billing_rate_'+indek, emp.hourly_billing_rate);

      Employees.setRows(indek, emp.gross_detail);
      Employees.employee.setRows(indek, emp.employee_detail);
      Employees.payroll.setRows(indek, emp.payroll_detail);
    }
    message.none(indek);
    return eop();
  });
}

Employees.formUpdate=(indek,employee_id)=>{
  bingkai[indek].employee_id=employee_id;
  
  Employees.formEntry(indek,MODE_UPDATE);

  toolbar.none(indek);
  toolbar.hide(indek);
  Employees.readOne(indek,()=>{
    toolbar.back(indek,()=>{Employees.formLast(indek);});
    toolbar.save(indek,()=>{Employees.updateExecute(indek);})
  });
}

Employees.updateExecute=(indek)=>{
  db3.updateOne(indek,{
    "employee_id":bingkai[indek].employee_id,
    "employee_name":getEV("employee_name_"+indek),
    "employee_inactive":getEC("employee_inactive_"+indek),
    "employee_class":getEI("employee_class_"+indek),
    "employee_address":{
      "street_1":getEV('employee_address_1_'+indek),
      "street_2":getEV('employee_address_2_'+indek),
      "city":getEV('employee_city_'+indek),
      "state":getEV('employee_state_'+indek),
      "zip":getEV('employee_zip_'+indek),
      "country":getEV('employee_country_'+indek)
    },
    "social_security":getEV('employee_social_security_'+indek),
    "employee_type":getEV('employee_type_'+indek),
    "employee_phone":getEV('employee_telephone_'+indek),
    "employee_mobile":getEV('mobile_'+indek),
    "employee_email":getEV('employee_email_'+indek),
    "date_hired":getEV('employee_date_hired_'+indek),
    "date_last_raise":getEV('employee_date_last_raise_'+indek),
    "date_terminated":getEV('employee_date_terminated_'+indek),
    "pension":getEC('employee_pensiun_'+indek),
    "deffered":getEC('employee_deffered_'+indek),
    "pay_method":getEI('employee_pay_method_'+indek),
    "pay_frequency":getEI('employee_pay_frequency_'+indek),
    "field_federal":{
      "status":getEI('federal_status_'+indek)
      ,"allowances":getEV('federal_allowances_'+indek)
      ,"additional":getEV('federal_additional_'+indek)
    },
    "field_state":{
      "status":getEI('state_status_'+indek)
      ,"allowances":getEV('state_allowances_'+indek)
      ,"additional":getEV('state_additional_'+indek)
      ,"state_id":getEV('state_id_'+indek)
    },
    "field_local":{
      "status":getEI('local_status_'+indek)
      ,"allowances":getEV('local_allowances_'+indek)
      ,"additional":getEV('local_additional_'+indek)
      ,"local_id":getEV('local_id_'+indek)
    },
    "field_401k":{
      "additional":getEV('field_401k_additional_'+indek)
    },
    "field_special_1":{
      "allowances":getEV('special_1_allowances_'+indek)
      ,"additional":getEV('special_1_additional_'+indek)
    },
    "field_special_2":{
      "allowances":getEV('special_2_allowances_'+indek)
      ,"additional":getEV('special_2_additional_'+indek)
    },
    "hour_pay_period":getEV('employee_hour_pay_period_'+indek),
    "hourly_billing_rate":getEV('employee_hourly_billing_rate_'+indek),
    
    "gross_detail":bingkai[indek].gross_detail,
    "employee_detail":bingkai[indek].employee_detail,
    "payroll_detail":bingkai[indek].payroll_detail,
    
    "custom_field":{}
  });
}

Employees.formDelete=(indek,employee_id)=>{
  bingkai[indek].employee_id=employee_id;
  toolbar.none(indek);
  toolbar.hide(indek);
  Employees.formEntry(indek,MODE_DELETE);
  Employees.readOne(indek,()=>{
    toolbar.back(indek,()=>{Employees.formLast(indek);});
    toolbar.delet(indek,()=>{Employees.deleteExecute(indek);});
  });
}

Employees.deleteExecute=(indek)=>{
  db3.deleteOne(indek,{
    "employee_id":bingkai[indek].employee_id
  });
}

Employees.formSearch=(indek,txt)=>{
  bingkai[indek].metode=MODE_SEARCH;
  content.search(indek,()=>Employees.searchExecute(indek));
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Employees.formPaging(indek);});
}

Employees.searchExecute=(indek)=>{
  bingkai[indek].text_search=getEV('text_search_'+indek);
  Employees.formResult(indek);
}

Employees.formResult=function(indek){
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>{Employees.formSearch(indek);});
  db3.search(indek,(paket)=>{
    Employees.readShow(indek);
  });
}

Employees.formLast=(indek)=>{
  bingkai[indek].text_search==''?
  Employees.formPaging(indek):
  Employees.formResult(indek);
}

Employees.formExport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,()=>Employees.formPaging(indek));
  Employees.exportExecute(indek);
}

Employees.exportExecute=(indek)=>{
  db3.readExport(indek,{},(paket)=>{
    if (paket.err.id===0){
      downloadJSON(indek,JSON.stringify(paket),'employees.json');
    }else{
      content.infoPaket(indek,paket);
    }
  });
}

Employees.formImport=(indek)=>{
  toolbar.none(indek);
  toolbar.hide(indek);
  toolbar.back(indek,function(){Employees.formPaging(indek);});
  iii.uploadJSON(indek);
}

Employees.importExecute=(indek)=>{
  var n=0;
  var m="<h4>Message Proccess:</h4>";
  var o={};
  var d=bingkai[indek].dataImport.data;
  var j=d.length;

  document.getElementById('btn_import_all_'+indek).disabled=true;
  
  for (var i=0;i<j;i++){
    o={
      "employee_id":d[i][1],
      "employee_name":d[i][2],
      "employee_class":d[i][3],
      "employee_inactive":d[i][4],
      "employee_address":d[i][5],
      "social_security":d[i][6],
      "employee_type":d[i][7],
      "employee_phone":d[i][8],
      "employee_mobile":d[i][9],
      "employee_email":d[i][10],
      "date_hired":d[i][11],
      "date_last_raise":d[i][12],
      "date_terminated":d[i][13],
      "pension":d[i][14],
      "deffered":d[i][15],
      "field_federal":d[i][16],
      "field_state":d[i][17],
      "field_local":d[i][18],
      "field_401k":d[i][19],
      "field_special_1":d[i][20],
      "field_special_2":d[i][21],
      "pay_method":d[i][22],
      "pay_frequency":d[i][23],
      "hour_pay_period":d[i][24],
      "hourly_billing_rate":d[i][25],
      "gross_detail":d[i][26],
      "employee_detail":d[i][27],
      "payroll_detail":d[i][28],
      "custom_field":d[i][29],
    }
    db3.query(indek,Employees.url+'/create',o,(paket)=>{
      n++;
      m+='['+n+'] '+db.error(paket)+'<br>';
      progressBar(indek,n,j,m);
    });
  }
}

Employees.lookUp=(indek,id_kolom)=>{
  bingkai[indek].id_kolom=id_kolom;
  objPop=new EmployeeLook(indek);
  objPop.show();
}

Employees.setRows=(indek,isi)=>{
  if(isi===undefined)isi=[];      
  var panjang=isi.length;
  var html=Employees.tableHead(indek);
  
  bingkai[indek].gross_detail=isi;

  for (var i=0;i<panjang;i++){
    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    
    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="field_name_'+i+'_'+indek+'"'
      +' value="'+isi[i].field_name+'"'
      +' size="10" placeholder="Rate / Salary"'
      +' style="text-align:left"'
      +' onchange="Employees.setCell(\''+indek+'\''
      +',\'field_name_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()">'
      +'</td>'
    
    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="gl_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].gl_account_id+'"'
      +' onchange="Employees.setCell(\''+indek+'\''
      +',\'gl_account_id_'+i+'_'+indek+'\',\'gl\')" '
      +' onfocus="this.select()" '
      +' style="text-align:center;"'
      +' size="8">'
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
      +' onchange="Employees.setCell(\''+indek+'\''
      +',\'rate_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()" '
      +' style="text-align:center;"'
      +' size="9">'
      +'</td>'

    +'<td align="center">'
      +'<button type="button"'
      +' id="btn_add"'
      +' onclick="Employees.addRow(\''+indek+'\','+i+')" >'
      +'</button>'
      
      +'<button type="button"'
      +' id="btn_remove"'
      +' onclick="Employees.removeRow(\''+indek+'\','+i+')" >'
      +'</button>'
    +'</td>'
    +'</tr>';
  }
  html+=Employees.tableFoot(indek);
  document.getElementById('gross_detail_'+indek).innerHTML=html;  
  if(panjang==0)Employees.addRow(indek,0);
}


Employees.tableHead=(indek)=>{
  return '<table>'
  +'<caption class="required" id="title_pay_info_'+indek+'">'
  +'</caption>'
  +'<thead>'
    +'<tr>'
    +'<th colspan="2">Field Name</th>'
    +'<th colspan="2">G/L Account</th>'
    +'<th>Rate</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
  +'</thead>';
}

Employees.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan="6">&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

Employees.getPayInfo=(indek)=>{
  const o=document.getElementById('employee_pay_method_'+indek);
  const a=bingkai[indek].data_default;
  if(o.selectedIndex==0){
    Employees.setRows(indek,a.salary_detail);
  }else{
    Employees.setRows(indek,a.hourly_detail);
  }
  
  document.getElementById('title_pay_info_'+indek).innerHTML
  =o.options[o.selectedIndex].text;
}

Employees.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].gross_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris)Employees.newRow(newBasket);
  }
  if(oldBasket.length==0) Employees.newRow(newBasket);
  Employees.setRows(indek,newBasket);
}

Employees.newRow=(newBasket)=>{
  var myItem={};
  myItem.row_id=newBasket.length+1;
  myItem.field_name='';
  myItem.gl_account_id='';
  myItem.rate=0;
  newBasket.push(myItem);
}

Employees.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].gross_detail;
  var newBasket=[];
  
  Employees.setRows(indek,oldBasket);
  for(let i=0;i<oldBasket.length;i++){
    if (i!=(number)){
      newBasket.push(oldBasket[i]);
    }
  }
  Employees.setRows(indek,newBasket);
}

Employees.setCell=(indek,id_kolom)=>{
  var isi=bingkai[indek].gross_detail;
  var baru = [];
  var isiEdit = {};
  
  for (var i=0;i<isi.length; i++){
    isiEdit=isi[i];
    
    if(id_kolom==('field_name_'+i+'_'+indek)){
      isiEdit.field_name=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
            
    }else if(id_kolom==('gl_account_id_'+i+'_'+indek)){
      isiEdit.gl_account_id=document.getElementById(id_kolom).value;
      baru.push(isiEdit);
      
    }else if(id_kolom==('rate_'+i+'_'+indek)){
      isiEdit.rate=document.getElementById(id_kolom).value;
      baru.push(isiEdit);

    }else{
      baru.push(isi[i]);
    }
  }
  bingkai[indek].gross_detail=baru;
}

Employees.getOne=(indek,employee_id,callBack)=>{
  db3.query(indek,'employees/read_one',{
    "employee_id":employee_id
  },(paket)=>{
    return callBack(paket);
  });
}

Employees.setAccount=(indek,d)=>{
  const id_kolom=bingkai[indek].id_kolom;
  const nama_kolom=bingkai[indek].nama_kolom;
  setEV(id_kolom, d.account_id);
  Employees.setCell(indek,id_kolom);  
  
  switch (nama_kolom){
    case "gl":
      Employees.setCell(indek,id_kolom);
      break;
    case "employee":
      Employees.employee.setCell(indek,id_kolom);
      break;
    case "payroll":
      Employees.payroll.setCell(indek,id_kolom);
      break;
    case "liability":
      Employees.payroll.setCell(indek,id_kolom);
      break;
    case "expense":
      Employees.payroll.setCell(indek,id_kolom);
      break;
    default:
      alert('['+nama_kolom+'] kolom tidak terdaftar...');
  }
}

Employees.payroll.setRows=(indek,isi)=>{
  if(isi===undefined)isi=[];    
  var panjang=isi.length;
  var html=Employees.payroll.tableHead(indek);
  bingkai[indek].payroll_detail=isi;
  
  for (var i=0;i<panjang;i++){
    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    
    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="payroll_field_name_'+i+'_'+indek+'"'
      +' value="'+isi[i].field_name+'"'
      +' onchange="Employees.payroll.setCell(\''+indek+'\''
      +',\'payroll_field_name_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"'
      +' style="text-align:left"'
      +' size="10" placeholder="Payroll Tax">'
      +'</td>'

    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="payroll_liability_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].liability_account_id+'"'
      +' onchange="Employees.payroll.setCell(\''+indek+'\''
      +',\'payroll_liability_account_id_'+i+'_'+indek+'\''
      +',\'liability\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center;"'
      +' size="8">'
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
      +' onchange="Employees.payroll.setCell(\''+indek+'\''
      +',\'payroll_expense_account_id_'+i+'_'+indek+'\''
      +',\'expense\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center;"'
      +' size="8">'
      +'</td>'
      
    +'<td><button type="button"'
      +' id="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'payroll_expense_account_id_'+i+'_'+indek+'\''
      +',\'expense\');">'
      +'</button>'
      +'</td>'
      
    +'<td  align="center" style="padding:0;margin:0;">'
      +'<select id="payroll_formula_'+i+'_'+indek+'">'
      +' onchange="Employees.payroll.setCell(\''+indek+'\''
      +',\'payroll_formula_'+i+'_'+indek+'\')">'
      +getFormula(indek,isi[i].formula)
      +'</select>'
    +'</td>'

    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="payroll_amount_'+i+'_'+indek+'"'
      +' value="'+isi[i].amount+'"'
      +' onchange="Employees.payroll.setCell(\''+indek+'\''
      +',\'payroll_amount_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center"'
      +' size="9">'
      +'</td>'
      
    +'<td align="center">'
      +'<button type="button"'
      +' id="btn_add"'
      +' onclick="Employees.payroll.addRow(\''+indek+'\','+i+')" >'
      +'</button>'
      
      +'<button type="button"'
      +' id="btn_remove"'
      +' onclick="Employees.payroll.removeRow(\''+indek+'\','+i+')" >'
      +'</button>'
    +'</td>'
    +'</tr>';
  }
  html+=Employees.payroll.tableFoot(indek);
  document.getElementById('payroll_detail_'+indek).innerHTML=html;
  if(panjang==0)Employees.payroll.addRow(indek,0);
}

Employees.payroll.tableHead=(indek)=>{
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

Employees.payroll.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td colspan="7">&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

Employees.payroll.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].payroll_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) newRow(newBasket);
  }
  if(oldBasket.length==0) newRow(newBasket);
  Employees.payroll.setRows(indek,newBasket);

  function newRow(newBas){
    var myItem={};
    myItem.row_id=newBas.length+1;
    myItem.field_name='';
    myItem.liability_account_id='';
    myItem.expense_account_id='';
    myItem.formula=-1;
    myItem.Amount=0;
    newBas.push(myItem);
  }
}

Employees.payroll.setCell=(indek,id_kolom)=>{
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

Employees.payroll.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].payroll_detail;
  var newBasket=[];
  
  Employees.payroll.setRows(indek,oldBasket);
  for(let i=0;i<oldBasket.length;i++){
    if (i!=(number)){
      newBasket.push(oldBasket[i]);
    }
  }
  Employees.payroll.setRows(indek,newBasket);
}

Employees.employee.setRows=(indek,isi)=>{
  if(isi===undefined)isi=[];    
  var panjang=isi.length;
  var html=Employees.employee.tableHead(indek);

  bingkai[indek].employee_detail=isi;
  
  for (var i=0;i<panjang;i++){
    html+='<tr>'
    +'<td align="center">'+(i+1)+'</td>'
    
    +'<td style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="employee_field_name_'+i+'_'+indek+'"'
      +' value="'+isi[i].field_name+'"'
      +' onchange="Employees.employee.setCell(\''+indek+'\''
      +',\'employee_field_name_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"'
      +' style="text-align:left"'
      +' size="10" placeholder="Employee">'
      +'</td>'

    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="employee_gl_account_id_'+i+'_'+indek+'"'
      +' value="'+isi[i].gl_account_id+'"'
      +' onchange="Employees.employee.setCell(\''+indek+'\''
      +',\'employee_gl_account_id_'+i+'_'+indek+'\''
      +',\'employee\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center;"'
      +' size="8">'
    +'</td>'
      
    +'<td><button type="button"'
      +' id="btn_find" '
      +' onclick="Accounts.lookUp(\''+indek+'\''
      +',\'employee_gl_account_id_'+i+'_'+indek+'\''
      +',\'employee\');">'
      +'</button>'
    +'</td>'
      
    +'<td  align="center" style="padding:0;margin:0;">'
      +'<select id="employee_formula_'+i+'_'+indek+'">'
      +' onchange="Employees.employee.setCell(\''+indek+'\''
      +',\'employee_formula_'+i+'_'+indek+'\')">'
      +getFormula(indek,isi[i].formula)
      +'</select>'
    +'</td>'
    
    +'<td  align="center" style="padding:0;margin:0;">'
    +'<input type="text"'
      +' id="employee_amount_'+i+'_'+indek+'"'
      +' value="'+isi[i].amount+'"'
      +' onchange="Employees.employee.setCell(\''+indek+'\''
      +',\'employee_amount_'+i+'_'+indek+'\')" '
      +' onfocus="this.select()"'
      +' style="text-align:center"'
      +' size="9">'
      +'</td>'

    +'<td align="center">'
      +'<button type="button"'
      +' id="btn_add"'
      +' onclick="Employees.employee.addRow(\''+indek+'\','+i+')" >'
      +'</button>'

      +'<button type="button"'
      +' id="btn_remove"'
      +' onclick="Employees.employee.removeRow(\''+indek+'\','+i+')" >'
      +'</button>'
    +'</td>'
    +'</tr>';
  }
  html+=Employees.employee.tableFoot(indek);
  document.getElementById('employee_detail_'+indek).innerHTML=html;
  if(panjang==0)Employees.employee.addRow(indek,0);
}

Employees.employee.tableHead=(indek)=>{
  return '<table>'
  +'<thead>'
    +'<tr>'
    +'<th colspan="2">Field Name</th>'
    +'<th colspan="2">G/L Account</th>'
    +'<th>Formula</th>'
    +'<th>Amount</th>'
    +'<th>Add/Rem</th>'
    +'</tr>'
  +'</thead>';
}

Employees.employee.tableFoot=(indek)=>{
  return '<tfoot>'
    +'<tr>'
    +'<td>&nbsp;</td>'
    +'</tr>'
    +'</tfoot>'
    +'</table>';
}

Employees.employee.addRow=(indek,baris)=>{
  var oldBasket=[];
  var newBasket=[];
  
  oldBasket=bingkai[indek].employee_detail;
  for(var i=0;i<oldBasket.length;i++){
    newBasket.push(oldBasket[i]);
    if(i==baris) newRow(newBasket);
  }
  if(oldBasket.length==0) newRow(newBasket);
  Employees.employee.setRows(indek,newBasket);

  function newRow(newBas){
    var myItem={};
    myItem.row_id=newBas.length+1;
    myItem.field_name='';
    myItem.gl_account_id='';
    myItem.formula=-1;
    myItem.amount=0;
    newBas.push(myItem);
  }
}

Employees.employee.removeRow=(indek,number)=>{
  var oldBasket=bingkai[indek].employee_detail;
  var newBasket=[];
  
  Employees.employee.setRows(indek,oldBasket);
  for(let i=0;i<oldBasket.length;i++){
    if (i!=(number)){
      newBasket.push(oldBasket[i]);
    }
  }
  Employees.employee.setRows(indek,newBasket);
}

Employees.employee.setCell=(indek,id_kolom)=>{
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
      
    }else if(id_kolom==('employee_calculated_'+i+'_'+indek)){
      isiEdit.calculated=getEC(id_kolom);
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

Employees.lookUpSalesRep=(indek,id_kolom)=>{
  bingkai[indek].id_kolom=id_kolom;
  objPop=new SalesRepLook(indek);
  objPop.show();
}

// eof:
