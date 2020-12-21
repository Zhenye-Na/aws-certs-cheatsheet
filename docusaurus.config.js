module.exports = {
  title: 'AWS Certs Cheatsheet',
  tagline: 'Homemade Cheatsheet for AWS Certification Exams',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'zhenye-na', // Usually your GitHub org/user name.
  projectName: 'aws-certs-cheatsheet', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'AWS Cert. Cheatsheet',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.png',
      },
      links: [
        {
          to: 'docs/csa/chapter00',
          activeBasePath: 'docs',
          label: 'Notes',
          position: 'left',
        },
        // {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/Zhenye-Na/aws-certs-cheatsheet',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Exams',
          items: [
            {
              label: 'AWS Solution Architects - Associate',
              to: 'docs/doc1',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/users/8692953/zhenye-na',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              href: 'https://zhenye-na.github.io/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Zhenye-Na',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Zhenye Na Built with Docusaurus and ❤️.`,
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/zhenye-na/aws-certs-cheatsheet/edit/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ]
};
