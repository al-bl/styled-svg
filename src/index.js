const prettier = require('prettier')
const fs = require('fs-extra')
const path = require('path')

const indent = require('./indent')
const optimize = require('./optimize')
const serializeSizes = require('./serializeSizes')
const { pascalCase } = require('./stringOperations')

const writeOut = async (filePath, content, options) => {
  if (options.dryRun) {
    console.log('\n')
    console.log(filePath)
    console.log(content)
  } else {
    await fs.ensureDir(path.dirname(filePath))
    await fs.writeFile(filePath, content)
  }
}

const endsWithSvg = /\.svg$/i
const viewBoxAttribute = /viewBox="([\s-\d.]+)"/i
const whitespace = /\s+/

const join = (...args) => path.normalize(path.join(...args))

const convertFile = async (filePath, templates, options) => {
  let viewBox = [0, 0, 0, 0]
  let ext = '.js'

  if (options.ts) {
    ext = '.ts'
  }

  // determine names
  const displayName = pascalCase(
    path.basename(filePath).replace(endsWithSvg, '')
  )
  const componentFilename = displayName + ext
  const testFilename = displayName + '.test' + ext

  // resolve paths
  const testDir = options.testDir || './'
  const outputDir = options.outputDir || path.dirname(filePath)
  const outputTestDir = join(outputDir, testDir)
  const importRelativePath =
    path.relative(outputTestDir, outputDir).replace(path.sep, '/') || '.'

  // load file content
  const origContent = await fs.readFile(filePath, 'utf8')

  // get clean up viewBox
  let tempViewBox = origContent.match(viewBoxAttribute)
  let foundViewbox = false
  if (tempViewBox && tempViewBox[1].trim()) {
    tempViewBox = tempViewBox[1].trim().split(whitespace)
    if (tempViewBox.length === 4) {
      viewBox = tempViewBox.map(number => Math.round(parseFloat(number || 0)))
      foundViewbox = true
    }
  }

  // exit if viewbox was missing
  if (!foundViewbox) {
    console.error(
      'Skipped',
      filePath.replace(process.cwd(), '.'),
      'viewBox attribute missing or malformated'
    )
    return
  }

  // run SVG optimizers
  const content = await optimize(origContent)

  // react formatted SVG
  const formattedContent = indent(content.data)

  // handle size alias options
  const sizes = serializeSizes(options)

  const prettierConfig = await prettier.resolveConfig(filePath)

  // output component and test file
  await Promise.all([
    writeOut(
      join(outputDir, componentFilename),
      prettier.format(
        templates.component
          .replace('##SVG##', formattedContent)
          .replace('##WIDTH##', viewBox[2])
          .replace('##HEIGHT##', viewBox[3])
          .replace('##VIEWBOX##', viewBox.join(' '))
          .replace('##NAME##', displayName)
          .replace("'##SIZES##'", sizes),
        // .replace("'##CREATEHELPERS##'", createHelpers.toString()
        prettierConfig
      ),
      options
    ),
    !options.noTests
      ? writeOut(
        join(outputTestDir, testFilename),
        templates.test
          .replace(
            '##FILENAME##',
            `${importRelativePath}/${componentFilename}`
          )
          .replace(/##NAME##/g, displayName),
        options
      )
      : Promise.resolve()
  ])

  
  console.log(
    'Converted',
    filePath.replace(process.cwd(), '.'),
    ' => ',
    path.join(outputDir.replace(process.cwd(), '.'), displayName)
  )
}

module.exports = async (files, options) => {
  // load templates
  const templatesDir =
    options.templatesDir || join(__dirname, '..', 'templates')
  const templates = {
    component: await fs.readFile(join(templatesDir, 'component.js'), 'utf8'),
    test: await fs.readFile(join(templatesDir, 'test.js'), 'utf8'),
  }

  // clean output directories
  if (options.clean) {
    const del = require('del')
    if (options.outputDir) {
      await del([join(options.outputDir, '*.js')])
    }
    if (options.testDir) {
      await del([join(options.testDir, '*.test.js')])
    }
  }

  // convert files
  return Promise.all(files.map(file => convertFile(file, templates, options)))
    .then(() => {
      fs.readdir(options.outputDir, async function (err, items) {
        if (err) {
          throw new Error()
        }
        const fileNames = [...new Set(items.map(el => el.split('.')[0]))]
        const imports = fileNames.map(name => `import ${name} from './${name}'`)
        const file = `${imports.join(';')}; export {${fileNames.join()} }`
        await writeOut(path.join(path.resolve(options.outputDir), 'index.js'), prettier.format(file), {})
        console.log('Created index.js file')
        const helpers =   await fs.readFile(join(__dirname, '..', 'src/createHelpers.js'), 'utf8')
        await writeOut(path.join(path.resolve(options.outputDir), 'helpers.js'), prettier.format(helpers), {})

        await fs.copySync(path.resolve(join(__dirname, '..', 'src/createHelpers.js')), 'helpers.js')
        console.log('Copy helpers.js')

      })
    }
    )
}
