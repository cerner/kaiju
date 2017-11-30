import fs from 'fs';
import MemoryFS from 'memory-fs';
import path from 'path';
import fallbackFS from '../../../service/utils/FallbackFileSystem';

describe('FallbackFileSystem', () => {
  it('finds files in the normal file system', () => {
    const testFs = fallbackFS({}, fs);

    expect(testFs.existsSync('/package.json')).toBe(true);
    expect(testFs.statSync('/package.json')).toBeDefined();
    expect(testFs.readFileSync('/package.json')).toBeDefined();
    expect(testFs.readlinkSync('/service_tests/jest/data/package.json')).toBeDefined();
  });

  it('finds files with the full path', () => {
    const testFs = fallbackFS({}, fs);
    const rootPath = path.join(__dirname, '../../..');

    expect(testFs.existsSync(`${rootPath}/package.json`)).toBe(true);
  });

  it('finds files files in the virtual file system', () => {
    const testFs = fallbackFS({}, fs);
    testFs.writeFileSync('/derp.json', 'derp');
    expect(testFs.existsSync('/derp.json')).toBe(true);
    expect(fs.existsSync('/derp.json')).toBe(false);
    expect(testFs.statSync('/derp.json')).toBeDefined();
    expect(testFs.readFileSync('/derp.json')).toBeDefined();
  });

  it('finds data created previously', () => {
    const memFS = new MemoryFS();
    memFS.writeFileSync('/derp.json', 'derp');
    const testFs = fallbackFS(memFS.data, fs);
    expect(testFs.existsSync('/derp.json')).toBe(true);
    expect(fs.existsSync('/derp.json')).toBe(false);
    expect(testFs.statSync('/derp.json')).toBeDefined();
    expect(testFs.readFileSync('/derp.json')).toBeDefined();
  });
});
