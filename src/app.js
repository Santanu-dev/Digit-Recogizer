window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas");
    const context = canvas.getContext("2d");
    
    canvas.height = 300;
    canvas.width = 300;

    let draw = false;

    function startdrawing(e) {
        draw = true;
        drawing(e);
    }

    function enddrawing() {
        draw = false;
        context.beginPath();
    }

    function drawing(e) {
        if(!draw){ return; } 

        let rect = canvas.getBoundingClientRect();

        let source = e.touches ? e.touches[0] : e;

        let x = source.clientX - rect.left;
        let y = source.clientY - rect.top;

        context.lineWidth = 10;
        context.lineCap = "round";
        context.lineTo(x, y);
        context.strokeStyle = 'white';
        context.stroke();
        //to prevent connection of lines
        context.beginPath();
        context.moveTo(x, y);
    }

    canvas.addEventListener("mousedown", startdrawing);
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("mouseup", enddrawing);

})

/*window.addEventListener("resize", () => {
    resize();
})*/

/*const resize = () => {
    canvas.height = window.innerHeight / 1.5;
    canvas.width = window.innerWidth / 1.7;
}*/