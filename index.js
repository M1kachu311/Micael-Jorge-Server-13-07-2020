import express  from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import messageRouter from './src/routes/messages';
import authRouter from './src/routes/auth';
import security from './src/lib/security';

const app = express();
const port = 3001;

app.use(cors())


security.applyMiddleware(app);

app.use(function(err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
      res.status(err.status).send({error:"authError"});
      return;
    }
 next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/messages', messageRouter);
app.use('/auth', authRouter);


app.listen(port, () => console.log(`Herolo Server listening at http://localhost:${port}`));