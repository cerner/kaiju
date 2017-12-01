import CodeGenerator from '../../../service/code_generation/CodeGenerator';

describe('CodeGenerator', () => {
  describe('constructor', () => {
    it('creates an object', () => {
      const projectId = '123';
      const workspaceId = '456';
      const requester = '789';
      const gen = new CodeGenerator(projectId, workspaceId, requester);

      expect(gen.projectId).toBe(projectId);
      expect(gen.workspaceId).toBe(workspaceId);
      expect(gen.requester).toBe(requester);
      expect(gen.cache).toBeDefined();
      gen.cache.client.disconnect();
    });
  });

  describe('generate', () => {
    // it('has a current cache', () => {
    //   const projectId = '123';
    //   const workspaceId = '456';
    //   const requester = '789';
    //   const gen = new CodeGenerator(projectId, workspaceId, requester);

    //   gen.cachedCode
    // });
  });

  describe('cachedFileSystem', () => {

  });

  describe('generateCode', () => {

  });

  describe('ast', () => {

  });
});
