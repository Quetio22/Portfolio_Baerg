const path=require('node:path');
const root=path.resolve(__dirname,'..');
const {defineConfig}=require(path.join(root,'source/experiments/liquid-glass/node_modules/@playwright/test'));
module.exports=defineConfig({
  testDir:path.join(__dirname,'existing-suite'),
  outputDir:path.join(root,'evidence/existing-suite-traces'),
  workers:2,
  fullyParallel:false,
  timeout:30000,
  use:{baseURL:'http://127.0.0.1:4738',trace:'retain-on-failure',reducedMotion:'reduce'},
  projects:[{name:'chromium',use:{browserName:'chromium'}},{name:'webkit',use:{browserName:'webkit'}}],
  reporter:[['list'],['json',{outputFile:path.join(root,'evidence/existing-suite.json')}]],
});
