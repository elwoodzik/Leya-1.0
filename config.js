const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';

//10.10.97.126
export default {
  port:  9010,
  host: env.HOST || '10.10.97.44',
  get serverUrl() {
    return `http://${this.host}:${this.port}`;
  }
};
