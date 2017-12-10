import express from 'express';
import PreviewGenerator from '../preview_generation/PreviewGenerator';
import ServiceRequester from '../utils/ServiceRequester';

const router = express.Router();

/* GET code listing. */
router.get('/projects/:projectId/workspaces/:workspaceId/preview', (req, res, next) => {
  const requester = new ServiceRequester(req.cookies, req);
  const generator = new PreviewGenerator(req.params.projectId, req.params.workspaceId, requester);
  generator.generate().then(([name, entry]) => {
    res.render('preview', {
      title: name,
      codeJs: `projects/${req.params.projectId}/workspaces/${req.params.workspaceId}/preview_files/${entry}`,
      // crsfToken: req.csrfToken(),
    });
  }).catch(e => next(e));
});

router.get('/projects/:projectId/workspaces/:workspaceId/preview_files/*', (req, res, next) => {
  const requester = new ServiceRequester(req.cookies, req);
  const filename = req.url.substring(req.url.indexOf('preview_files/') + 'preview_files/'.length);
  const generator = new PreviewGenerator(req.params.projectId, req.params.workspaceId, requester);
  generator.generate().then(([, , fs]) => {
    // console.log('filename', filename);
    if (fs.existsSync(`/build/${filename}`)) {
      res.setHeader('content-type', 'text/javascript');
      res.send(fs.readFileSync(`/build/${filename}`));
    } else {
      next();
    }
  }).catch(e => next(e));
});

export default router;
