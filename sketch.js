/*----------------------------------------*\
  ESA-B1 - sketch.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2020-03-18 15:00:50
  @Last Modified time: 2020-03-19 13:41:59
\*----------------------------------------*/

function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}


class Vector{
	constructor(x=0, y=0){
		this.x = x;
		this.y = y;
	}
	add(p2){
		this.x += p2.x;
		this.y += p2.y;
		return this;
	}
	sub(p2){
		this.x -= p2.x;
		this.y -= p2.y;
		return this;
	}
	mult(a){
		this.x *= a;
		this.y *= a;
		return this;
	}
}

class Letter{
	constructor(letter){
		this.element = document.createElement("span");
		this.element.innerText = letter;
		this.position = new Vector();
		this.target = new Vector(Math.random()-0.5, Math.random()-0.5);
	}
	getRealPosition(){
		const p = getPos(this.element);
		return new Vector(this.position.x + p.x, this.position.y + p.y);
	}
	cloud(count, k, cursor, r=100){
		const ratio = k  / count;
		const alpha =  (Math.PI * 2 * ratio) + (Math.PI*0.5);
		this.position = new Vector(this.target.x*r, this.target.y*r);
		this.position.mult(cursor);
		this.element.style.transform = 	"translate("+this.position.x+"px, "+this.position.y+"px)"+
										"rotateZ("+((alpha+Math.PI*0.5) * cursor )+"rad)";;
	}
	circle(count, k, cursor, r=100){
		const ratio = k  / count;
		const alpha =  (Math.PI * 2 * ratio) - (Math.PI*0.5);
		
		const c = (new Vector(window.innerWidth, window.innerHeight)).mult(0.5);
		this.position = new Vector(c.x + r * Math.cos(alpha), c.y + r * Math.sin(alpha));
		const p = getPos(this.element);
		this.position.sub(new Vector(p.x, p.y));
		this.position.mult(cursor);
		this.element.style.transform = 	"translate("+this.position.x+"px, "+this.position.y+"px) "+
										"rotateZ("+((alpha+Math.PI*0.5) * cursor )+"rad)";
	}
}

class Fibonnacci{
	constructor(root){
		if(!Array.isArray(root)){
			throw "fibonnacci param has to be an Array";
		}
		if(root.length<1){
			throw "fibonnacci param has to be a non-empty Array";	
		}
		root.map(r=>{
			if(typeof r != "number"){
				throw "fibonnacci param has to be an Array of number";
			}	
		});
		this.r0 = root.length;
		this.array = root;
	}
	next(){
		this.array.push(this.array.slice(-1 * this.r0).reduce((acc, v)=>acc+v, 0));
		return this;
	}
	last(){
		return this.array[this.array.length-1];
	}
}

Object.assign(String.prototype, {
	FibonnacciSlice(root=[1, 1]) {
		const f = new Fibonnacci(root);
		while(f.next().last() < this.length);
		let self = this;
		let splitted = f.array.reverse().map(e=>{
			if (self.length> 0 && e <= self.length){
				self = self.split("");
				let out = self.splice(0, e).join("");
				self = self.join("");
				return out;
			}
		}).reduce((acc, v)=> {
			if(typeof v != "undefined"){
				acc.push(v)
			};
			return acc;
		} , []);
		return splitted;
	}
});

document.querySelectorAll(".text").forEach(function(parent){
	const content = parent.querySelector("p");
	parent.removeChild(content);
	content.innerText.FibonnacciSlice().map((subSentence, c, l) => {
		const letters = subSentence.split("").map(function(abc){
			return new Letter(abc)
		});

		letters.map(function(self, k){
			parent.append(self.element);
			self.element.classList.add("letter");
		});

		function update(){
			const cursor = -1 * (2 * document.documentElement.scrollTop/document.body.offsetHeight - 0.5) * 2;
			letters.map(function(self, k){
				//self.confinement()
				if(cursor>0){
					self.cloud(letters.length, k, Math.abs(cursor), 5 + (l.length-c) * 125);	
				}else {
					self.circle(letters.length, k, Math.abs(cursor), 5 + (l.length-c) * 25);	
					
				}
			});
		}
		window.addEventListener("resize", update, false)
		document.addEventListener("scroll", update, false)
	});
});