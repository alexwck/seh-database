const fs    = require("fs"),
      csv   = require("fast-csv"),
      moment= require("moment");

const sourceFile = "Y:/GRINDING6.csv",
      targetFile = "C:/Users/Alex/Desktop/GRINDING6.csv";    

const db    = require("./models");

const CronJob = require('cron').CronJob;

const pick = (obj, ...args) => ({
      ...args.reduce((res, key) => ({ ...res, [key]: obj[key] }), { })
})

new CronJob('* * * * *', async function() {
      console.log("Daily File Copying from Source File");
      await copyFile(sourceFile, targetFile);
      await parseCSV();
      this.stop();
  }, function() {
      console.log("Daily Job Stopped")
      this.start()
  },
  true
);

async function parseCSV() {
      let ingotBuffer = [];

      let stream = fs.createReadStream(targetFile)
      await csv.fromStream(stream, {headers:
            [
                  "lot", "order", "grcf", "grbrk", "grcrk", "grout", "grdam", "groth", "grpcs", , ,
                  "machine", "grDate", "drawingNo", "whlLife", "groove", "opt1", ,"opt2", , , , , , , , , , , , , , , , , , "cwotdt", , "grotdt"
            ]
      , trim:true})
      .on("data", async (data) =>{    
            let maker;
            switch(data.drawingNo.charAt(0)) {
                  case 'K':
                        maker = 'KGW';
                        break;
                  case 'A':
                        maker = 'Asahi';
                        break;
                  case 'N':
                        maker = 'Noritake';
                        break;
                  case 'M':
                        maker = 'Adamas';
                        break; 
                  default:
                        break;
            }
            let whlLife = Number(data.whlLife)
            if (whlLife <0 || isNaN(whlLife)){
                  whlLife = 0;
            }
            let grDate = moment(data.grDate, 'YYMMDD').format('YYYY-MM-DD');
            let grindingData = pick(data, 'machine', 'drawingNo', 'grpcs', 'groove', 'opt1', 'opt2', 
                                    'grcf', 'grbrk', 'grcrk', 'grout', 'grdam', 'groth');
            Object.assign(grindingData, {grDate: grDate, maker: maker, whlLife: whlLife});
            let grinding = { "order": data.order, "lot": data.lot, "grinding":grindingData};
            
            if (data.cwotdt !== '000000' || data.grDate === '000000'){
                  let ingot = {"order": data.order, "lot": data.lot}
                  await db.Ingot.find(ingot, function(err, foundIngot){
                        if(foundIngot && foundIngot.length !== 0){
                              if(foundIngot[0].grinding.grDate === "Invalid date" && data.cwotdt !== '000000'){
                                    let ingot_id = foundIngot.map((docs)=>{return docs._id})
                                    let updatedData = {"grinding":grindingData}
                                    db.Ingot.updateOne({"_id": ingot_id}, updatedData, function(err, updatedIngot){})
                              }
                        } else{
                              ingotBuffer.push(grinding);
                        }    
                  })
            }
      })
      .on("end", async function(){
            await db.Ingot.find({}, function(err, ingotAvailable){
                  if(ingotAvailable.length !== 0){
                        db.Ingot.insertMany(ingotBuffer)
                        ingotBuffer = [];
                  } else{
                        db.Ingot.insertMany(ingotBuffer)
                        ingotBuffer = []; 
                  }
            });
      });
}

function copyFile(source, target) {
      let rd = fs.createReadStream(source);
      let wr = fs.createWriteStream(target);
      return new Promise(function(resolve, reject) {
            rd.on('error', reject);
            wr.on('error', reject);
            wr.on('finish', resolve);
            rd.pipe(wr);
            console.log('File Copied At:', moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
      })
      .catch(function(error) {
            rd.destroy();
            wr.end();
            throw error;
      });
}