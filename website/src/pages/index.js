import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './index.module.css'
import HomepageFeatures from '../components/HomepageFeatures'
const Logo = require('../../static/img/favicon.svg').default

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', height: 110, with: "100%", marginBottom: "1.5rem" }}>
          <Logo className="app-logo" style={{ marginRight: "2rem" }} />
          <p style={{ margin: "auto 0px", fontSize: "3em", fontWeight: "bold", width: "50%", maxWidth: "600px", textAlign: "left", lineHeight: "normal" }}>{siteConfig.tagline}</p>
        </div>
        <Link
          className="button button--secondary button--lg"
          to="/docs/quickstart">
          <div className={styles.buttons}>
            {"Get Started < 5min ⏱️"}
          </div>
        </Link>
      </div>
    </header>
  )
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
