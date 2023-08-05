const express = require("express");
const { engine } = require("express-handlebars");
const fileUpload = require("express-fileupload");
const app = express();
const mysql = require("mysql2");

const PORT = 8000;

app.use(fileUpload());
app.use(express.static('upload'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// connection pool プール作成（常にデータベースに接続しておく状態にすること）
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "127.0.0.1",
    user: "root",
    database: "nodejs_image_upload",
});

// エンドポイント作成
app.get("/", (req, res) => {
    res.render("home");

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("MYSQLと接続中・・・・🌳");
        // データ取得
        connection.query("SELECT * FROM image", (err, rows) => {
            // 接続を閉じる
            if (err) throw err;
            connection.release();

            console.log(rows);
        });
    });
});

// Postのためのエンドポイント作成
app.post("/", (req, res) => {
    if (!req.files) {
        return res.status(400).send("何も画像がアップロードされていません");
    };

    // console.log(req.files);

    // 保存先のパスを指定
    let imageFile = req.files.imageFile;
    let uploadPath = __dirname + '/upload/' + imageFile.name;

    // サーバーに画像ファイルを置く場所を指定
    imageFile.mv(uploadPath, function(err) {
        if (err) return res.status(500).send(err);
        res.send("画像アップロードに成功しました！");
    });
});

app.listen(PORT, () => { console.log("サーバー起動中🚀"); });