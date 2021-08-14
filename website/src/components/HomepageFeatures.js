import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css'
import {
  HiOutlinePuzzle,
  HiOutlineFire,
  HiOutlineLightningBolt,
  HiOutlineRefresh,
  HiOutlineFilter,
  HiOutlineViewGrid,
  HiOutlineCubeTransparent
} from "react-icons/hi"

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
        <code>frmx</code> is only ~27kb minified and ~9kb gzipped.
      </>
    ),
  },
  {
    title: 'Reusable inputs',
    Svg: HiOutlineRefresh,
    description: (
      <>
        <code>frmx</code> allows you to create highly reusable inputs. Ideal for data-intensive applications and to programatically create forms.
      </>
    ),
  },
  {
    title: 'Opt-in Diffing',
    Svg: HiOutlineFilter,
    description: (
      <>
        <code>frmx</code> allows you to get back only the data you really need by providing three level of diffing if you opt in for that feature.
      </>
    ),
  },
  {
    title: 'Flexible',
    Svg: HiOutlineCubeTransparent,
    description: (
      <>
        <code>frmx</code> doesn't dictate your code structure, your components nesting or the shape of your data!
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="card">
        <div className="text--center">
          <Svg className={clsx(styles.featureSvg)} alt={title} />
        </div>
        <div className="text--center padding-horiz--md">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
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
