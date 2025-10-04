const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')
const path = require('path')

const config = getDefaultConfig(__dirname)

const { assetExts, sourceExts } = config.resolver

config.resolver.assetExts = assetExts.filter(ext => ext !== 'svg')
config.resolver.sourceExts = [...sourceExts, 'svg']
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
)

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '..')

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

module.exports = withNativeWind(config, { input: './global.css' })
