# CheerpJ v4 issue demo

> [!NOTE]
> Live deployment available at: https://docs.vason.io/cheerpj-issue-demo/

This repo was created to demonstrate issues with CheerpJ v4 in java 11 mode.

The issues with descriptions are listed in the
[demo.js](demo-website/src/demo.js) file.

The Java code with minimal reproducible examples is found in the
[Demo.java](demo-library/src/main/java/io/vason/Demo.java) file.

## Requirements

- JDK 11+

## Running the demo

### From terminal

In the project root directory, run:

```shell
./gradlew :demo-website:dev
```

### From IntelliJ

Start the `demo-website [dev]` configuration

> [!NOTE]
> The above-mentioned gradle task will:
> 1. Compile the Demo Java class
> 2. Package a shadow JAR with the Demo class and all of its dependencies
> 3. Copy the shadow JAR to the frontend project
> 4. Install dependencies of the frontend project
> 5. Launch the frontend project's development server

Once the development server is started, navigate to the URL shown in output,
which is http://localhost:5173/ by default.


