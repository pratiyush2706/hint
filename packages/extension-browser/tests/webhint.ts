import test from 'ava';

import { Analyzer } from 'hint';

import { hostUI } from './helpers/host-ui';

test('It passes all configured hints from webhint', async (t) => {
    const [server, urls] = await hostUI();

    const webhint = Analyzer.create({
        browserslist: 'last 1 chrome versions, last 1 firefox versions',
        extends: ['web-recommended'],
        formatters: [],
        hints: {
            axe: ['error', {
                rules: {
                    // TODO: Resolve issues and enable these rules.
                    bypass: { enabled: false },
                    'landmark-one-main': { enabled: false },
                    'page-has-heading-one': { enabled: false },
                    radiogroup: { enabled: false },
                    region: { enabled: false }
                }
            }],
            // TODO: Remove `ignore` after MDN data is up-to-date
            'compat-api/css': ['error', { ignore: ['mask-size', 'word-break'] }],
            'compat-api/html': 'error',
            // Disable server-related hints (since extension is always local)
            'content-type': 'off',
            'html-checker': 'off',
            'http-cache': 'off',
            'http-compression': 'off',
            'meta-viewport': 'off',
            'no-bom': 'off',
            'no-friendly-error-pages': 'off',
            'no-http-redirects': 'off',
            ssllabs: 'off',
            'strict-transport-security': 'off',
            'validate-set-cookie-header': 'off',
            'x-content-type-options': 'off'
        }
    });

    const results = await webhint.analyze(urls);

    for (const result of results) {
        for (const problem of result.problems) {
            t.log(problem);
        }
    }

    t.is(results.reduce((sum, result) => {
        return sum + result.problems.length;
    }, 0), 0);

    await server.stop();
});
