import express from 'express';
import PluginManager from '../plugin_management/PluginManager';

const router = express.Router();

/* GET code listing. */
router.get('/projectTypes', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  // console.log(PluginManager.projectType('terra'));
  res.json({ projectTypes: PluginManager.projectTypes() });
});

router.get('/projectTypes/:projectType', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  PluginManager.projectType(req.params.projectType, (components) => {
    res.json(components);
  });
});

export default router;
