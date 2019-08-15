/*
**  CRYPTO library Made By Mina R.F.A. ESkANDAR
**  
**  This Library Can Do the following:
**                          Encrypt in 7 , if you count reverse, CYPHERS as well as decryping
**                          Hash in two hashes including SHA1
**                          BruteForce Any Cypher
**                          Caeser Cracker , more cracks are coming so soon 
**                          
**
**
*/




//CYPHERS
	function reverse(value){
    if(value.length ==1){
        return value
    }else{
        return value[value.length-1] + reverse(value.slice(0,value.length-1))
    }
}

	function caeser(msg,key,isEncrypt=true){
	var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var translate = ''
	msg = msg.toUpperCase();
		k = key;
		for (i=0;i<msg.length;i++) {
			sym = msg[i]
			if (letters.indexOf(sym) != -1) {
				var num = letters.indexOf(sym);
				if (isEncrypt) {
					num +=k;
					while (num > 25 || num < 0) {num = num<0?num+26:num-26;}
				} else{
					num -=k;
					while (num > 25 || num < 0) {num = num<0?num+26:num-26;}
				}
				translate += letters[num];
			}else{
				translate += sym;
			}
		}
		return translate;

	}

    function monoAlphabetic(msg,keyPhrase,isEncrypt=true){
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let filtered = ''
        msg = msg.toUpperCase()
        keyPhrase =keyPhrase.toUpperCase()
        for (var i = 0; i < letters.length; i++) {
            if (keyPhrase.indexOf(letters[i]) == -1) {
                 filtered += letters[i]
            }
        }
        let cypherLetter = keyPhrase.toUpperCase() + filtered
        translate = ''
        for (var i = 0; i < msg.length; i++) {
            if (isEncrypt) {
                translate += letters.indexOf(msg[i]) != -1?cypherLetter[letters.indexOf(msg[i])]:msg[i]
            }else{
                translate += cypherLetter.indexOf(msg[i]) != -1?letters[cypherLetter.indexOf(msg[i])]:msg[i]
            }
        console.log(cypherLetter)
        }
        return translate
    }

    function atbash(msg,isEncrypt=true) {
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let reverseLetters = reverse(letters)
        translate = ''
        msg = msg.toUpperCase()
        for (var i = 0; i < msg.length; i++) {
            if (isEncrypt) {
                translate += letters.indexOf(msg[i]) != -1?reverseLetters[letters.indexOf(msg[i])]:msg[i]
            }else{
                translate += reverseLetters.indexOf(msg[i]) != -1?letters[reverseLetters.indexOf(msg[i])]:msg[i]
            }
        }
        return translate
    }

    function simpleShiftVigenere(msg,keys,isEncrypt=true) {
        var letter = 0
        translate = ''
        while(letter<msg.length){
        for(let key of keys){
            translate += caeser(msg[letter],key,isEncrypt)
            letter+=1
            //debugger
            if (letter>=msg.length) {break;}
        }
    }
    return translate
}
    function autoKeyVigenere(msg,keys,isEncrypt=true) {
        let letter = 0
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        translate = ''
        msg = msg.replace(/ /g,'')
        for(let key of keys){
            translate += caeser(msg[letter],key,isEncrypt)
            letter+=1
            //+debugger
            if (letter>=msg.length) {break;}
        }
        let c = keys.length
        while(letter<msg.length){
            let spaceInRange = false
                c = keys.length
           
            if (isEncrypt) {
                var key = letters.indexOf(msg[letter - c].toUpperCase())
            }else{
                var key = letters.indexOf(translate[letter - c].toUpperCase())

            }
            // debugger
            translate += caeser(msg[letter],key,isEncrypt)
            letter++

            }

            for (var i = 0; i < translate.length; i++) {
                if (i%5===0) {translate = insert(translate,' ',i)}
            }
    
    return translate
}


    function affine(msg,akey,pkey=7,isEncrypt=true) {
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let len = letters.length
        msg = msg.toUpperCase()
        let translate = ''
        //console.log('1:'+len+"--"+pkey)

        for (let i = 0; i < msg.length; i++) {

           // let P = 
        if (isEncrypt) {
           // console.log('2:'+(extEucAlgorithm(len,pkey).y +len))
            let C = (letters.indexOf(msg[i])*pkey+akey)%len
            translate+=letters.indexOf(msg[i]) != -1?letters[C]:msg[i]
        }else{
           // console.log('3:'+(extEucAlgorithm(len,pkey).y +len))
            let P = ((extEucAlgorithm(len,pkey).y +len)*(letters.indexOf(msg[i])-akey))%len
            while(P<0){P+=26}
            translate+=letters.indexOf(msg[i]) != -1?letters[P]:msg[i]

        }
        }
        return translate

    }


	function transposition(msg, key, isEncrypt=true) {
		//number of cols = key
		if (isEncrypt && !(key<=0 || key>msg.length)) {
			var cypher = [];
			for (var i = 0; i <= key-1; i++) {cypher.push('')}

			for (var col = 0; col <= key-1; col++) {
				var pointer = col;
				while(pointer < msg.length){
					cypher[col] += msg[pointer];
					pointer+=key;
				}
			}
			return cypher.join('')

		}else if (!(key<=0 || key>msg.length)){
			cols = Math.ceil(msg.length/key);
			rows = key;
			voidBoxes = (cols * rows)-msg.length;
			plainText = []
			for (var i = 0; i <= cols-1; i++) {plainText.push('')}
			var col =0,
				row =0;
			for (var i = 0; i <= msg.length-1; i++) {
				symp = msg[i]
				plainText[col]+= symp;
				col++;
				if (col == cols || (col == cols-1 && row >= rows - voidBoxes)) {
					col = 0;
					row++;
				}
			}
			return plainText.join('')
		}else{
			return('ERR:Type more than 1 letter & make the key in this limit [1:length of message]')
		}

	}

	String.prototype.hashCode = function() {
		var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
	};


	
function SHA1 (msg) {

 


    function rotate_left(n,s) {


        var t4 = ( n<<s ) | (n>>>(32-s));


        return t4;


    };

 


    function lsb_hex(val) {


        var str="";


        var i;


        var vh;


        var vl;

 


        for( i=0; i<=6; i+=2 ) {


            vh = (val>>>(i*4+4))&0x0f;


            vl = (val>>>(i*4))&0x0f;


            str += vh.toString(16) + vl.toString(16);


        }


        return str;


    };

 


    function cvt_hex(val) {


        var str="";


        var i;


        var v;

 


        for( i=7; i>=0; i-- ) {


            v = (val>>>(i*4))&0x0f;


            str += v.toString(16);


        }


        return str;


    };

 

 


    function Utf8Encode(string) {


        string = string.replace(/\r\n/g,"\n");


        var utftext = "";

 


        for (var n = 0; n < string.length; n++) {

 


            var c = string.charCodeAt(n);

 


            if (c < 128) {


                utftext += String.fromCharCode(c);


            }


            else if((c > 127) && (c < 2048)) {


                utftext += String.fromCharCode((c >> 6) | 192);


                utftext += String.fromCharCode((c & 63) | 128);


            }


            else {


                utftext += String.fromCharCode((c >> 12) | 224);


                utftext += String.fromCharCode(((c >> 6) & 63) | 128);


                utftext += String.fromCharCode((c & 63) | 128);


            }

 


        }

 


        return utftext;


    };

 


    var blockstart;


    var i, j;


    var W = new Array(80);


    var H0 = 0x67452301;


    var H1 = 0xEFCDAB89;


    var H2 = 0x98BADCFE;


    var H3 = 0x10325476;


    var H4 = 0xC3D2E1F0;


    var A, B, C, D, E;


    var temp;

 


    msg = Utf8Encode(msg);

 


    var msg_len = msg.length;

 


    var word_array = new Array();


    for( i=0; i<msg_len-3; i+=4 ) {


        j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |


        msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);


        word_array.push( j );


    }

 


    switch( msg_len % 4 ) {


        case 0:


            i = 0x080000000;


        break;


        case 1:


            i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;


        break;

 


        case 2:


            i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;


        break;

 


        case 3:


            i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8    | 0x80;


        break;


    }

 


    word_array.push( i );

 


    while( (word_array.length % 16) != 14 ) word_array.push( 0 );

 


    word_array.push( msg_len>>>29 );


    word_array.push( (msg_len<<3)&0x0ffffffff );

 

 


    for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {

 


        for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];


        for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);

 


        A = H0;


        B = H1;


        C = H2;


        D = H3;


        E = H4;

 


        for( i= 0; i<=19; i++ ) {


            temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;


            E = D;


            D = C;


            C = rotate_left(B,30);


            B = A;


            A = temp;


        }

 


        for( i=20; i<=39; i++ ) {
            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }
        for( i=40; i<=59; i++ ) {
            temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }
        for( i=60; i<=79; i++ ) {
            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B,30);
            B = A;
            A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    return temp.toLowerCase();
}

//CRACKING METHODS

    function bruteForce(method,target,testSmall=true,testCapital=false,testSpecialCharacters=false,testNum = false,len=1) {
        console.log('#Intialising Try #'+len)
        let wordLen = len
        let charMap = ''
        if (testSmall) {charMap += 'abcdefghijklmnopqrstuvwxyz'}
        if (testCapital) {charMap+='ABCDEFGHIJKLMNOPQRSTUVWXYZ'}
        if (testSpecialCharacters) {charMap+='`~!@#$%^&*()_+-={}[]:";\',./<>?'}
        if (testNum) {charMap+='0123456789'}          
            var result = ''
            var combos = getCombination(wordLen,'',charMap).join(',').split(',')

            for (var r = 0; r < combos.length; r++) {
                    result = combos[r]
                
                //console.log(`trying '${result}'... => ${method(result)} ? ${target}`)
                if (method(result) == target) {
                console.log(`Match Found! ${result} => ${method(result)} === ${target}...`)
                 return result
                }
                if ((result).length==0) {
                    //console.log(`BROKEN`)
                    return 0
                }
            }
            bruteForce(method,target,testSmall,testCapital,testSpecialCharacters,testNum,wordLen+1)
            //}
    }

    function caeserCracker(target,key = 1,baseArr=[]){
        possibles = baseArr
        result = caeser(target,key)
        if (key <= 26) {
            possibles.push(result)
            caeserCracker(target,key+1,possibles)
        }
        else{
            console.log(possibles)
        }
            return possibles
    }
//}


//some Math May be needed
Math.factorial = function (num) {
    if (num < 0) 
        return -1;
  else if (num == 0) 
      return 1;
  else {
      return (num * Math.factorial(num - 1));
  }
}

Math.comination = function (n,k) {
   return (Math.factorial(n))/(Math.factorial(k)*Math.factorial(n-k))
}
function getCombination(depth, baseString, arrLetters) {
    var returnValue = [];
    for (var i = 0; i < arrLetters.length; i++) {
        returnValue .push(depth == 1 ?baseString + arrLetters[i] : getCombination(depth - 1, baseString + arrLetters[i], arrLetters));
    }
        return returnValue;
}

function extEucAlgorithm(x,y){
    let A = [x,y]
    let Q = []
    let X = []
    var num = 0
    while(A[A.length-1]!=0)
    {
        A.push(A[num]%A[num+1])
        num++
    }
    num = 0

    while(A[num]/A[num+1]!=1/0)
    {
        Q[num+1] = Math.floor(A[num]/A[num+1])
        num++
    }
    X[num] = 0
    X[num-1] = 1
    num -=2
    while(!X[0]){
        X[num] = Q[num+1]*X[num+1]+X[num +2]
        num--
    }


    return {x:X[1],y:-1*X[0]}

}

function insert(mainStr,insertStr='',pos = 0){
    //debugger
    return mainStr.slice(0,pos) + insertStr + mainStr.slice(pos)
}