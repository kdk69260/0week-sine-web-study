const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");
const bcrypt = require("bcrypt");


const db = new sqlite3.Database("users.db");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: true
}));

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  password TEXT
)
`);

app.get("/", (req, res) => {
  res.send(`<link rel="stylesheet" href="/style.css">
    <h1>홈</h1>
    <a href="/signup">회원가입</a><br>
    <a href="/login">로그인</a>
  `);
});

app.get("/signup", (req, res) => {
  res.send(`<link rel="stylesheet" href="/style.css">
    <h1>회원가입</h1>
    <form method="POST">
      아이디: <input name="username" /><br>
      비밀번호: <input name="password" type="password"/><br>
      <button>가입</button>
    </form>
  `);
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.run("INSERT INTO users (username, password) VALUES (?, ?)", 
    [username, hashed], 
    () => {
      res.redirect("/login");
    }
  );
});

app.get("/login", (req, res) => {
  res.send(`<link rel="stylesheet" href="/style.css">
    <div class="container">
        <h1>로그인</h1>
        <form method="POST">
          <input type="text" placeholder="아이디"><br>
          <input type="password" placeholder="비밀번호"><br>
          <button>로그인</button>
        </form>
    </div>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (!user) return res.send("유저 없음");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send("비밀번호 틀림");

    req.session.user = user;
    res.redirect("/profile");
  });
});

app.get("/profile", (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  res.send(`
    <h1>프로필</h1>
    <p>아이디: ${req.session.user.username}</p>
    <a href="/logout">로그아웃</a>
  `);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
