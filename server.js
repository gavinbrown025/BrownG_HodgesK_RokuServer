const express = require('express');
const app = express();

const port = process.env.PORT || 5500;

app.get('/', (req, res) => {
	res.send('Spotify Server')
})

app.use((req, res, next) => {
    console.log('incoming request to' + req.url);

    //* next is the original route request ie. ./api/users
    next(); //? => set the user off on their merry way
})

app.use("/api", require("./routes/api"));
app.use("/ums", require("./routes/ums"));

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});