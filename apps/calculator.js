'use strict';

let display=document.getElementById('display');
let currentInput='';
let currentOperator='';
let currentValue='';
let prevValue=0;
let prevOperator='';

function appendToDisplay(value){
  currentInput+=value;
  display.innerText=currentInput;
}

function clearDisplay(){
  currentInput='';
  currentOperator='';
  prevValue=0;
  display.innerText='0';
}

function calculateResult(){
}


clearDisplay();
