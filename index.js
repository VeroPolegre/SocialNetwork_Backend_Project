const express = require("express");

const app = express();
const PORT = 8080;

const { handleTypeError } = require("./middleware/errors");
const { dbConnection } = require("./config/config");

dbConnection();
app.use(express.json());

app.use("/posts", require("./routes/posts"));
app.use("/users", require("./routes/users"));

app.use(handleTypeError);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
