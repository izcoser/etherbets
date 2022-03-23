export function boolToClass(b){
    return b ? "validField" : "invalidField";  
}

function fact(n){
    let f = 1;
    for(let i = 2; i <= n; i++){
      f *= i;
    }
    return f;
}
  
export function combination(n, r){
    let c = 1;
    let i = 0;
    while(i < r){
      c *= n - i;
      i++;
    }
    return c / fact(r);
}