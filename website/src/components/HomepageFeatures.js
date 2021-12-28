import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css'
import { HiOutlinePuzzle, HiOutlineFire, HiOutlineLightningBolt } from "react-icons/hi"

const FeatureList = [
  {
    title: 'Simple',
    Svg: HiOutlinePuzzle,
    description: (
      <>
        <code>frmx</code>'s API is simple, yet highly configurable. Fight complexity with simplicity, not with more complexity!
      </>
    ),
  },
  {
    title: 'Performant',
    Svg: HiOutlineFire,
    description: (
      <>
        <code>frmx</code> isolates re-renders. The only thing being rendered at any given point is the field being updated.
      </>
    ),
  },
  {
    title: 'Lightweight',
    Svg: HiOutlineLightningBolt,
    description: (
      <>
        <code>frmx</code> is only ~9kb minified and ~3kb gzipped.
      </>
    ),
  }
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      {/* <div className="card"> */}
      <div className="text--center">
        <Svg className={clsx(styles.featureSvg)} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {/* </div> */}
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
