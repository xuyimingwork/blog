#!/usr/bin/env node
const fs = require('fs');
const moment = require('moment');
const argv = require('yargs').argv;

const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
const POST_DIR = 'posts/';
const DEFAULT_FILE_NAME = 'post';
const BANNER = `---
title: 标题
date: ${moment().format(DATE_TIME_FORMAT)}
tags:
  - 标签1
  - 标签2
---\n`;

function getPostFileName() {
  const prefix = `${moment().startOf('day').format(DATE_FORMAT)}-`;
  const postName = argv._.length ? argv._.join('-') : DEFAULT_FILE_NAME;
  const suffix = '.md';
  return `${prefix}${postName}${suffix}`;
}

function getPostFileContent() {
  return BANNER;
}

function isExist(file) {
  return new Promise(resolve => {
    fs.access(file, fs.constants.F_OK, err => {
      resolve(!err ? true : false);
    });
  });
}

function createPostFile(name, content) {
  return isExist(name)
    .then(isExist => {
      if (isExist) throw new Error(`${name} is exist!`);      
      return create(name, content);
    })

  function create(file, content) {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, content ? content : '', err => {
        if (err) return reject(err);
        console.log(`create file ${file}`);
        resolve();
      })
    })
  }
}

function main() {
  isExist(POST_DIR)
    .then(isExist => {
      if (!isExist) fs.mkdirSync(POST_DIR);
      return createPostFile(`${POST_DIR}${getPostFileName()}`, getPostFileContent());
    })
    .catch(err => console.error(err))
}

main();