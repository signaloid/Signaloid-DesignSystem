# DesignSystem

This submodule was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.0.


## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the library, run:

```bash
ng build design-system
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/design-system
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

### Submodule

To add this library as a submodule you need to run and update the list below to keep track of repos using it. 

```bash
git submodule add git@github.com:signaloid/project-kea-design-system.git
```

Repositories using this submodule
1. project-kea-web-v2
2. project-kea-application-status-page