import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.aposnov.payslipsApp',
  appName: 'payslipsApp',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
