import express from 'express';
import PluginManager from '../plugin_management/PluginManager';

const router = express.Router();

/* GET code listing. */
router.get('/projectTypes', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  // console.log(PluginManager.projectType('terra'));
  res.send(JSON.stringify({ projectTypes: PluginManager.projectTypes() }, null, 2));
});

router.get('/projectTypes/:projectType', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  PluginManager.projectType(req.params.projectType, (components) => {
    res.send(JSON.stringify(components, null, 2));
  });
});

export default router;
