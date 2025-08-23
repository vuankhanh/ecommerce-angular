const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');
const xmlFormatter = require('xml-formatter');
const chalk = require('chalk');

const defaultFile = 'messages.xlf';

//Lấy danh sách file ngôn ngữ từ angular.json
const angularJson = JSON.parse(fs.readFileSync('angular.json', 'utf8'));
const i18nConfig = angularJson.projects['ecommerce-angular'].i18n;
const langFiles = Object.values(i18nConfig.locales);

function parseTransUnits(xml) {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const units = {};
  const transUnits = doc.getElementsByTagName('trans-unit');
  for (let i = 0; i < transUnits.length; i++) {
    const unit = transUnits[i];
    const id = unit.getAttribute('id');
    const source = unit.getElementsByTagName('source')[0]?.textContent || '';
    const target = unit.getElementsByTagName('target')[0]?.textContent || '';
    // Lấy danh sách context-group dạng chuỗi để dễ so sánh
    const contextGroups = Array.from(unit.getElementsByTagName('context-group')).map(
      cg => cg.toString()
    );
    units[id] = { node: unit, source, target, contextGroups };
  }
  return { doc, units };
}

function syncLangFile(defaultUnits, langPath) {
  const xml = fs.readFileSync(langPath, 'utf8');
  const { doc, units: langUnits } = parseTransUnits(xml);

  const body = doc.getElementsByTagName('body')[0];
  //missing là danh sách trans-unit thiếu của file ngôn ngữ so với mặc định
  //redundant là danh sách trans-unit thừa của file ngôn ngữ so với mặc định
  //sourceDiff là danh sách source trong trans-unit của file ngôn ngữ khác với mặc định
  //noneTarget là danh sách không có target trong trans-unit của file ngôn ngữ
  //contextGroupDiff là danh sách context-group khác với mặc định
  const report = { missing: [], redundant: [], sourceDiff: [], noneTarget: [], contextGroupDiff: [] };

  // Kiểm tra thiếu trans-unit
  for (const id in defaultUnits) {
    if (!langUnits[id]) {
      // Thiếu: copy từ mặc định sang
      body.appendChild(defaultUnits[id].node.cloneNode(true));
      report.missing.push(id);
    } else {
      // Kiểm tra source khác
      if (langUnits[id].source !== defaultUnits[id].source) {
        // // Đè source từ mặc định sang
        // const sourceNode = langUnits[id].node.getElementsByTagName('source')[0];
        // if (sourceNode) {
        //   sourceNode.textContent = defaultUnits[id].source;
        // } else {
        //   const newSource = doc.createElement('source');
        //   newSource.textContent = defaultUnits[id].source;
        //   langUnits[id].node.appendChild(newSource);
        // }
        report.sourceDiff.push(id);
      }

      // So sánh context-group chi tiết
      const defaultCG = defaultUnits[id].contextGroups || [];
      const langCG = langUnits[id].contextGroups || [];
      let cgDiff = false;
      if (defaultCG.length !== langCG.length) {
        cgDiff = true;
      } else {
        for (let i = 0; i < defaultCG.length; i++) {
          if (defaultCG[i] !== langCG[i]) {
            cgDiff = true;
            break;
          }
        }
      }
      if (cgDiff) {
        // Xóa toàn bộ context-group cũ
        const oldGroups = Array.from(langUnits[id].node.getElementsByTagName('context-group'));
        oldGroups.forEach(node => langUnits[id].node.removeChild(node));
        // Thêm lại context-group từ default, dùng doc.importNode để đảm bảo node thuộc về doc hiện tại
        const newGroups = Array.from(defaultUnits[id].node.getElementsByTagName('context-group'));
        newGroups.forEach(node => langUnits[id].node.appendChild(doc.importNode(node, true)));
        report.contextGroupDiff.push(id);
      }


      if (!langUnits[id].target) {
        report.noneTarget.push(id);
      }
    }
  }

  // Kiểm tra thừa trans-unit
  for (const id in langUnits) {
    if (!defaultUnits[id]) {
      // Thừa: xóa khỏi file lang
      body.removeChild(langUnits[id].node);
      report.redundant.push(id);
    }
  }

  if (report.missing.length || report.redundant.length || report.sourceDiff.length || report.contextGroupDiff.length) {
    const transUnits = Array.from(body.getElementsByTagName('trans-unit'));
    const idOrder = Object.keys(defaultUnits);
    transUnits
      .sort((a, b) => idOrder.indexOf(a.getAttribute('id')) - idOrder.indexOf(b.getAttribute('id')))
      .forEach(unit => body.appendChild(unit)); // appendChild sẽ di chuyển node
    // Ghi lại file lang đã đồng bộ
    fs.writeFileSync(
      langPath,
      xmlFormatter(new XMLSerializer().serializeToString(doc), {
        indentation: '  ',
        collapseContent: true
      }),
      'utf8'
    );
  }
  return report;
}

function main() {
  const defaultXml = fs.readFileSync(defaultFile, 'utf8');
  const { units: defaultUnits } = parseTransUnits(defaultXml);

  langFiles.forEach(langPath => {
    if (!fs.existsSync(langPath)) {
      console.log(`File not found: ${langPath}`);
      return;
    }
    const report = syncLangFile(defaultUnits, langPath);

    console.log(`\nBáo cáo cho ${chalk.cyan(langPath)}:`);
    if (report.missing.length)
      console.log(chalk.red('  Missing:'), chalk.yellow(report.missing.join(', ')));
    if (report.redundant.length)
      console.log(chalk.magenta('  Redundant:'), chalk.yellow(report.redundant.join(', ')));
    if (report.sourceDiff.length)
      console.log(chalk.blue('  Source diff:'), chalk.yellow(report.sourceDiff.join(', ')));
    if (report.contextGroupDiff.length)
      console.log(chalk.bgCyan.black('  Context-group diff:'), chalk.yellow(report.contextGroupDiff.join(', ')));
    if (report.noneTarget.length)
      console.log(chalk.bgYellow.black('  None target:'), chalk.yellow(report.noneTarget.join(', ')));
    if (!report.missing.length && !report.redundant.length && !report.sourceDiff.length && !report.noneTarget.length && !report.contextGroupDiff.length)
      console.log(chalk.green('  All trans-units are synced.'));
  });
}

main();