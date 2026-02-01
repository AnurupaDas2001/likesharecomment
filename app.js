require('dotenv').config()
const express=require('express');
const ConnectDb=require('./app/config/dbcon');
const cors=require('cors');
const morgan=require('morgan')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app=express();
ConnectDb()
app.use(morgan('combined'))
app.use(cors());
//setup body parser
app.use(express.json({
    limit:'50mb',
    extended:true
}));
app.use(express.urlencoded({extended:true}))
//static folder
app.use(express.static('public'));

// ✅ Swagger route
app.use('/likecomment-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const HomeRoute = require('./app/routes/HomeRouter');
app.use(HomeRoute);


const port=3017;
app.listen(port,()=>{
    console.log('server running on port 3017')
})