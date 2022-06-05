const canvas = document.querySelector("#canvas");
let NewCanvas = document.createElement('canvas');
let mychart = document.getElementById('myChart').getContext('2d');
let clearBoard = document.getElementById('clear');

NewCanvas.width = 28;
NewCanvas.height = 28;

clearBoard.addEventListener('click',() => {
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx1 = NewCanvas.getContext('2d');
    ctx.clearRect(0, 0, NewCanvas.width, NewCanvas.height);
    //mychart.destroy()
    window.location.reload();
})


//Model
let model = tf.sequential();


const configHidden = {
    units: 784,
    inputShape: 784,
    activation: 'sigmoid',
};
const configOutput = {
    units: 10,
    activation: 'sigmoid',

};
let current = 0;
const hidden = tf.layers.dense(configHidden);
const output = tf.layers.dense(configOutput);
model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'VarianceScaling'
}));
model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2]
}));
model.add(tf.layers.conv2d({
    kernelSize: 3,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'VarianceScaling'
}));
model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2]
}));

model.add(tf.layers.flatten());

model.add(tf.layers.dense({
    units: 10,
    kernelInitializer: 'VarianceScaling',
    activation: 'softmax'
}));
const sgdOptimizer = tf.train.sgd(0.1);
const config = {
    optimizer: sgdOptimizer,
    loss: tf.losses.meanSquaredError
};
//End Model Here 

//Model selection

(async function() {
    model = await tf.loadModel("./model/model.json");
    model.compile(config);
    $('.progress-bar').hide();
})()



//Download the_canvs_Image_Test
/*function downloadImage(data, filename = 'untitled.png') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}*/

async function getDataBytesView(imageData){
    let array = [];
    for(let j = 0; j < imageData.data.length / 4; j++){
        array[j] = imageData.data[j * 4] / 255;
    }
    return array;
}


$("#predictBtn").click(async function (){
    //console.log("hello canvas")
    if(canvas.getContext){
        //var image = canvas.toDataURL("image/png");
        let image = new Image();

        image.id = "imageToPredict";
        image.width = 28;
        image.height = 28;
        image.src = canvas.toDataURL();

        image.onload = function(){
            const ctx = NewCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0, 28, 28);
            let imageData = ctx.getImageData(0, 0, NewCanvas.width, NewCanvas.height);
            getDataBytesView(imageData).then((dataBytesView)=>{
                //console.log(dataBytesView)
                prediction(dataBytesView);
            });
        }

        
        
        //console.log(imageData);

        //let imageData = new ImageData();
        //console.log(image)
        //downloadImage(image, 'd.png')

        async function prediction(dataBytesView){
            let input = tf.tensor2d([dataBytesView]);
            let highestScore =[0, 0];

            let pred = await model.predict(input.reshape([1, 28, 28, 1]));
            console.log(pred.toString().slice(13,150).split(',]')[0])
            let predData = JSON.parse(pred.toString().slice(13,150).split(',]')[0]);
            //console.log(predData);
            for(let i = 0; i < 10; i++){

                if(predData[i] > highestScore[0])highestScore = [predData[i], i];
            }
            displayPrediction(highestScore, predData);
            //console.log(highestScore);
        }

        async function displayPrediction(ResultData, predData){
            document.getElementById('pred').innerText = `Top Guess: ${ResultData[1]}`;// Percentage: ${(ResultData[0] * 100).toFixed(2)}%;

            //bar chart showing guess percentage
            barChart(predData)
            //console.log(predData);
        }
        async function barChart(predData) {

            Chart.defaults.font.size = 25;
            Chart.defaults.font.color = '#fff';

            let POPChart = new Chart(mychart, {
                type : 'bar',
                
                data : {
                    labels : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
                    datasets : [{
                        label : 'Percentage',
                        data : [predData[0], predData[1], predData[2],
                        predData[3], predData[4],predData[5],
                        predData[6], predData[7], predData[8],
                        predData[9]],
                        
                        backgroundColor : ['#003f5c', '#2f4b7c',
                            '#665191','#a051950','#d45087','#f95d6a','#ff7c43',
                            '#C0C0C0','##a051950','#2f4b7c'
                            ],
                        borderWidth : 1,
                        borderColor : '#777',
                        hoverBorderWidth: 3,
                        hoverorderColor :  '#000',
                        }]
                    },
                    options : {
                        title : {
                            display : true,
                            text : 'Digit prediction percentage Levels'
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        // This more specific font property overrides the global property
                                        font: {
                                            size: 20,
                                            color: 'orange'
                                        }
                                    }
                                }
                            },
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero:true,
                                        fontColor: 'white'
                                    },
                                }],
                              xAxes: [{
                                    ticks: {
                                        fontColor: 'White'
                                    },
                                }]
                            } 
                        }
                    }
            );
        }
    }
})

