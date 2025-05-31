plugins {
    `java-library`
    `kotlin-dsl`

    id("com.gradleup.shadow") version "9.0.0-beta15"
}

group = "io.vason"
version = "1.0.0"

// Ensure that the code is compiled for Java 8, which is required by CheerpJ v3
// TODO: Once CheerpJ v4 supports current demo, switch to JavaVersion.VERSION_11
java {
    sourceCompatibility = JavaVersion.VERSION_1_8
    targetCompatibility = JavaVersion.VERSION_1_8
}

repositories {
    mavenCentral()
}

dependencies {
    // Basic XLSX Conversion
    implementation("org.apache.poi:poi-ooxml:5.4.0")
    implementation("org.apache.poi:poi-ooxml-full:5.4.0")
}

// See: https://gradleup.com/shadow/configuration/reproducible-builds/
tasks.withType<AbstractArchiveTask>().configureEach {
    isPreserveFileTimestamps = false
    isReproducibleFileOrder = true
}

tasks.shadowJar {
    minimize {
        exclude(dependency("org.apache.poi:.*:.*"))
    }

    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
}
