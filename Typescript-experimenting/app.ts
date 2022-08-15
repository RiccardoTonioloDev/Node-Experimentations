const num1Element = document.getElementById('num1') as HTMLInputElement;
const num2Element = document.getElementById('num2') as HTMLInputElement;
const buttonElement = document.querySelector('button')!;

const numResults: number[] = [];
const textResults: string[] = [];

type NumOrStr = number | string; //Stiamo definendo un alias per il tipo unione usato a destra.
type Result = { val:  number; timestamp: Date };

interface ResultObj { val:  number; timestamp: Date };

function add(num1: NumOrStr, num2: NumOrStr){
    if(typeof num1 === 'number' && typeof num2 === 'number'){
        return num1+num2;
    }
    else if(typeof num1 === 'string' && typeof num2 === 'string'){
        return num1+num2;
    }
    return +num1 + +num2;
}

function printResult(resultObj: ResultObj){
    console.log(resultObj.val);
}

buttonElement.addEventListener('click', ()=>{
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1,+num2);
    //In questo modo andiamo a forzare il casting da string a number (funzione
    //nativa di Javascript)
    numResults.push(result as number);
    const stringResult = add(num1, num2);
    textResults.push(stringResult as string);
    console.log(result);
    console.log(stringResult);
    printResult({val: result as number, timestamp: new Date()});
    console.log(numResults, textResults);
});