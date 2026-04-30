const fs = require('fs');
const required = [
  'src/app/pages/login-page/login-page.component.ts',
  'src/app/pages/dj-dashboard/dj-dashboard.component.ts',
  'src/app/pages/calendar-page/calendar-page.component.ts',
  'src/app/pages/search-page/search-page.component.ts'
];
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}
console.log('Build check passed.');
