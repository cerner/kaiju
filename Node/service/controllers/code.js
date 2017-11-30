import express from 'express';
import CodeGenerator from '../code_generation/CodeGenerator';
import ServiceRequester from '../utils/ServiceRequester';

const router = express.Router();

/* GET code listing. */
router.get('/projects/:projectId/workspaces/:workspaceId/code', (req, res, next) => {
  const requester = new ServiceRequester(req.cookies);
  const generator = new CodeGenerator(req.params.projectId, req.params.workspaceId, requester);
  generator.generate().then(([, manifest]) => {
    const manifestJson = {
      manifest: manifest.map((filename) => {
        const entry = {
          filename,
          url: `${req.protocol}://${req.get('host')}/projects/${req.params.projectId}/workspaces/${req.params.workspaceId}/code_files${filename}`,
        };
        return entry;
      }),
    };
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(manifestJson, null, 2));
  }).catch(e => next(e));
});

router.get('/projects/:projectId/workspaces/:workspaceId/code_files/*', (req, res, next) => {
  const requester = new ServiceRequester(req.cookies);
  const filename = req.url.substring(req.url.indexOf('code_files/') + 'code_files/'.length);
  const generator = new CodeGenerator(req.params.projectId, req.params.workspaceId, requester);
  generator.generate().then(([, , fs]) => {
    console.log('filename', filename);
    if (fs.existsSync(`/${filename}`)) {
      res.setHeader('content-type', 'text/javascript');
      res.send(fs.readFileSync(`/${filename}`));
    } else {
      next();
    }
  }).catch(e => next(e));
});

export default router;
