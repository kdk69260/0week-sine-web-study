const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// 미들웨어
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// 홈
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// 회원가입 페이지
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// 회원가입 처리
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  req.session.user = { username, password };
  res.redirect("/profile");
});

// 로그인 페이지
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// 로그인 처리
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    req.session.user &&
    req.session.user.username === username &&
    req.session.user.password === password
  ) {
    res.redirect("/profile");
  } else {
    res.send("로그인 실패");
  }
});

// 프로필 페이지
app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <div class="container">
        <h1>프로필</h1>
        <p>아이디: ${req.session.user.username}</p>
        <a href="/logout">로그아웃</a>
      </div>
    </body>
    </html>
  `);
});

// 로그아웃
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// 서버 실행
app.listen(3000, () => {
  console.log("http://localhost:3000 실행됨");
});
