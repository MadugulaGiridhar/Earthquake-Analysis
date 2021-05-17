var mysql = require('mysql');

var bodyParser = require('body-parser');

var random=require('random');
var _ =require('lodash');
//middleware parser

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var redis = require('redis');


var quakes1=[];
var quakes2=[];

module.exports = function (app) {

    app.get('/home', function (req, res) {
        res.render('index');
    });

   
// redis



var redisHost = 'redis-10799.c56.east-us.azure.cloud.redislabs.com';
var redisPort = process.argv[3] || 10799;
var redisAuth = 'admin@123';

var client = redis.createClient ({
port : redisPort,
host : redisHost
});

client.auth(redisAuth, function(err, response){
if(err){
throw err;
}
else{
    console.log('the redis cache is connected!!');
}

});
// client.flushall()
// client.flushdb( function (err, succeeded) {
//     console.log('the redis is flushed successfully'); // will be true if successfull
// });


// // client.set('foo','bar');
// client.get('foo', function(err, response){
// if(err) {
// throw err;
// }else{
// console.log('*****************',response);
// }
// });

// client.get(`${req.body.year1},${req.body.year2}`,JSON.stringify(rows));

// client.get('1970,1980', function(err, response){
// if(err) {
// throw err;
// }else{
// console.log('*****************',response);

// console.log('#########');


// }
// });


//    DB


const { Connection, Request } = require("tedious");

const config = {
    authentication: {
    options: {
    userName: "admin1", 
    password: "admin@123",    
    },
    type: "default"
    },

connectionTimeout: 32000,

requestTimeout: 32000,

pool: {

    idleTimeoutMillis: 32000

},

stream: true,

parseJSON: true,

    server: "adbproject.database.windows.net", 
    options: {
    database: "adb",
    encrypt: true,
    // rowCollectionOnDone: true,
    rowCollectionOnRequestCompletion: true,
    useColumnNames: true
    
    }
   };

   const connection = new Connection(config);

 
// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
 if (err) {
 console.error(err.message);
 } else {
 //queryDatabase();
 console.log("Database conneected!!")
 }
});


app.post('/question11', (req, res) => {
       
        
    console.log('----->quakes input --->', req.body.range);        
    console.log('----->quakes input --->', req.body.year1);        
    console.log('----->quakes input --->', req.body.year2);     
    
  
    var number1 =Number(req.body.range);

    var val1 = req.body.year1;
    var val2 = req.body.year2;
    const totalstarttime = Date.now();
client.get(`${req.body.year1},${req.body.year2}`, function(err, response){
if(!err && response!=null) {
    // var result=[];
    var result=response;
    console.log("from cache")
    // newobj = {};    
    // newobj["Totaltime"] = Date.now() - totalstarttime;
    // result.push(newobj);
    res.send(response)

res.render('question10', { data: result });
}
else{




    var result = [];
    exesql(val1,val2,number1,0);
    const totalstarttime = Date.now();
    function exesql(val1,val2,range,i) {
console.log('the value of i is ',i);
    const start = Date.now();
    var boundary1;
    var boundary2;
    var obj = {};
    if(val1<=val2)
    {
        boundary1 = val1;
        boundary2 = val2;
    }
    else{
    boundary1 = val2;
    boundary2 = val1;
    }
    console.log(boundary1);
    console.log(boundary2);
    var sql = `Select Entity,year,NumberTerroristIncidents from country_t where year between ${req.body.year1} and ${req.body.year2}`;
    if(i==range){      
        newobj = {};
        client.set(`${req.body.year1},${req.body.year2}`,JSON.stringify(result));
        newobj["Totaltime"] = Date.now() - totalstarttime;
        result.push(newobj);
        // console.log(result);          
        console.log("the final result is",result[0][0].Entity.value);          
    res.render('question10', { data: result });
    }
    else {
    const request = new Request(sql,
    (err, rowCount, rows) => {
    if (err) {
    console.error(err.message);
    } else {
    console.log('the no of rows returned',rowCount);
    // obj["coordinates"] = boundary1 + "," + boundary2;
    // obj["time"] = Date.now() - start;        
    // obj["rows"] = rows;
    result.push(rows);
    // console.log(rows);
    // console.log(rows[0].Entity.value);
    // console.log(result);      
    // console.log("the result value",result[0]);
    console.log("the result value")
    
    }
    });
    request.on('requestCompleted', function () { 
    var val1 = req.body.year1;
    var val2 = req.body.year2;
    exesql(val1,val2,range,++i);        
    });
    
    connection.execSql(request);
    }
    
   } 


}

});


 });












app.post('/question10_2', (req, res) => {
       
        
    console.log('----->quakes input --->', req.body.range);        
    console.log('----->quakes input --->', req.body.year1);        
    console.log('----->quakes input --->', req.body.year2);     
    
  
    var number1 =Number(req.body.range);

    var val1 = req.body.year1;
    var val2 = req.body.year2;
    
    var result = [];
    exesql(val1,val2,number1,0);
    const totalstarttime = Date.now();
    function exesql(val1,val2,range,i) {
console.log('the value of i is ',i);
    const start = Date.now();
    var boundary1;
    var boundary2;
    var obj = {};
    if(val1<=val2)
    {
        boundary1 = val1;
        boundary2 = val2;
    }
    else{
    boundary1 = val2;
    boundary2 = val1;
    }   
    var sql = `select count(NumberTerroristIncidents) as count,t.Entity from country s, country_t t where s.Prevalence between  ${req.body.year1} and  ${req.body.year1} and s.Code = t.Code group by t.entity,NumberTerroristIncidents`;
    if(i==range){      
        newobj = {};
        newobj["Totaltime"] = Date.now() - totalstarttime;
        result.push(newobj);
        // console.log(result);          
        console.log("the final result is",result[0]);          
    res.render('question10_2', { data: result });
    }
    else {
    const request = new Request(sql,
    (err, rowCount, rows) => {
    if (err) {
    console.error(err.message);
    } else {
    console.log('the no of rows returned',rowCount);
    // obj["coordinates"] = boundary1 + "," + boundary2;
    // obj["time"] = Date.now() - start;        
    // obj["rows"] = rows;
    result.push(rows);
    // console.log(rows);
    // console.log(rows[0].Entity.value);
    // console.log(result);      
    // console.log("the result value",result[0]);
    console.log("the result value")
    
    }
    });
    request.on('requestCompleted', function () { 
    var val1 = req.body.year1;
    var val2 = req.body.year2;
    exesql(val1,val2,range,++i);        
    });
    
    connection.execSql(request);
    }
    
   } 
 });






app.post('/question10', (req, res) => {
       
        
    console.log('----->quakes input --->', req.body.range);        
    console.log('----->quakes input --->', req.body.year1);        
    console.log('----->quakes input --->', req.body.year2);     
    
  
    var number1 =Number(req.body.range);

    var val1 = req.body.year1;
    var val2 = req.body.year2;
    
    var result = [];
    exesql(val1,val2,number1,0);
    const totalstarttime = Date.now();
    function exesql(val1,val2,range,i) {
console.log('the value of i is ',i);
    const start = Date.now();
    var boundary1;
    var boundary2;
    var obj = {};
    if(val1<=val2)
    {
        boundary1 = val1;
        boundary2 = val2;
    }
    else{
    boundary1 = val2;
    boundary2 = val1;
    }
    console.log(boundary1);
    console.log(boundary2);
    var sql = `Select Entity,year,NumberTerroristIncidents from country_t where year between ${req.body.year1} and ${req.body.year2}`;
    if(i==range){      
        newobj = {};
        client.set(`${req.body.year1},${req.body.year2}`,JSON.stringify(result));
        newobj["Totaltime"] = Date.now() - totalstarttime;
        result.push(newobj);
        // console.log(result);          
        console.log("the final result is",result[0][0].Entity.value);          
    res.render('question10', { data: result });
    }
    else {
    const request = new Request(sql,
    (err, rowCount, rows) => {
    if (err) {
    console.error(err.message);
    } else {
    console.log('the no of rows returned',rowCount);
    // obj["coordinates"] = boundary1 + "," + boundary2;
    // obj["time"] = Date.now() - start;        
    // obj["rows"] = rows;
    result.push(rows);
    // console.log(rows);
    // console.log(rows[0].Entity.value);
    // console.log(result);      
    // console.log("the result value",result[0]);
    console.log("the result value")
    
    }
    });
    request.on('requestCompleted', function () { 
    var val1 = req.body.year1;
    var val2 = req.body.year2;
    exesql(val1,val2,range,++i);        
    });
    
    connection.execSql(request);
    }
    
   } 
 });


 app.post('/question9', (req, res) => {
    console.log('----->quakes input --->', req.body.year1);        
    console.log('----->quakes input --->', req.body.year2);                         
     var sql = `select count(NumberTerroristIncidents) as count,t.Entity from country s, country_t t where s.Prevalence between  ${req.body.year1} and  ${req.body.year1} and s.Code = t.Code group by t.entity,NumberTerroristIncidents`;
     const startTime= Date.now();
    var obj = {};    
     const request = new Request(sql,
     (err, rowCount, rows) => {
     if (err) {
     console.error('error!!!',err.message);
     } else {
     
     console.log(' row(s) returned',rowCount);
     console.log('the rows are',rows);    
    obj["timeTaken"] = Date.now() - startTime;
    rows.push(obj);
    console.log(rows)    ;
     res.render('question9', { data: rows });
     }
     });
     
     connection.execSql(request);
 
 });





app.post('/question8', (req, res) => {
    console.log('----->quakes input --->', req.body.year1);        
    console.log('----->quakes input --->', req.body.year2);                         
     var sql = `Select Entity,year,NumberTerroristIncidents from country_t where year between ${req.body.year1} and ${req.body.year2}`;
     const startTime= Date.now();
    var obj = {};    
     const request = new Request(sql,
     (err, rowCount, rows) => {
     if (err) {
     console.error('error!!!',err.message);
     } else {
     
     console.log(' row(s) returned',rowCount);
     console.log('the rows are',rows);    
    obj["timeTaken"] = Date.now() - startTime;
    rows.push(obj);
    console.log(rows)    ;
     res.render('question8', { data: rows });
     }
     });
     
     connection.execSql(request);
 
 });



app.get('/question7', (req, res) => {
    console.log('----->home image --->', req.query.code_name);                                     
                    var sql = `select year,NumberTerroristIncidents,Entity from country_t where code='${req.query.code_name}' order by year asc `;
                    const startTime= Date.now();
                    var obj = {};
                    const request = new Request(sql,
                    (err, rowCount, rows) => {
                    if (err) {
                    console.error('error!!!',err.message);
                    } else {
                    
                    console.log(`${rowCount} row(s) returned`);
                    // console.log('the rows are',rows[0]);
                    console.log('the 2nd rows are',rows);
                    obj["timeTaken"] = Date.now() - startTime;
                    rows.push(obj);
                    console.log(rows);
                    // client.set(`${req.query.quake_limit}`,JSON.stringify(rows));
                    res.render('question7', { data: rows });
                    }
                    });
                    
                    connection.execSql(request);
 });



       
 app.get('/intial_page', (req, res) => {
    console.log('----->home image --->', req.query.quake_limit);
    
     let rows1 = {}
                                                             
                    ibmdb2.query(`Select * from earthquakes  where depth is NOT NULL ORDER BY depth desc; 
                    Select * from earthquakes where mag=2.28;`, (err, rows, fields) => {
             console.log(rows);
             if (!err && rows!=null) {    
                 console.log('--------------!!!!!!!!!!!*********', rows[0]);
                  console.log('Response from DB ---->', rows);
                 res.render('intial_page', { data: rows });
                 
             } else{
                 res.render('Error');
             }                                      
         })         
 });


    
    app.get('/show_top_quakes', (req, res) => {
        console.log('----->home image --->', req.query.quake_limit);                                     
                        var sql = `Select top ${req.query.quake_limit} * from earthquakes order by mag desc `;
                        const startTime= Date.now();
                        var obj = {};
                        const request = new Request(sql,
                        (err, rowCount, rows) => {
                        if (err) {
                        console.error('error!!!',err.message);
                        } else {
                        
                        console.log(`${rowCount} row(s) returned`);
                        // console.log('the rows are',rows[0]);
                        console.log('the 2nd rows are',rows);
                        obj["timeTaken"] = Date.now() - startTime;
                        rows.push(obj);
                        console.log(rows);
                        client.set(`${req.query.quake_limit}`,JSON.stringify(rows));
                        res.render('show_top_quakes', { data: rows });
                        }
                        });
                        
                        connection.execSql(request);
     });

    // with cache

     app.get('/show_top_quakes_cache', (req, res) => {
        console.log('----->home image --->', req.query.quake_limit);                                     
                        var sql = `Select top ${req.query.quake_limit} * from earthquakes order by mag desc `;
                        const startTime= Date.now();
                        var obj = {};
                        client.get(`${req.query.quake_limit}`, function(err, response){
                            if(err || response ==null ) {
                            const request=new Request(sql,(err,rowCount,rows)=>{
                            if (err) {
                                console.error(err.message);
                            }
                            else
                            {
                            client.set(`${req.query.quake_limit}`,JSON.stringify(rows));
                            console.log(`${rowCount} row(s) returned`);
                            // console.log('***************  the query limit data',rows);
                            obj["timeTaken"] = Date.now() - startTime;
                            rows.push(obj);
                            console.log(rows);
                            console.log('from the db data ')
                            res.render('show_top_quakes_cache', { data: rows });
                            }
                            });
                            connection.execSql(request);
                            }
                            else{
                                
                                var result = JSON.parse(response.toString());
                                obj["timeTaken"] = Date.now() - startTime;
                                result.push(obj);                                
                                console.log(result);
                                console.log("From cache");
                                res.render('show_top_quakes_cache', { data: result });
                                
                            }
                            });
     });





    //  client.set('foo','bar');
    //  client.get('foo', function(err, response){
    //  if(err) {
    //  throw err;
    //  }else{
    //  console.log('*****************',response);
    //  }
    //  });
    



     app.post('/quakes_range', (req, res) => {
        console.log('----->quakes input --->', req.body.latitude1);        
        console.log('----->quakes input --->', req.body.latitude2);                         
         var sql = `Select * from earthquakes where latitude between ${req.body.latitude1} and  ${req.body.latitude2} `;
         const startTime= Date.now();
        var obj = {};
        //  var sql =`Select * from dbo.earthquakes where latitude between 60.2 and 60.25;`;
         const request = new Request(sql,
         (err, rowCount, rows) => {
         if (err) {
         console.error('error!!!',err.message);
         } else {
         
         console.log(' row(s) returned',rowCount);
         console.log('the rows are',rows);
        //  console.log('the 2nd rows are',rows);
        obj["timeTaken"] = Date.now() - startTime;
        rows.push(obj);
        client.set(`${req.body.latitude1},${req.body.latitude2}`,JSON.stringify(rows));
         res.render('quakes_range', { data: rows });
         }
         });
         
         connection.execSql(request);
     
     });



    // with cache

    app.post('/quakes_range_cache', (req, res) => {
        console.log('----->quakes input --->', req.body.latitude1);        
        console.log('----->quakes input --->', req.body.latitude2);  
        // var result=[] ;
         var sql = `Select * from earthquakes where latitude between ${req.body.latitude1} and  ${req.body.latitude2}`;
         const startTime= Date.now();
         var obj = {};       
         client.get(`${req.body.latitude1},${req.body.latitude2}`, function(err, response){
            if(err || response ==null ) {
            const request=new Request(sql,(err,rowCount,rows)=>{
            if (err) {
                console.error(err.message);
            }
            else
            {
            client.set(`${req.body.latitude1},${req.body.latitude2}`,JSON.stringify(rows));
            console.log(`${rowCount} row(s) returned`);
            // console.log('***************  the query limit data',rows);            
            obj["timeTaken"] = Date.now() - startTime;
            rows.push(obj);
            console.log(rows);
            console.log('from the db data ')
            res.render('quakes_range_cache', { data: rows });
            }
            });
            connection.execSql(request);
            }
            else{
                
               
                var result = JSON.parse(response.toString());              
                obj["timeTaken"] = Date.now() - startTime;
                result.push(obj);
                console.log(result);
                console.log("From cache");                
                res.render('quakes_range_cache', { data: result });
                
            }
            });
     });


     app.post('/random_range', (req, res) => {
       
        
        console.log('----->quakes input --->', req.body.range);        
        console.log('----->quakes input --->', req.body.latitude1);        
        console.log('----->quakes input --->', req.body.latitude2);     
        
      
        var number1 =Number(req.body.range);
 
        var val1 = random.float(min =Number(req.body.latitude1),max =Number(req.body.latitude2));
        
        var val2 = random.float(min = Number(req.body.latitude1),max =Number(req.body.latitude2));
        
        var result = [];
        exesql(val1,val2,number1,0);
        
        function exesql(val1,val2,range,i) {
    console.log('the value of i is ',i);
        const start = Date.now();
        var boundary1;
        var boundary2;
        var obj = {};
        if(val1<=val2)
        {
            boundary1 = val1;
            boundary2 = val2;
        }
        else{
        boundary1 = val2;
        boundary2 = val1;
        }
        console.log(boundary1);
        console.log(boundary2);
        var sql = `Select locationSource,place,time,mag from earthquakes where latitude between ${boundary1} and ${boundary2}`;
        if(i==range){                
        res.render('random_range', { data: result });
        }
        else {
        const request = new Request(sql,
        (err, rowCount, rows) => {
        if (err) {
        console.error(err.message);
        } else {
        console.log('the no of rows returned',rowCount);
        obj["coordinates"] = boundary1 + "," + boundary2;
        obj["time"] = Date.now() - start;        
        obj["rows"] = rows;
        result.push(obj);
        console.log(result);              
        
        }
        });
        request.on('requestCompleted', function () { 
        var val1 = random.float(min = req.body.latitude1,max = req.body.latitude2);        
        var val2 = random.float(min = req.body.latitude1,max = req.body.latitude2);        
        exesql(val1,val2,range,++i);        
        });
        
        connection.execSql(request);
        }
        
       } 
     });



     // with cache!!



     app.post("/random_range_cache", (req,res)=>{
        var result = [];
        // var lat1 = Number(req.body.Latitude1);
        // var lat2 = Number(req.body.Latitude2);
        let val1 = _.cloneDeep(req.body.latitude1);
        let val2 = _.cloneDeep(req.body.latitude2);
        var lat1 = parseFloat(val1);        
        var lat2 = parseFloat(val2);
        var timenew = Number(req.body.range);
        var i = 0;
        const totalstarttime = Date.now();
        callsqlfun(lat1,lat2);
        
        function callsqlfun(val1,val2)
        {
        const starttime = Date.now();
        var lL = val1;
        var uL = val2;
        var newobj = {};
        var sql = `Select locationSource,place,time,mag from earthquakes where latitude between ${lL} and ${uL}`;
        var label = val1 + "," + val2;
        if(i==timenew)
        {   
        newobj = {};
        newobj["Totaltime"] = Date.now() - totalstarttime;
        result.push(newobj);
        console.log(result);
        res.render('random_range_cache',{ data: result })
        }
        else
        {
            client.get(label, (err, data) => {
                if (err || data == null) {
                    console.log(data);
                }
            if (data != null) {
                var op = JSON.parse(data.toString());
                console.log("the value of ",op);
                newobj["cordinates"] = op.cordinates;
                newobj["timeTaken"] = Date.now() - starttime;
                newobj["tuples"] = op.tuples;
                newobj["retrieved"] = "Redis";
                result.push(newobj);
                var val1 = (random.float(min = Number(lat1),max = Number(lat2))).toFixed(1);
                var val2 = (random.float(min = Number(val1),max = Number(lat2))).toFixed(1);
                ++i;
                callsqlfun(val1,val2);
            } 
            else {
                const call = new Request(sql,(err, rowCount, rows) => {
                if (err) {
                console.error(err.message);
                } else {
                    newobj["tuples"] = rowCount;
                    newobj["cordinates"] = lL + "  and  " + uL;
                    newobj["timeTaken"] = Date.now() - starttime;
                    newobj["retrieved"] = "DB";
                    //newobj["data"] = rows;
                result.push(newobj);
                client.set(label, JSON.stringify(newobj));
                
                //
                console.log(result);
                }
                });
                call.on('requestCompleted', function () { 
                    i++;
                    var val1 = (random.float(min = Number(lat1),max = Number(lat2))).toFixed(1);
                    var val2 = (random.float(min = Number(val1),max = Number(lat2))).toFixed(1);
                callsqlfun(val1,val2);
                });
                connection.execSql(call);
                }
            });
        
       } 
        }
       });
     


    // app.post("/random_range",(req,res)=>{
    // console.log("request received : "+req.query);
    
    // var range=Number(req.body.range);
    // var value1= (random.float(min=Number(req.body.latitude1),max=Number(req.body.latitude2))).toFixed(1);
    // var value2= (random.float(min=Number(req.body.latitude1),max=Number(req.body.latitude2))).toFixed(1);
    // let val1 = _.cloneDeep(value1);
    // let val2 = _.cloneDeep(value2);
    // var result= [];
    // exesql(val1,val2,range,0);
    // var totalstartTime=Date.now();
    // function exesql(val1,val2,range,i){
    // const start=Date.now();
    // var lowerLimit;
    // var upperLimit;
    // var obj={};
    // if(val1<=val2)
    // {
    // lowerLimit=val1;
    // upperLimit=val2;
    // }
    // else{
    // lowerLimit=val2;
    // upperLimit=val1;
    // }
    // // var label=lowerLimit+""+upperLimit;
    // var sql=`Select locationSource,place,time,mag from earthquakes where latitude between ${lowerLimit} and ${upperLimit}`;
    // if(i==range){
    // var totalendTime= (Date.now() -totalstartTime);
    // var timeObj={};
    // timeObj["totalTime"] =totalendTime;
    // result.push(timeObj);
    // console.log(result);
    // // res.send(result);
    // res.render('random_range_cache',{ data: result })
    // }
    // else{
    // client.get(`${lowerLimit},${upperLimit}`,(err,data)=>{
    // if (err) {
    // console.log(err);
    // res.status(500).send(err);
    // }
    // //if no match found
    // if (data!=null) {
    // var op=JSON.parse(data.toString());
    // obj["coordinates"] =op.random;
    // obj["timeTaken"] =Date.now() -start;
    // obj["tuples"] =op.length;
    // obj["dbUsed"] ="Redis_cache";
    // result.push(obj);
    // var val1= (random.float(min=Number(req.body.latitude1),max=Number(req.body.latitude2))).toFixed(1);
    // var val2= (random.float(min=Number(req.body.latitude1),max=Number(req.body.latitude2))).toFixed(1);
    // exesql(val1,val2,range,++i);
    // }
    // else{
    // const request=new Request(sql,
    // (err,rowCount,rows)=>{
    // if (err) {
    // console.error(err.message);
    // }else{
    // // console.log(`${rowCount} row(s) returned`);
    // obj["coordinates"] =lowerLimit+","+upperLimit;
    // obj["timeTaken"] =Date.now() -start;
    // obj["tuples"] =rowCount;
    // obj["dbUsed"] ="DB";
    // result.push(obj);
    // client.set(`${lowerLimit},${upperLimit}`,JSON.stringify(obj),redis.print);
    // }
    // });
    // request.on('requestCompleted',function(){
    // var val1= (random.float(min=Number(req.body.latitude1),max=Number(req.body.latitude2))).toFixed(1);
    // var val2= (random.float(min=Number(req.body.latitude1),max=Number(req.body.latitude2))).toFixed(1);
    // exesql(val1,val2,range,++i);
    // });
    // connection.execSql(request);
    // }
    // });
    // }
     
    // }

    // });
    
    







     app.post('/quakes_date', (req, res) => {
        console.log('----->quake date1 --->', req.body.date1);
        console.log('----->quake date2 --->', req.body.date2);
        console.log('----->quake mag --->', req.body.mag);
        
         let rows1 = {}
         if (req.body) {                            
                    ibmdb2.query(`select * from earthquakes where mag<${req.body.mag} and VARCHAR_FORMAT(time,'YYYY-MM-DD') between '${req.body.date1}' and '${req.body.date2}'`, (err, rows, fields) => {                                            
                 console.log(err);
                 if (!err && rows!=null) {
                    //  rows1 = rows[0];
                     //console.log('--------------!!!!!!!!!!!*********', rows[0]);
                      console.log('Response from DB ---->', rows);
                     res.render('quakes_date', { data: rows });
                     
                 } else{
                     res.render('Error');
                 }                                      
             })
         } else {
             res.send('Empty');            
         }
     });

     

// -----------

app.post('/most_recent_data', (req, res) => {
    console.log('----->quake date1 --->', req.body.days);
   
    
     let rows1 = {}
     if (req.body) {                            
        ibmdb2.query(`SELECT count(richter_range) as COUNT, richter_range FROM  (select m.*, (case
            when m.mag between 0 and 1  then '0 to 1' 
            when m.mag between 1 and 2 then '1 to 2'
            when m.mag between 2 and 3 then '2 to 3' 
            when m.mag between 3 and 4 then '3 to 4'
            when m.mag between 4 and 5 then '4 to 5'
            when m.mag between 5 and 6 then '5 to 6'
            when m.mag between 6 and 7 then '6 to 7'  end) as richter_range from earthquakes m 
            where VARCHAR_FORMAT(time,'YYYY-MM-DD') >VARCHAR_FORMAT(sysdate-${req.body.days},'YYYY-MM-DD'))
            group by richter_range`, (err, rows, fields) => {    
             console.log(err);
             if (!err && rows!=null) {                
                  console.log('Response from DB ---->', rows);
                //   res.send(rows);
                var a=rows;
                  res.render('most_recent_data', { data: a});
                 
             } else{
                 res.render('Error');
             }                                      
         })
     } else {
         res.send('Empty');            
     }
 });

// *****************
app.post('/more_common_quakes', (req, res) => {
    
    console.log('----->quakes input --->', req.body.latitude1);        
    console.log('----->quakes input --->', req.body.longitude1);       
    console.log('----->quakes input --->', req.body.latitude2);        
    console.log('----->quakes input --->', req.body.longitude2);        
    console.log('----->quakes input --->', req.body.range);             
    
    var lat1 = req.body.latitude1;
    var log1 = req.body.longitude1;
    var lat2 = req.body.latitude2;
    var log2 = req.body.longitude2;
    var dif = (req.body.range) / 111;

    
    lat11 = parseFloat(lat1) - dif;
    lat12 = parseFloat(lat1) + dif;
    log11 = parseFloat(log1) - dif;
    log12 = parseFloat(log1) + dif;

    lat21 = parseFloat(lat2) - dif;
    lat22 = parseFloat(lat2) + dif;
    log21 = parseFloat(log2) - dif;
    log22 = parseFloat(log2) + dif;
    
                            
                   ibmdb2.query(`SELECT * FROM earthquakes where latitude >= ${lat11} and latitude <= ${lat12 } and longitude >= ${log11 } and longitude <= ${log12}; 
                    SELECT * FROM earthquakes where latitude >= ${lat21} and latitude <= ${lat22} and longitude >= ${log21} and longitude <= ${log22};; 
                    UPDATE earthquakes SET DEPTH = ${req.body.range} WHERE latitude >= ${lat11} and latitude <= ${lat12} and longitude >= ${log11} and longitude <= ${log12};
                    UPDATE earthquakes SET DEPTH = ${req.body.range} WHERE latitude >= ${lat21} and latitude <= ${lat22} and longitude >= ${log21} and longitude <= ${log22};`, 
                    (err, rows, fields) => {                                               
                console.log(err);
                if (!err && rows!=null) {                
                    console.log('Response from DB ---->', rows[0].length);                                    
                    console.log('Response from DB ---->', rows[1].length);                                    
                    console.log('Response from DB ---->', rows[1].length);                                    
                    res.render('more_common_quakes', { data: rows});
                   
               } else{
                   res.render('Error');
               }                                            
                                                                    
            })
       


 });


 app.post('/largest_quake_range', (req, res) => {
    console.log('----->quake date1 --->', req.body.location);    
    console.log('----->quake mag --->', req.body.mag);
    if (req.body) {                            
        ibmdb2.query(`select * from earthquakes where PLACE like '%${req.body.location}%' and mag > ${req.body.mag} order by TIME ASC limit 10; 
         Select * from earthquakes where mag=6.80;`, (err, rows, fields) => {                                            
     console.log(err);
     console.log(rows);
     if (!err && rows!=null) {       
          console.log('Response from DB ---->', rows);
         res.render('quakes_date', { data: rows[0] });
         
     } else{
         res.render('Error');
     }                                      
 })
} else {
 res.send('Empty');            
}
 });

};