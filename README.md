# This is the `open source` version of the original Flip Sourcer repository

_Original Repository Stats_

- Maintained from `August 30th, 2022` to `October 12th, 2023`
- 344 merged pull requests
- 240 deployments

## Intro

My name is Kelvan Brandt I am the ex-founder of Flip Sourcer. Flip Sourcer was a project designed to help 3rd party Amazon sellers find profitable Online Arbitrage leads.

For additional context please reference the [Flip Sourcer Pitch Deck](https://flipsourcer.com/flip-sourcer-deck.pdf)

Also if you have any questions in general, please reach out. This is a very surface level overview of this repository. I'd also like to note that this isn't my cleanest work for a few reasons:

1. I was working mostly by myself
2. Once code was clean enough I needed to move on because I was also in charge of all business operations

## Table of Contents

#### Technical

- [Repository structure](#repository-structure)

#### Non-Technical

- [Flip Sourcer Inception and Obituary](./readmes/FLIP_SOURCER_INCEPTION_AND_OBITUARY.md)

## Repository Structure

This repository is a monorepo but it isn't your typical monorepo, very little is shared between packages other than types. This is mainly to reduce the bundle size of the Fargate instances but more on that later.

#### ./packages
- [back-end](./packages/back-end/README.md)
- [cdk](./packages/cdk/README.md)
- [front-end](./packages/cdk/README.md)
- [types](./packages/cdk/README.md)

#### ./readmes

Houses markdown documents that don't have a `good place to live`

#### ./scripts

Workaround to using shared workspaces. These scripts handle the following:

- `building`
- `dependency checking`
- `linting`
- `testing`