const router = require("express").Router() ;
const customer_routes = require("./members_route");
router.use(customer_routes) ;
module.exports = router ;