/*
 * auth: budiono
 * date: sep-04, 16:34, mon-2023; new;116;
 * edit: sep-11, 12:28, mon-2023; items;
 * edit: sep-27, 13:59, wed-2023; account_begin;vendor_begins;
 * edit: sep-29, 11:00, fri-2023; job_begins;
 * edit: oct-03, 14:19, tue-2023; notes;
 * edit: oct-12, 14:50, thu-2023; journal-entry;
 * edit: oct-12, 21:25, thu-2023; builds;unbuilds;
 * edit: oct-13, 16:47, fri-2023; moves;adjustment;
 */ 

'use strict';

iii.uploadJSON=(indek)=>{
  var html='<div style="padding:0 1rem 0 1rem">'
    +'<h1>'+MODE_IMPORT+'</h1>'
    +'<p id="exportTable" style="display:none"></p>'
    +iii.selectFileJSON(indek)
    +'</div>'
  content.html(indek,html);
  statusbar.ready(indek);
}

iii.selectFileJSON=(indek)=>{
  var html=''
    +'<div id="hasil_'+indek+'" style="margin-top:10px;">'
      +'<h2>Step 1: Select file JSON</h2>'
      +'<p>Select File: '
      +'<input type="file" '
      +' onchange="iii.readFileJSON(this,'+indek+')"'
      +' accept=".json">'
      +'</p>'
    +'</div>';
  return html;
}

iii.readFileJSON=(input,indek)=>{
  const file=input.files[0];
  const reader=new FileReader();

  reader.readAsText(file);
  reader.onload = function() {
    //bacaDataJSON(indek,reader.result);
    bingkai[indek].dataImport=JSON.parse(reader.result);
    iii.setData(indek)
  };

  reader.onerror = function() {
    console.log(reader.error);
  };      
}

iii.setData=(indek)=>{
  var data_import=bingkai[indek].dataImport;
  var data=[];
  var arr={};
  var html;
  var tabel='';
  
  // restore data
  var d=(data_import);
  var jml=d.fields.length;
  var j;
  
  tabel="<table>";
    +'<tr>'
  
  for(var t=0;t<d.fields.length;t++){
    tabel+='<th>'+d.fields[t]+'</th>';
  }
  +'</tr>'
  
  if(jml==0){
    jml=d.data.length;
    if(jml>0){
      jml=d.data[0].length;
    }
  }
  
  for(var i=0;i<data_import.data.length;i++){
    tabel+='<tr>'
    for(j=0;j<jml;j++){
      tabel+='<td>'+tHTML(data_import.data[i][j])+'</td>';
    }
    tabel+='</tr>'
  }
  tabel+="</table>"
  
  html='<h2>Step 2: Insert Data </h2>'
    +'<button'
    +' id="btn_import_all_'+indek+'"'
    +' onclick="iii.importExecute('+indek+');">'
    +'Import Data</button>'
    +'<p id="msgImport_'+indek+'"></p><br>'
    +'<p>'+data_import.data.length+' rows ready.'
    +' Klik button [<b>Import Data</b>] to process.</p>'
    +'<div style="overflow-y:auto;">'
    +'<pre>'+tabel
    +'</pre></div>'
  document.getElementById('hasil_'+indek).innerHTML=html;
}


iii.importExecute=(indek)=>{
  const modul=bingkai[indek].menu.id;
  switch(modul){
    case "cost_codes":
      Costs.importExecute(indek);break;
    case "phases":
      Phases.importExecute(indek);break;
    case "accounts":
      Accounts.importExecute(indek);break;
    case "locations":
      Locations.importExecute(indek);break;
    case "item_taxes":
      ItemTaxes.importExecute(indek);break;
    case "ship_methods":
      ShipVia.importExecute(indek);break;
    case "pay_methods":
      PayMethods.importExecute(indek);break;
    case "manage_users":
      Users.importExecute(indek);break;
    case "item_defaults":
      ItemDefaults.importExecute(indek);break;
    case "items":
      Items.importExecute(indek);break;
    case "vendor_defaults":
      VendorDefaults.importExecute(indek);break;
    case "vendors":
      Vendors.importExecute(indek);break;
    case "customer_defaults":
      CustomerDefaults.importExecute(indek);break;
    case "customers":
      Customers.importExecute(indek);break;
    case "employee_defaults":
      EmployeeDefaults.importExecute(indek);break;
    case "employees":
      Employees.importExecute(indek);break;
    case "sales_taxes":
      SalesTax.importExecute(indek);break;
    case "jobs":
      Jobs.importExecute(indek);break;
    case "boms":
      Boms.importExecute(indek);break;
    case "prices":
      Prices.importExecute(indek);break;
    case "account_begins":
      AccountBegins.importExecute(indek);break;
    case "vendor_begins":
      VendorBegins.importExecute(indek);break;
    case "customer_begins":
      CustomerBegins.importExecute(indek);break;
    case "job_begins":
      JobBegins.importExecute(indek);break;
    case "item_begins":
      ItemBegins.importExecute(indek);break;
    case "employee_begins":
      EmployeeBegins.importExecute(indek);break;
    case "notes":
      Notes.importExecute(indek);break;
    case "journal_entry":
      JournalEntry.importExecute(indek);break;
    case "builds":
      Builds.importExecute(indek);break;
    case "unbuilds":
      Unbuilds.importExecute(indek);break;
    case "moves":
      Moves.importExecute(indek);break;
    case "adjustments":
      Adjustments.importExecute(indek);break;

    default:
      alert('['+modul +'] undefined in [import_data.js]. ');
  }
}
// eof: 116;
