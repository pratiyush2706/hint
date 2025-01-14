import * as React from 'react';
import { useCallback, MouseEvent } from 'react';

import { Problem as ProblemData } from '@hint/utils/dist/src/types/problems';

import { browser } from '../../../../shared/globals';

import { getMessage } from '../../../utils/i18n';
import { evaluate } from '../../../utils/inject';

import SourceCode from '../../controls/source-code';

import * as styles from './problem.css';

type Props = {
    problem: ProblemData;
    index: number;
};

const Problem = ({ problem, index }: Props) => {
    const { line, column, elementId } = problem.location;
    const url = `${problem.resource}${line > -1 ? `:${line + 1}:${column + 1}` : ''}`;

    const onInspectElementClick = useCallback(() => {
        // Verify elementId is actually a number since it originates from untrusted snapshot data.
        if (typeof elementId === 'number') {
            evaluate(`inspect(__webhint.findNode(${elementId}))`);
        }
    }, [elementId]);

    const onViewSourceClick = useCallback((event: MouseEvent) => {
        if (browser.devtools.panels.openResource) {
            event.preventDefault();
            browser.devtools.panels.openResource(problem.resource, line, () => {});
        }
    }, [line, problem.resource]);

    const codeArea = problem.sourceCode && (
        <div className={styles.codeWrapper}>
            {elementId &&
                <button className={styles.button} type="button" title="Inspect Element" onClick={onInspectElementClick}>
                    <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.51 30.51">
                        <path d="M1.83 22.54v-21h21v11.38l1 .41V.54h-23v23h17.39l-.42-1z"/>
                        <path d="M21.71 29.35l3.84-6.95.14-.25.25-.14 6.95-3.84-19.09-7.91z"/>
                    </svg>
                </button>
            }
            <SourceCode language={problem.codeLanguage}>
                {problem.sourceCode}
            </SourceCode>
        </div>
    );

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <span className={styles.number}>
                    {getMessage('hintCountLabel', [(index + 1).toString()])}
                </span>
                {' '}
                {problem.message}
            </div>
            <a className={styles.problemLink} href={`view-source:${problem.resource}`} target="_blank" onClick={onViewSourceClick}>
                {url}
            </a>
            {codeArea}
        </div>
    );
};

export default Problem;
