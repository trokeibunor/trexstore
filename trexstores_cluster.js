var cluster = require('cluster');

function startWorker(){
    var worker = cluster.fork();
    console.log('CLUSTER: worker %d has started' + worker.id)
}
if(cluster.isMaster){
    require('os').cpus().forEach(function(){
        startWorker()
    })
    cluster.on('disconnect', function(worker){
        console.log('CLUSTER: worker %d has left' + worker.id)
    })
    cluster.on('exit', function(worker,code,signal){
        console.log('CLUSTER: worker %d has died' ,worker.id ,code,signal)
        startWorker();
    })
}else{
    require('./trexstores.js')
}
