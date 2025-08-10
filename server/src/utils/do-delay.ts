const doDelay = async (time: number) => {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

export { doDelay }