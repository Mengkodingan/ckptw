import React from 'react';
import CodeBlock from '@theme/CodeBlock'

const FeatureList = [
  {
    title: "Install it!",
    CodeBlock: {
      left: false,
      language: "bash",
      title: "bash",
      code: `# install it from npm
npm i @mengkodingan/ckptw

# or install it from Github for more new features, some bug fixes, and maybe theres some bugs too.
npm i github:mengkodingan/ckptw`,
    },
    description: (
      <>
        First of all, you need <b>NodeJs</b> & <b>NPM</b> installed. And then
        you can install the library from npm or or install it from Github for
        more new features, some bug fixes, and maybe theres some bugs too...
      </>
    ),
  },
  {
    title: "now Setup!",
    CodeBlock: {
      left: true,
      language: "js",
      title: "index.js",
      code: `const { Client } = require("@mengkodingan/ckptw");
const bot = new Client({
  name: "something",
  prefix: "!",
  autoRead: true,
});

bot.ev.once('ready', (m) => {
  console.log('ready!');
});

bot.command({
  name: "ping",
  code: async (ctx) => {
    ctx.sendMessage(ctx.id, { text: "pong!" });
  },
});

bot.launch();`,
    },
    description: (
      <>
        Create your first bot using <b>@mengkodingan/ckptw</b> with just a few
        lines of code. Feel free to open new Github Issue in our repository if
        you need help about <b>@mengkodingan/ckptw</b>.
      </>
    ),
  },
  {
    title: "and then, Run it!",
    CodeBlock: {
      left: false,
      language: "bash",
      title: "bash",
      code: `node index.js`,
    },
    description: (
      <>
        Just with a few steps now you can scan the qr in terminal with your
        Whatsapp... and now you can start creating some Whatsapp bot. You can
        read the documentation for more information about using{" "}
        <b>@mengkodingan/ckptw</b>
      </>
    ),
  },
];

export default function HomepageFeatures() {
  return (
    <>
      <section id="how">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-0 md:gap-y-16">
          {FeatureList.map((props, idx) => (
            <>
              {props.CodeBlock.left ? (
                <div className="hidden md:block">
                  <CodeBlock
                    language={props.CodeBlock.language}
                    title={props.CodeBlock.title}
                    showLineNumbers
                  >
                    {props.CodeBlock.code}
                  </CodeBlock>
                </div>
              ) : (
                ""
              )}
              <div
                key={idx}
                className={`${
                  props.CodeBlock.left ? "pl-0 md:pl-16" : "pr-0 md:pr-16"
                } ${idx === 0 ? "" : "mt-16 md:mt-0"}`}
              >
                <h2 className="text-3xl font-extrabold text-black dark:text-white">
                  {props.title}
                </h2>
                <p>{props.description}</p>
              </div>
              {props.CodeBlock.left === true ? (
              <div className="block md:hidden">
                <CodeBlock
                  language={props.CodeBlock.language}
                  title={props.CodeBlock.title}
                  showLineNumbers
                >
                  {props.CodeBlock.code}
                </CodeBlock>
              </div>
              ) : ""}
              {props.CodeBlock.left === false ? (
                <div>
                  <CodeBlock
                    language={props.CodeBlock.language}
                    title={props.CodeBlock.title}
                    showLineNumbers
                  >
                    {props.CodeBlock.code}
                  </CodeBlock>
                </div>
              ) : (
                ""
              )}
            </>
          ))}
        </div>

        <div className="text-center py-20">
          <a
            href="/docs/intro"
            class="hover:text-white hover:no-underline py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
          >
            Explore the documentation!
          </a>
        </div>
      </section>
    </>
  );
}