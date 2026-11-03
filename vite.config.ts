import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
import path from 'node:path';
import { globSync } from 'glob';
const dirname = path.dirname(fileURLToPath(import.meta.url));

const normalizePath = (file: string) => {
    const normalized = file.replaceAll("\\", "/")
    const name = normalized.split("/").at(-1)
    if(!name) return "";
    return name.replace(/\.vue$/g, "")
}

const exclude:string[] = []
const include: string[] = []
let inputs = Object.fromEntries(
    globSync('src/components/**/*.vue')
        //Exclude
        .filter((item) => {
            const filename = normalizePath(item)
            return !exclude.includes(filename)
        })
        //Include
        .filter((item) => {
            if(include.length === 0) return true;
            const normalized = item.replaceAll("\\", "/")
            for(const text of include) {
                if(normalized.includes(text)) return true
            }
            return false;
        })
        .map(file => [
            path.relative('src', file.slice(0, file.length - path.extname(file).length))
                .split(path.sep)
                .filter((_, i, arr) => i !== arr.length - 2)
                .filter((_, i, arr) => i !== 0)
                .join('/')
            ,
            path.resolve(file),
        ]));

const additionalDirectories = ["composables", "utils"]
additionalDirectories.forEach((dir) => {
    const entries = Object.fromEntries(
        globSync(`src/${dir}/**/*.ts`).map((file) => [
            path.relative('src', file.slice(0, file.length - path.extname(file).length))
                .split(path.sep)
                .join('/')
            ,
            path.resolve(file)])
    )
    inputs = {
        ...inputs,
        ...entries
    }
})

// Legacy entry point to import components directly from destructuring the dhc-components.
// This lead to massive increase in package size.:
// ```js
//      // X   Don't import like this:
//      import { XButton } from 'dhc-components';
//
//      // ✓   Import like this
//      import XButton from 'dhc-components/Button/XButton'
// ``` 
inputs.index = path.resolve(__dirname, 'src/index.ts');


// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@scss': path.resolve(__dirname, 'src', 'scss'),
            '§': path.resolve(__dirname, 'src', 'types'),
            '$': path.resolve(__dirname, '.storybook'),
        }
    },
    build: {
        lib: {
            entry: {
                index: path.resolve(__dirname, 'src/index.ts'),
            },
            formats: ['es'],
            fileName: (_, entryName) => `${entryName}.js`,
        },

        rollupOptions: {
            external: [
                'vue',
                't',
                'bootstrap',
            ],

            input: inputs,

            output: {
                format: "es",
                chunkFileNames: "_chunks/[name]-[hash].js",
                globals: {
                    vue: 'Vue',
                    t: 't',
                    'vue-i18n': 'VueI18n',
                    bootstrap: 'bootstrap',
                }
            },

        },

        sourcemap: true,
        emptyOutDir: true,
    },
    css: {
        preprocessorOptions: {
            scss: {
                // The current Bootstrap version (5.3.8) uses a Dart version and features that produce
                // a bunch of annoying deprecation warnings, we cannot do anything about. That's why
                // we disable them here. Remove after bootstrap manages this appropriately.
                silenceDeprecations: ['color-functions', 'global-builtin', 'import', 'if-function', 'legacy-js-api', 'slash-div']
            },
        }
    }
});