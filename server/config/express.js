import bodyParser from 'body-parser';
import cors from 'cors';
import customResponses from './responses';

export default (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended : true }));
  app.use(customResponses());
};
