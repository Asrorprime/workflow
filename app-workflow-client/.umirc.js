
// ref: https://umijs.org/config/
import {resolve} from "path";

export default {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'app-workflow-client',
      dll: false,

      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
  proxy: {
    "/api": {
      "target": "http://localhost/",
      "changeOrigin": true
    }
  },
  alias: {
    api: resolve(__dirname, './src/services/'),
    themes: resolve(__dirname, './src/themes'),
    components: resolve(__dirname, "./src/components"),
    utils: resolve(__dirname, "./src/utils"),
    config: resolve(__dirname, "./src/utils/config"),
    constant: resolve(__dirname, "./src/utils/constant"),
    enums: resolve(__dirname, "./src/utils/enums"),
    services: resolve(__dirname, "./src/services"),
    models: resolve(__dirname, "./src/models"),
    routes: resolve(__dirname, "./src/routes"),
  },
  outputPath:'../app-workflow-server/src/main/resources/static'
}
