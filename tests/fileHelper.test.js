/**
 * @file      fileHelper.test.js
 * @description This class is designed to test the behaviour of
 * {@link FileHelper}.
 * @author    Created by Yannick.BAUDRAZ
 * @version   28-MAR-2022 - original
 */

'use strict';

const fs = require('fs');
const FileHelper = require('../src/FileHelper');
const FileEmptyException = require('../src/EmptyFileException');
const FileNotFoundException = require('../src/FileNotFoundException');
const _ = require('lodash');

describe('FileHelper', () => {
  //region private attributs

  /**
   * @type {FileHelper}
   */
  let fileHelper;
  let path = __dirname;
  let fileName = 'testFile.csv';
  const fullPath = path + '/' + fileName;

  //endregion

  beforeEach(() => {
    fs.writeFileSync(fullPath, '');
  });

  test('Constructor_NominalCase_Success', () => {
    //given
    //refer to Init() method
    const expectedAmountOfLines = 20;
    fs.appendFileSync(fullPath, _.range(expectedAmountOfLines).join('\n'));

    fileHelper = new FileHelper(path, fileName);
    fileHelper.extractFileContent();

    //when
    const lines = fileHelper.lines;

    //then
    expect(lines).toHaveLength(expectedAmountOfLines);
  });

  test('Constructor_InexistingFile_ThrowException', () => {
    //given
    const wrongPath = 'falkjalj';
    const wrongFileName = 'wrong.csv';

    //when
    expect(() => {
      new FileHelper(wrongPath, wrongFileName);
    }).toThrow(FileNotFoundException);

    //then
    //exception thrown
  });

  test('Constructor_FileEmpty_ThrowException', () => {
    //given
    //refer to Init() method
    fileHelper = new FileHelper(path, fileName);

    //when
    expect(() => {
      fileHelper.extractFileContent();
    }).toThrow(FileEmptyException);

    //then
    //exception thrown
  });

  test('Split_OnlyOneBigFile_Success', () => {
    //given
    //refer to Init()
    const amountOfLines = 400;
    const expectedAmountOfResultFiles = 2;
    const expectedLinesPerFiles = amountOfLines /
        expectedAmountOfResultFiles;

    fs.appendFileSync(fullPath, _.range(amountOfLines).join('\n'));

    fileHelper = new FileHelper(path, fileName);
    fileHelper.extractFileContent();

    //when
    fileHelper.split(expectedLinesPerFiles);
    const liftOfFilesResult = fs.readdirSync(path).
        filter(fn => fn.endsWith('.csv'));

    //then
    expect(liftOfFilesResult).toHaveLength(expectedAmountOfResultFiles);
  });

  afterEach(() => {
    fs.readdirSync(__dirname).
        filter(file => file.endsWith('.csv')).
        forEach(file => fs.unlinkSync(path + '/' + file));
  });
});
