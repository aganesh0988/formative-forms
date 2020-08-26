const express = require("express");
const csrf = require('csurf')
const cookieParser = require('cookie-parser')


const app = express();
const port = process.env.PORT || 3000;
app.set("view engine", "pug");

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
const csrfProtection = csrf({ cookie: true })

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page", users });
});

app.get("/create", csrfProtection, (req, res) => {
  res.render("create-user", { title: "Create User", messages: [], csrfToken: req.csrfToken() });
})

app.post("/create", csrfProtection, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  const errors = [];

  if (!firstName) {
    errors.push("Please provide a first name.")
  }

  if (!lastName) {
    errors.push("Please provide a last name.")
  }

  if (!email) {
    errors.push("Please provide an email.")
  }

  if (!password) {
    errors.push("Please provide a password.")
  }

  if (password !== confirmedPassword) {
    errors.push("The provided values for the password and password confirmation fields did not match.")
  }

  if (errors.length > 0) {
    res.render("create-user", { title: "Create User", errors, firstName, lastName, email });
    return;
  }

  users.push({
    id: users.length + 1,
    firstName,
    lastName,
    email
  });
  res.redirect("/")

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
