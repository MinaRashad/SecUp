var msgs = document.getElementsByClassName('msg')
var msgs_text = []

for (var i = 0; i < msgs.length; i++) {
	msgs_text.push(msgs[i].textContent)
	msgs[i].textContent = ''
}
var counter = 0
var msg_counter=0

start =()=>{
animation = setInterval(()=>{
	if (counter < msgs_text[msg_counter].length && msg_counter  < msgs.length) {
		msgs[msg_counter].innerHTML =msgs[msg_counter].innerHTML+msgs_text[msg_counter][counter]
		counter++
	}
	else if (msgs[msg_counter+1] == undefined) {
		clearInterval(animation)
	}else{
		counter = 0
		msg_counter +=1
	}

},100)
}
setTimeout(start,200)