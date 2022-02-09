const showdown = require('showdown');
const express = require('express');
const path = require('path');
const fs = require('fs');
const res = require('express/lib/response');
const app = express();
const port = 80;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'sitefiles')));
app.use(express.static(path.join(__dirname, 'general')));
app.use(express.static(path.join(__dirname, 'writeup')));
app.use(express.static(path.join(__dirname, 'writeup/symfonos')));
app.use(express.static(path.join(__dirname, 'writeup/Symfonos')));
app.use(express.static(path.join(__dirname, 'projects')));
app.use(express.static(path.join(__dirname, 'views/pages')));

app.use(
"/css",
express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
)
app.use(
"/js",
express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
)
app.use(
"/js", 
express.static(path.join(__dirname, "node_modules/jquery/dist"))
)

converter = new showdown.Converter({simpleLineBreaks: true});

app.get('/', (req, res) => {
    //send an html file
    //res.sendFile(path.join(__dirname, 'sitefiles/index.html'));
    res.render('pages/index.ejs');
});

app.get('/gen', (req, res) => {
    //send an html file
    //send hello as the response    
    fs.readFile(path.join(__dirname, 'writeup/symfonos/symfonos.md'), 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        //console.log(data);
        html=converter.makeHtml(data);
        console.log(html);
        //send html
        res.send(html);
    });
});

app.get('/general', (req, res) => {
    fs.readFile('manifest.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        //parse the json data into a javascript object
        var manifest = JSON.parse(data);
        //loop through the manifest writeups array and print the results
        
        var generallist = manifest.directory.topics.general;
        res.render('pages/indexg.ejs', {
            generals: generallist
        }); 
    });
});

app.get('/writeup', (req, res) => {
    fs.readFile('manifest.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        //parse the json data into a javascript object
        var manifest = JSON.parse(data);
        //loop through the manifest writeups array and print the results
        
        var writeuplist = manifest.directory.topics.writeups;
        res.render('pages/indexw.ejs', {
            writeups: writeuplist
        }); 
    });
});

app.get('/projects', (req, res) => {
    fs.readFile('manifest.json', 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        //parse the json data into a javascript object
        var manifest = JSON.parse(data);
        //loop through the manifest writeups array and print the results
        
        var projectslist = manifest.directory.topics.projects;
        res.render('pages/indexp.ejs', {
            projects: projectslist
        }); 
    });
});

app.get('/generalgen', (req, res) => {
    //read any query parameters passed in the url and store them in a variable
    //print the length of req.query.t
    if (req.query.t.length != 1) {
        //compare req.query.t to the manifest.json file and verify it exists
        //if it does, send the file
        console.log(req.query.t);
        fs.readFile(path.join(__dirname, 'manifest.json'), 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            //parse the json data into a javascript object
            var manifest = JSON.parse(data);
            //loop through the manifest writeups array and print the results
            //console.log(manifest.directory.topics.writeups);
            //manifest.directory.topics.writeups[key].title == req.query.t
            var writeuptitlelist = [];
            for (key in manifest.directory.topics.general) {
                writeuptitlelist.push(manifest.directory.topics.general[key].title);
            }
            
            if (writeuptitlelist.includes(req.query.t)) {
                var num = writeuptitlelist.indexOf(req.query.t);
                if (fs.existsSync(path.join(__dirname, 'writeup/' + manifest.directory.topics.general[num].pathtodir))) {
                    fs.readFile(path.join(__dirname, 'writeup/' + manifest.directory.topics.general[num].pathtodir), 'utf8', (err, data) => {
                        if (err) {
                            throw err;
                        }
                        //console.log(data);
                        html=converter.makeHtml(data);
                        //send html
                        //print the data type of html
                        //read the markdownsetup.html file and append the string to the beggining of the html
                        fs.readFile(path.join(__dirname, 'sitefiles/markdownsetup.html'), 'utf8', (err, data) => {
                            if (err) {
                                throw err;
                            }
                            //console.log(data);
                            html=data+'<br>'+'<br>'+'<br>'+'<br>'+html;
                            //send html
                            return res.send(html);
                        });
                    });
                } else {
                    return res.send("<h1>Post listed but not found...</h1>")
                }
            } else {
                return res.sendStatus(404);
            }
            
        });
    } else {
        //if the query parameter is not in the manifest.json file, send a 404 error
        return res.sendStatus(400);
    }
});

app.get('/writeupgen', (req, res) => {
    //read any query parameters passed in the url and store them in a variable
    //print the length of req.query.t
    if (req.query.t.length != 1) {
        //compare req.query.t to the manifest.json file and verify it exists
        //if it does, send the file
        console.log(req.query.t);
        fs.readFile(path.join(__dirname, 'manifest.json'), 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            //parse the json data into a javascript object
            var manifest = JSON.parse(data);
            //loop through the manifest writeups array and print the results
            //console.log(manifest.directory.topics.writeups);
            //manifest.directory.topics.writeups[key].title == req.query.t
            var writeuptitlelist = [];
            for (key in manifest.directory.topics.writeups) {
                writeuptitlelist.push(manifest.directory.topics.writeups[key].title);
            }
            
            if (writeuptitlelist.includes(req.query.t)) {
                var num = writeuptitlelist.indexOf(req.query.t);
                if (fs.existsSync(path.join(__dirname, 'writeup/' + manifest.directory.topics.writeups[num].pathtodir))) {
                    fs.readFile(path.join(__dirname, 'writeup/' + manifest.directory.topics.writeups[num].pathtodir), 'utf8', (err, data) => {
                        if (err) {
                            throw err;
                        }
                        //console.log(data);
                        html=converter.makeHtml(data);
                        //send html
                        //print the data type of html
                        //read the markdownsetup.html file and append the string to the beggining of the html
                        fs.readFile(path.join(__dirname, 'sitefiles/markdownsetup.html'), 'utf8', (err, data) => {
                            if (err) {
                                throw err;
                            }
                            //console.log(data);
                            html=data+'<br>'+'<br>'+'<br>'+'<br>'+html;
                            //send html
                            return res.send(html);
                        });
                    });
                } else {
                    return res.send("<h1>Post listed but not found...</h1>")
                }
            } else {
                return res.sendStatus(404);
            }
            
        });
    } else {
        //if the query parameter is not in the manifest.json file, send a 404 error
        return res.sendStatus(400);
    }
});

app.get('/projectgen', (req, res) => {
    //read any query parameters passed in the url and store them in a variable
    //print the length of req.query.t
    if (req.query.t.length != 1) {
        //compare req.query.t to the manifest.json file and verify it exists
        //if it does, send the file
        console.log(req.query.t);
        fs.readFile(path.join(__dirname, 'manifest.json'), 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            //parse the json data into a javascript object
            var manifest = JSON.parse(data);
            //loop through the manifest writeups array and print the results
            //console.log(manifest.directory.topics.writeups);
            //manifest.directory.topics.writeups[key].title == req.query.t
            var writeuptitlelist = [];
            for (key in manifest.directory.topics.projects) {
                writeuptitlelist.push(manifest.directory.topics.projects[key].title);
            }
            
            if (writeuptitlelist.includes(req.query.t)) {
                var num = writeuptitlelist.indexOf(req.query.t);
                if (fs.existsSync(path.join(__dirname, 'writeup/' + manifest.directory.topics.projects[num].pathtodir))) {
                    fs.readFile(path.join(__dirname, 'writeup/' + manifest.directory.topics.projects[num].pathtodir), 'utf8', (err, data) => {
                        if (err) {
                            throw err;
                        }
                        //console.log(data);
                        html=converter.makeHtml(data);
                        //send html
                        //print the data type of html
                        //read the markdownsetup.html file and append the string to the beggining of the html
                        fs.readFile(path.join(__dirname, 'sitefiles/markdownsetup.html'), 'utf8', (err, data) => {
                            if (err) {
                                throw err;
                            }
                            //console.log(data);
                            html=data+'<br>'+'<br>'+'<br>'+'<br>'+html;
                            //send html
                            return res.send(html);
                        });
                    });
                } else {
                    return res.send("<h1>Post listed but not found...</h1>")
                }
            } else {
                return res.sendStatus(404);
            }
            
        });
    } else {
        //if the query parameter is not in the manifest.json file, send a 404 error
        return res.sendStatus(400);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

