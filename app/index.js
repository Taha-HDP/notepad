const express = require("express");
const app = express();
const morgan = require('morgan');
class Application {
    constructor() {
        this.setup_express();
        this.setup_routesAndMidleware();
    }
    setup_routesAndMidleware() {
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static("public"));
        if (app.get('env') === 'production') app.use(morgan('tiny'));
    }
    setup_express() {
        const port = process.env.myPort || 3000;
        app.listen(port, () => {
            console.log(`app listening on port ${port}`)
          })
    }
}

module.exports = Application;