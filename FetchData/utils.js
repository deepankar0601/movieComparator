let timeId;
const debounce = (func,delay = 1000) => {
    let timeId;
    return (...args) => {
    if(timeId){
        clearTimeout(timeId)
    }
    timeId = setTimeout( () => {
            func.apply(null,args)
        },delay);
}
}