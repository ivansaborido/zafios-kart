// Copia el juego (un solo archivo) a la carpeta www de la app
const fs=require('fs'),path=require('path');
const www=path.join(__dirname,'..','www');fs.mkdirSync(www,{recursive:true});
fs.copyFileSync(path.join(__dirname,'..','..','Zafios_Kart.html'),path.join(www,'index.html'));
console.log('www/index.html listo');
