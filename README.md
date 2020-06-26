# webdev app server

## Git conventions

> It is not recommended to push modifications on master or develop branch. In addition these branches are protected and it's impossible to send modifications.

It will be necessary to follow these conventions.

## Naming of branches

Each branch name must be preceded by one of these prefixes depending on the context.

- build: Changes that affect the build system or external dependencies (:rocket: `:rocket:`)
- ci: Changes on our CI configuration files and scripts (:zap: `:zap:`)
- docs: Changes on documentation only  (:pencil: `:pencil:`)
- feat: A new feature (:sparkles: `:sparkles:`)
- fix: A bug fix (:bug: `:bug:`)
- perf: A code change that improves performance (:zap: `:zap:`)
- refactor: A code change that neither fixes a bug nor adds a feature (:recycle: `:recycle:`)
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) (:art: `:art:`)
- test: Adding missing tests or correcting existing tests (:alembic: `:alembic:`)

```bash
<type>/<subject>
```

feat/init-my-project

## Commit messages

```bash
<type>(<contexte>): <subject>
```

:sparkles: add login form

## Type

Same as we have seen in **Naming of branches**

## Context

The context remains optional and expresses the scope of the change

## Subject

Rules:

- use the imperative: add, update, remove, prevent ... put everything in lowercase
- do not end the message with a point avoid text interpreted in shell
- in English por favor :grin: :pray:

## Git Process

Once the development is finished, just open a pull/merge request to the develop branch in order to validate the code and merge it with the existing one.
