import MemoryFS from 'memory-fs';
import path from 'path';

const rootPath = path.join(__dirname, '../..');

function updatedArgs(args) {
  const newArgs = args;
  if (!newArgs[0].startsWith(rootPath)) {
    newArgs[0] = `${rootPath}${args[0]}`;
  }
  return newArgs;
}

function fallbackFS(data, fs) {
  const handler = {
    get(target, key) {
      const origMethod = target[key];
      if (key === 'readFileSync'
        || key === 'statSync'
        || key === 'readlinkSync'
        || key === 'existsSync'
        || key === 'readdirSync') {
        return function apply(...args) {
          if (target.existsSync(args[0])) {
            return origMethod.apply(this, args);
          }
          return fs[key](...updatedArgs(args));
        };
      }
      return origMethod;
    },
  };

  return new Proxy(new MemoryFS(data), handler);
}

export default fallbackFS;
