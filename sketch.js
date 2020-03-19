/*----------------------------------------*\
  ESA-B1 - sketch.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2020-03-18 15:00:50
  @Last Modified time: 2020-03-19 00:55:02
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
		this.target = new Vector((Math.random()-0.5) * window.innerHeight*0.5, (Math.random()-0.5) * window.innerHeight*0.5);
	}
	getRealPosition(){
		const p = getPos(this.element);
		return new Vector(this.position.x + p.x, this.position.y + p.y);
	}
	cloud(count, k, cursor){
		const ratio = k  / count;
		const alpha =  (Math.PI * 2 * ratio) + (Math.PI*0.5);
		this.position = new Vector(this.target.x, this.target.y);
		this.position.mult(cursor);
		this.element.style.transform = 	"translate("+this.position.x+"px, "+this.position.y+"px)"+
										"rotateZ("+((alpha+Math.PI*0.5) * cursor )+"rad)";;
	}
	circle(count, k, cursor){
		const ratio = k  / count;
		const alpha =  (Math.PI * 2 * ratio) - (Math.PI*0.5);
		const r = 100 ;
		const c = (new Vector(window.innerWidth, window.innerHeight)).mult(0.5);
		this.position = new Vector(c.x + r * Math.cos(alpha), c.y + r * Math.sin(alpha));
		const p = getPos(this.element);
		this.position.sub(new Vector(p.x, p.y));
		this.position.mult(cursor);
		this.element.style.transform = 	"translate("+this.position.x+"px, "+this.position.y+"px) "+
										"rotateZ("+((alpha+Math.PI*0.5) * cursor )+"rad)";
	}
}

document.querySelectorAll(".text").forEach(function(parent){
	const content = parent.querySelector("p");
	parent.removeChild(content);
	const letters = content.innerText.split("").map(function(abc){
		return new Letter(abc)
	});
	letters.map(function(self, k){
		parent.append(self.element);
		self.element.classList.add("letter");
	});

	function update(){
		const cursor = 2 * document.documentElement.scrollTop/document.body.offsetHeight;
		letters.map(function(self, k){
			//self.confinement()
			self.circle(letters.length, k, cursor);
			//self.cloud(letters.length, k, cursor);
			
		});
	}
	window.addEventListener("resize", update, false)
	document.addEventListener("scroll", update, false)
});
