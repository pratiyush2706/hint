import * as React from 'react';

import * as styles from './section.css';

type Props = {
    children: any;
    className?: string;
    title: string;
}

/**
 * Wrap related configuration items with a common container and styles.
 */
const ConfigSection = ({ children, className, title }: Props) => {
    return (
        <section className={className}>
            <h1 className={styles.header}>
                {title}
            </h1>
            {children}
        </section>
    );
};

export default ConfigSection;
