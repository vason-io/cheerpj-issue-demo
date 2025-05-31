/*
 * The settings file is used to specify which projects to include in your build.
 * For more detailed information on multi-project builds, please refer to https://docs.gradle.org/8.12/userguide/multi_project_builds.html in the Gradle documentation.
 */

rootProject.name = "cheerpj-issue-demo"

include(
    ":demo-library",
    ":demo-website",
)
