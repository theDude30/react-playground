export default function debounce(func:Function,delay:number){
let timeoutId:NodeJS.Timeout;

return function (...args:any) {
    clearTimeout(timeoutId);
    timeoutId=setTimeout(()=>{
        func.apply(this,args);
    },delay)
}
}