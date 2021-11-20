const express = require('express');
const app = express();

const port = process.env.PORT || 5500;


app.use((req, res, next) => {
    console.log('incoming request to' + req.url);

    //* can test things here before going to the server like authentication
    //* next is the original route request ie. ./api/users
    next(); //? => set the user off on their merry way
})

app.use("/api", require("./routes/api"));
app.use("/ums", require("./routes/ums"));

app.listen(port, () => console.log(`server is running on port ${port}`));