import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css'
import { FiFeather, FiWatch, FiCheckCircle } from "react-icons/fi"

const FeatureList = [
  {
    title: 'Simple',
    Svg: FiCheckCircle,
    description: (
      <>
        <code>frmx</code>'s API is simple, yet highly configurable.
      </>
    ),
  },
  {
    title: 'Performant',
    Svg: FiWatch,
    description: (
      <>
        <code>frmx</code> isolates re-renders. The only thing being rendered at any given point is the field being updated.
      </>
    ),
  },
  {
    title: 'Lightweight',
    Svg: FiFeather,
    description: (
      <>
        <code>frmx</code> is only ~21kb minified and ~7kb gzipped.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={clsx(styles.featureSvg, "secondary")} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
