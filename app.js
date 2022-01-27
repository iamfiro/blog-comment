const fs = require('fs');
const express = require('express')
const app = express()
const ejs = require('ejs')
const hljs = require("./highlight.js");
const port = process.env.PORT;
 
app.listen('3000',function(){
    console.log("start express server on port 3000")
})

app.set('view engine', 'ejs');
app.set(express.static(__dirname + '/'));


const md = require("markdown-it")({
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: "language-",
    linkify: true,
    typographer: true,
    quotes: "“”‘’",
    highlight: function(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre class="hljs"><code>' +
            hljs.highlight(lang, str, true).value +
            "</code></pre>"
          );
        } catch (__) {}
      }
  
      return (
        '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
      );
    }
  });


app.get('/',function (req,res) {
        fs.readdir('./data/json', (err, filelist) => {
            var html = ""
            for (i = filelist.length -1; -1 < i; i--) {
                var obj = JSON.parse(fs.readFileSync('./data/json/' + filelist[i], "utf8"))
                html = html + `        <div class="listView">
                <a href="/post/` + i + `">
                <img class="mainImg" src="`+ obj.img +`"></a>
                <a style="color: white" href="/post/` + i + `">
                <p class="listText">`+ obj.title +`</p></a>
                <p class="listDes">`+ obj.desc +`</p>
                <p class="listtime">`+ obj.time +`</p></div>`
            }

            res.render('main.ejs', {'html' : `${html}`})
        })
    })



app.get(`/post/:id`,function (req,res) {
    var obj = JSON.parse(fs.readFileSync('./data/json/' + req.params.id + '.json', "utf8"))
    var mdobj = fs.readFileSync('./data/md/' + req.params.id + '.md','utf8')
    const convertedBody = md.render(mdobj);
        res.render('index.ejs', {'title' : `${obj.title}`,"desc": `${obj.desc}` ,"time" :`${obj.time}`,"mainImg":`${obj.img}`,"post":`${convertedBody}`})
})

