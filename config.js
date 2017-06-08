const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';

//10.10.97.126
export default {
  port:  8000,
  host: env.HOST || '192.168.0.192',
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  }
};
