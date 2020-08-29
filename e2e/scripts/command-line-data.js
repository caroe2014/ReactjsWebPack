exports.options = [
  {
    name: 'help',
    description: 'Display this usage guide.',
    alias: 'h',
    type: Boolean
  },
  {
    name: 'watch',
    description: 'Watch for test changes',
    alias: 'w',
    type: Boolean
  },
  {
    name: 'headless',
    description: 'Run in headless Chrome',
    alias: 'l',
    type: Boolean
  },
  {
    name: 'tag',
    description: 'Test tag to run (defaults to all tests)',
    alias: 't',
    type: String,
    defaultValue: undefined
  },
  {
    name: 'suite',
    description: 'Run a single specified suite',
    alias: 'S',
    type: String
  },
  {
    name: 'invert',
    description: `Runs all tests that DON'T match the tag.`,
    alias: 'i',
    type: Boolean
  },
  {
    name: 'environment',
    description: 'Environment to run against (defaults to development)',
    alias: 'e',
    type: String,
    defaultValue: 'development'
  },
  {
    name: 'direct',
    description: 'Run directly against the environment (versus through the CRA local proxy)',
    alias: 'r',
    type: Boolean
  },
  {
    name: 'debug',
    description: 'Run in debug mode',
    alias: 'd',
    type: Boolean
  },
  {
    name: 'spec',
    description: 'Run a single specified test file',
    alias: 's',
    type: String
  }
];

exports.usage = [
  {
    header: 'E2E Runner',
    content: 'Handles setting environments, tags, and chrome options needed to run wdio.'
  },
  {
    header: 'Options',
    optionList: exports.options
  },
  {
    header: 'Examples',
    content: [
      {
        desc: 'Run headless against test',
        example: '$ ./run-wdio.js --headless -e test'
      }
    ]
  }
];
