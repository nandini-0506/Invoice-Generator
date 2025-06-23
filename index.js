const express = require('express');
const app = express();
const path = require('path');
const data = require("./sample-invoice.json");
const puppeteer = require('puppeteer');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render("page");
});
app.get('/invoice',(req,res)=>{
    res.render("index",{data:data});
});

app.get('/generate-pdf', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/invoice', {
        waitUntil: 'networkidle0'
    });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdfBuffer);
});

app.listen(3000, () => {
    console.log("Server has started ");
});
