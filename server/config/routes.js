export default (app) => {
  app.use('/1.0/', require('../api').default);

  // Default route.
  app.route('*').get((req, res) => {
    res.send('<h1 style="font-family:monospace;text-align:center;margin:10% 0 0 0;"><strong>WEPASS</strong> API 1.0</h1>');
  });
};
