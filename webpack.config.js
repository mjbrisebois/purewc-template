
import webpack			from 'webpack';
import TerserPlugin		from 'terser-webpack-plugin';


const MODE			= process.env.MODE || "development";
const FILENAME			= process.env.FILENAME || "purewc-template";
const FILEEXT			= MODE === "production" ? "min.js" : "js";


export default {
    "target":	"web",
    "mode":	MODE,
    "entry":	"./src/index.js",
    "output": {
	"filename": `${FILENAME}.${FILEEXT}`,
	"library": {
	    "type": "window",
	},
    },
    "optimization": {
	"minimizer": [
	    new TerserPlugin({
		"terserOptions": {
		    "keep_classnames": true,
		},
	    }),
	],
    },
    "devtool":	"source-map",
};
