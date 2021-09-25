const fontUrl = 'https://parkminwoo.com/font/Hesiod-Regular.otf'
const svg = document.getElementById('bG');
let ctm = svg.getScreenCTM()
let inverse = ctm.inverse()
const info = document.getElementById('info');
const lKernVal = document.getElementById('lKernVal');
const glName = document.getElementById('glName');
const unicode = document.getElementById('unicode');
const lSideB = document.getElementById('lSideB');
const rSideB = document.getElementById('rSideB');
const rKernVal = document.getElementById('rKernVal');
const lKernGroup = document.getElementById('lKernGroup');
const advW = document.getElementById('advW');
const rKernGroup = document.getElementById('rKernVal');
const preview = document.getElementById('preview');
const prevContP = document.querySelectorAll('.previewContent')[0];
const prevContE = document.querySelectorAll('.previewContent')[1];
let font, ascender, descender, pointerPos, pointerXY, pointerHeight, fontSize;
let [viewBoxX, viewBoxY, viewBoxW, viewBoxH] = svg.getAttribute('viewBox').split(' ').map(e=>{return e*1})
let clickedTarget;
let pointerIdx = 0;
let previewResize = false;
let typing = true;
let glyphList = [];
let boundingList = [];
let tempPreviewBoxY;
let winW = window.innerWidth;
let winH = window.innerHeight;
prevContP.style.fontSize = `${(preview.offsetHeight- 30) * 0.8}px` 
prevContE.style.fontSize = `${(preview.offsetHeight- 30) * 0.8}px` 

class Glyph{
    constructor(key, xpos, ypos){
        this.key = key;
        this.x = xpos;
        this.y = ypos;
        this.h = fontSize;
        this.parse = font.stringToGlyphs(this.key)[0]
    }
    t = document.createElementNS("http://www.w3.org/2000/svg", "text");

    boundingbox = {
        al: document.createElementNS("http://www.w3.org/2000/svg", "polyline"),
        ar: document.createElementNS("http://www.w3.org/2000/svg", "polyline"),
        bl: document.createElementNS("http://www.w3.org/2000/svg", "polyline"),
        br: document.createElementNS("http://www.w3.org/2000/svg", "polyline"),
        dl: document.createElementNS("http://www.w3.org/2000/svg", "polyline"),
        dr: document.createElementNS("http://www.w3.org/2000/svg", "polyline")
    }
 
    appendText(){
        this.t.textContent = this.key;
        setAttributes(this.t, {
            x: this.x,
            y: this.y + ascender,

        })
        console.log(this.t)
        textG.childNodes[pointerIdx-1] === undefined ? (console.log(0),textG.insertBefore(this.t, null)) :  (textG.insertBefore(this.t, textG.childNodes[pointerIdx-1]), console.log(1)) 
    }
    drawBoundingBox(){
        setAttributes(this.boundingbox.al,{
            points: `${this.x + pointerXY * 0.6},${this.y} ${this.x},${this.y} ${this.x},${this.y + pointerXY * 0.6} `
        });
        setAttributes(this.boundingbox.ar,{
            points: `${this.x + this.parse.advanceWidth - pointerXY * 0.6},${this.y} ${this.x + this.parse.advanceWidth},${this.y} ${this.x + this.parse.advanceWidth},${this.y + pointerXY * 0.6}`
        });
        setAttributes(this.boundingbox.bl,{
            points: `${this.x},${this.y + ascender - pointerXY * 0.6}  ${this.x},${this.y + ascender} ${this.x + pointerXY * 0.6},${this.y + ascender} ${this.x},${this.y + ascender} ${this.x},${this.y + ascender + pointerXY * 0.6} `
        });
        setAttributes(this.boundingbox.br,{
            points: `${this.x + this.parse.advanceWidth},${this.y + ascender - pointerXY * 0.6} ${this.x + this.parse.advanceWidth},${this.y + ascender} ${this.x + this.parse.advanceWidth - pointerXY * 0.6},${this.y + ascender} ${this.x + this.parse.advanceWidth},${this.y + ascender} ${this.x + this.parse.advanceWidth},${this.y + ascender + pointerXY * 0.6}`
        });
        setAttributes(this.boundingbox.dl,{
            points: `${this.x},${this.y + ascender -  descender - pointerXY * 0.6}  ${this.x},${this.y + ascender -  descender} ${this.x + pointerXY * 0.6},${this.y + ascender -  descender} ${this.x},${this.y + ascender -  descender} ${this.x},${this.y + ascender -  descender + pointerXY * 0.6} `
        });
        setAttributes(this.boundingbox.dr,{
            points: `${this.x + this.parse.advanceWidth},${this.y + ascender -  descender - pointerXY * 0.6} ${this.x + this.parse.advanceWidth},${this.y + ascender -  descender} ${this.x + this.parse.advanceWidth - pointerXY * 0.6},${this.y + ascender -  descender} ${this.x + this.parse.advanceWidth},${this.y + ascender -  descender} ${this.x + this.parse.advanceWidth},${this.y + ascender -  descender + pointerXY * 0.6}`
        })
        let temp = document.createElementNS("http://www.w3.org/2000/svg", "g");
        temp.append(this.boundingbox.al, this.boundingbox.ar, this.boundingbox.bl, this.boundingbox.br, this.boundingbox.dl, this.boundingbox.dr)
        boundingG.childNodes[pointerIdx-1] === undefined ? (console.log(0),boundingG.insertBefore(temp, null)) :  (boundingG.insertBefore(temp, boundingG.childNodes[pointerIdx-1]), console.log(1)) 

    }
    movePos(){
        setAttributes(this.t, {
            x: this.x,
            y: this.y + ascender
        })
        setAttributes(this.boundingbox.al,{
            points: `${this.x + pointerXY * 0.6},${this.y} ${this.x},${this.y} ${this.x},${this.y + pointerXY * 0.6} `
        });
        setAttributes(this.boundingbox.ar,{
            points: `${this.x + this.parse.advanceWidth - pointerXY * 0.6},${this.y} ${this.x + this.parse.advanceWidth},${this.y} ${this.x + this.parse.advanceWidth},${this.y + pointerXY * 0.6}`
        });
        setAttributes(this.boundingbox.bl,{
            points: `${this.x},${this.y + ascender - pointerXY * 0.6}  ${this.x},${this.y + ascender} ${this.x + pointerXY * 0.6},${this.y + ascender} ${this.x},${this.y + ascender} ${this.x},${this.y + ascender + pointerXY * 0.6} `
        });
        setAttributes(this.boundingbox.br,{
            points: `${this.x + this.parse.advanceWidth},${this.y + ascender - pointerXY * 0.6} ${this.x + this.parse.advanceWidth},${this.y + ascender} ${this.x + this.parse.advanceWidth - pointerXY * 0.6},${this.y + ascender} ${this.x + this.parse.advanceWidth},${this.y + ascender} ${this.x + this.parse.advanceWidth},${this.y + ascender + pointerXY * 0.6}`
        });
        setAttributes(this.boundingbox.dl,{
            points: `${this.x},${this.y + ascender -  descender - pointerXY * 0.6}  ${this.x},${this.y + ascender -  descender} ${this.x + pointerXY * 0.6},${this.y + ascender -  descender} ${this.x},${this.y + ascender -  descender} ${this.x},${this.y + ascender -  descender + pointerXY * 0.6} `
        });
        setAttributes(this.boundingbox.dr,{
            points: `${this.x + this.parse.advanceWidth},${this.y + ascender -  descender - pointerXY * 0.6} ${this.x + this.parse.advanceWidth},${this.y + ascender -  descender} ${this.x + this.parse.advanceWidth - pointerXY * 0.6},${this.y + ascender -  descender} ${this.x + this.parse.advanceWidth},${this.y + ascender -  descender} ${this.x + this.parse.advanceWidth},${this.y + ascender -  descender + pointerXY * 0.6}`
        })

    }
}
class Path{
    constructor(){

    }
}
class guide{
    constructor(){

    }
}
class point{
    constructor(){

    }
}


//////////////////////////
////////// Util //////////
//////////////////////////

function $(e){
    return document.querySelectorAll(e)[0]
}
function setAttributes(el, attrs) {
    for(const key in attrs) {
    el.setAttribute(key, attrs[key]);
    }
}



///////////////////////////
///////// pointer /////////
///////////////////////////

const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
const pointerG = document.createElementNS("http://www.w3.org/2000/svg", "g"); 
const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
const trU = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
const trB = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
pointerG.setAttribute('id','pointer')
pointerG.append(trU, trB, vLine)
defs.append(pointerG)
const pointerUse = document.createElementNS("http://www.w3.org/2000/svg", "use"); 
svg.append(defs, pointerUse)





//////////////////////////
///////// groups /////////
//////////////////////////

const textG = document.createElementNS("http://www.w3.org/2000/svg", "g"); 
svg.append(textG)


const boundingG = document.createElementNS("http://www.w3.org/2000/svg", "g"); 
svg.append(boundingG)

////////////////////////
///////// init /////////
////////////////////////

async function init(){
    font = await opentype.load(fontUrl);
    ascender = font.tables.os2.sTypoAscender;
    descender = font.tables.os2.sTypoDescender;;

    pointerPos = [1500,800];
    pointerXY = 20;
    pointerHeight = ascender - descender;
    fontSize = 1000;

    setAttributes(vLine, {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: pointerHeight,
        stroke: 'black',
        'stroke-width': 0.7
    })
    setAttributes(trU, {
        points: `-${pointerXY},0 0,${pointerXY} ${pointerXY},0`,
        fill: `rgb(185, 214, 251)`
    })
    setAttributes(trB, {
        points: `-${pointerXY},${pointerHeight} 0,${pointerHeight - pointerXY} ${pointerXY},${pointerHeight}`,
        fill: `rgb(185, 214, 251)`

    })
    setAttributes(pointerUse,{
        x: `${pointerPos[0]}`,
        y:`${pointerPos[1]}`,
        href: '#pointer'
    })
    setAttributes(textG, {
        fill: 'black',
        id: 'textInput',
        'font-size' : fontSize,
        'font-family': 'Hesiod'
    })
    setAttributes(boundingG, {
        fill: 'none',
        id: 'boundingBox',
        stroke: 'black',
        'stroke-width': 0.8
    })
}
init()



//////////////////////////
/////event listeners /////
//////////////////////////
svg.addEventListener('click', ()=>{
    typing = true;
})
addEventListener('mousedown',e=>{
    console.log(e.target)
    if(e.target !== svg){
        typing = false;
        console.log(typing)
    }
    clickedTarget = svg.createSVGPoint();
    [clickedTarget.x, clickedTarget.y] = [e.clientX, e.clientY]
    clickedTarget = clickedTarget.matrixTransform(inverse)
    if( Math.abs(e.clientY - preview.offsetTop)<5){
        previewResize = true;
        tempPreviewBoxY = clickedTarget.y;
        console.log(tempPreviewBoxY)
    } 

})
addEventListener('mousemove',e=>{
    clickedTarget ? [clickedTarget.x, clickedTarget.y] = [e.clientX, e.clientY] : clickedTarget
    clickedTarget ? clickedTarget = clickedTarget.matrixTransform(inverse) : clickedTarget

    if(previewResize){
        preview.style.height = `${window.innerHeight - e.clientY}px` 
        prevContP.style.fontSize = `${(window.innerHeight - e.clientY - 30) * 0.9}px` 
        prevContE.style.fontSize = `${(window.innerHeight - e.clientY - 30) * 0.9}px` 
        info.style.bottom = `${window.innerHeight - e.clientY + 10}px` 
        viewBoxY = tempPreviewBoxY - clickedTarget.y
        svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`)
    } 

})
addEventListener('mouseup', ()=>{
    previewResize = false;
})
addEventListener('keypress', e=>{
    if (typing) {
        pointerIdx++;
        let G = new Glyph(e.key, pointerPos[0], pointerPos[1], pointerHeight)
        glyphList.splice(pointerIdx-1, 0, G)
        console.log(G.parse)
        if(pointerIdx != glyphList.lenth){
            glyphList.slice(pointerIdx).forEach(v=>{
                v.x += G.parse.advanceWidth
                v.movePos()
            })
        }
        G.appendText()
        G.drawBoundingBox()
        pointerPos[0] += G.parse.advanceWidth;
        pointerUse.setAttribute('x', pointerPos[0])
        viewBoxX += G.parse.advanceWidth;
        svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`);
        console.log(pointerIdx, glyphList)


        var p = svg.createSVGPoint()
        p.x = pointerPos[0]
        p.y = pointerPos[0]
        p = p.matrixTransform(svg.getScreenCTM());
        console.log(p.x)
        $('#info').style.left = `${p.x - 57}px`


        prevContP.textContent = prevContP.textContent.concat(e.key)
        /*glyphList.reduce((acc,curr)=>{
            console.log(acc,curr)
            let prev = acc.key ? acc.key : acc;
            console.log(prev)
            return prev.concat(curr.key)
        },'')*/

    }
})

addEventListener('keydown', e=>{
    if (typing){

        if (e.key === 'ArrowUp'){
            console.log(e.key, pointerIdx)
        }else if (e.key === 'ArrowDown'){
            console.log(e.key, pointerIdx)
        }else if (e.key === 'ArrowLeft'){
            console.log(e.key, pointerIdx)
            if(pointerIdx){
                pointerPos[0] -= glyphList[pointerIdx-1].parse.advanceWidth
                pointerUse.setAttribute('x', pointerPos[0])
        
        
                var p = svg.createSVGPoint()
                p.x = pointerPos[0]
                p.y = pointerPos[0]
                p = p.matrixTransform(svg.getScreenCTM());
                if(p.x >=100){
                    $('#info').style.left = `${p.x - 57}px`
                }else{
                    viewBoxX -= glyphList[pointerIdx-1].parse.advanceWidth
                    svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`);
                }
    
                prevContE.textContent = prevContP.textContent.slice(-1).concat(prevContE.textContent)
                prevContP.textContent = prevContP.textContent.slice(0, -1)
    
                pointerIdx--;    
            }
            if(!pointerIdx){
                $('.prevGl').classList.add('hidden')
            }else{
                $('.prevGl').classList.remove('hidden')
            }
        }else if (e.key === 'ArrowRight'){
            console.log(e.key, pointerIdx)
            if( pointerIdx !== glyphList.length){
                if (pointerIdx+1 === glyphList.length) info.classList.add('hidden')
                $('.prevGl').classList.remove('hidden')
    
                pointerPos[0] += glyphList[pointerIdx].parse.advanceWidth
                pointerUse.setAttribute('x', pointerPos[0])
                pointerIdx++;
        
        
                var p = svg.createSVGPoint()
                p.x = pointerPos[0]
                p.y = pointerPos[0]
                p = p.matrixTransform(svg.getScreenCTM());
    
                if(winW - p.x >= 453){
                    $('#info').style.left = `${p.x - 57}px`
                }else{
                    viewBoxX += glyphList[pointerIdx-1].parse.advanceWidth
                    svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`);
                }
                
                prevContP.textContent = prevContP.textContent.concat(prevContE.textContent.charAt(0))
                prevContE.textContent = prevContE.textContent.slice(1, prevContE.textContent.length)
    
            }
        }else if (e.key === 'Backspace'){
            console.log(e.key, pointerIdx)
            let pop = glyphList.splice(pointerIdx-1, 1)[0]
            console.log(pop)
            pointerPos[0] -= pop.parse.advanceWidth
            pointerUse.setAttribute('x', pointerPos[0])
            viewBoxX -= pop.parse.advanceWidth;
            svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxW} ${viewBoxH}`);
            if( pointerIdx !== $('#textInput').childNodes.length){
                console.log('d')
                glyphList.slice(pointerIdx-1).forEach(v=>{
                    v.x -= pop.parse.advanceWidth;
                    console.log(v.x)
                    v.movePos()
                })
            }
            $('#textInput').removeChild($('#textInput').childNodes[pointerIdx-1])
            $('#boundingBox').removeChild($('#boundingBox').childNodes[pointerIdx-1])
            pointerIdx --;
    
    
            prevContP.textContent = prevContP.textContent.slice(0, -1)
        }

        if( pointerIdx !== glyphList.length) {
            info.classList.remove('hidden')
            glName.value = glyphList[pointerIdx].parse.name
            unicode.textContent = glyphList[pointerIdx].parse.unicode.toString(16).padStart(4,'0')
            lKernVal.value = glyphList[pointerIdx].parse.getMetrics()
            lSideB.value = glyphList[pointerIdx].parse.getMetrics().leftSideBearing
            rSideB.value = glyphList[pointerIdx].parse.getMetrics().rightSideBearing
            rKernVal.value = glyphList[pointerIdx].parse.getMetrics()
            lKernGroup.value = glyphList[pointerIdx].parse.getMetrics()
            advW.value = glyphList[pointerIdx].parse.advanceWidth;
            rKernVal.value = glyphList[pointerIdx].parse.getMetrics()
        }
    }
})