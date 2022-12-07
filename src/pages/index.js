import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import _s from 'scramb';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <div class="bg-white dark:bg-gray-800">
      <div class="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
        <h2 class="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
          @mengkodingan/<span class="text-indigo-500">ckptw</span>
        </h2>
        <p class="text-xl mt-2 max-w-md mx-auto text-gray-400">
          easy way to create a Whatsapp bot with some lines of code.
        </p>
        <div class="lg:mt-0 lg:flex-shrink-0">
          <div class="mt-3 inline-flex rounded-md shadow">
            <Link
              class="hover:text-white hover:no-underline py-4 px-6 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              to="/docs/"
            >
              Getting Started{" "}
              {_s.randomArr(["🎈", "✨", "🎉", "🎏", "📙", "📌"]).result}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <div className="dark:bg-gray-800">
        <HomepageHeader />

        <main className="px-10 md:px-16 pt-16 bg-[#f2f2f2] dark:bg-[#242933]">
          <HomepageFeatures />
        </main>
      </div>
    </Layout>
  );
}
