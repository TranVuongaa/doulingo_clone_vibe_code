const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const normalizedModuleName = moduleName.replace(/\\/g, "/");
  const isClerkPackageFile = context.originModulePath.includes(
    `${path.sep}@clerk${path.sep}expo${path.sep}dist${path.sep}`,
  );

  // Zustand's ESM middleware build contains `import.meta.env`. Metro's web
  // development bundle is loaded as a classic script, so that syntax prevents
  // the app from hydrating and leaves a blank screen. The CommonJS build has
  // the same public API without `import.meta`.
  if (platform === "web" && normalizedModuleName === "zustand/middleware") {
    return context.resolveRequest(
      context,
      path.join(__dirname, "node_modules", "zustand", "middleware.js"),
      platform,
    );
  }

  if (
    platform === "android" &&
    isClerkPackageFile &&
    normalizedModuleName.endsWith("specs/NativeClerkModule")
  ) {
    return context.resolveRequest(
      context,
      path.join(
        __dirname,
        "node_modules",
        "@clerk",
        "expo",
        "dist",
        "specs",
        "NativeClerkModule.js",
      ),
      platform,
    );
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativewind(config);
