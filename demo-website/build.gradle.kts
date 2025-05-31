plugins {
    id("io.github.pereduromega.node.plugin") version "2.2.0"
}

repositories {
    nodeRepository()
}

node {
    nodeVersion.set("22.14.0")
    downloadNode.set(true)
    packageManager.set(PackageManager.NPM)
}
