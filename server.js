const express = require("express");
const { engine } = require("express-handlebars");
const app = express();

const PORT = 8000;

// エンドポイント作成

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(PORT, () => { console.log("サーバー起動中🚀"); });