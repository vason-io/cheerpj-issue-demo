val copyShadowJarTask = tasks.register<Copy>("copyShadowJar") {
    val shadowJarTask = project("demo-library").tasks.named("shadowJar").get()


    val jarFile = shadowJarTask.outputs.files.first {
        it.extension.equals("jar", ignoreCase = true)
    }
    val destDir = project("demo-website").projectDir.resolve("src")

    from(jarFile)
    into(destDir)
    rename { "demo-library.jar" }

    inputs.files(shadowJarTask.outputs.files)
}

project("demo-website").afterEvaluate {
    tasks.named("dev") {
        inputs.files(copyShadowJarTask.get().outputs.files)
    }

    tasks.named("build") {
        inputs.files(copyShadowJarTask.get().outputs.files)
    }
}
