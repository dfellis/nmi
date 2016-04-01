# nmi
Node Module Installer

## What?

NMI is (will be) a partial replacement for NPM.

## Why?

Centralized Registries are single points of failure. Commercialized Centralized Registries are single points of failure that are trying to make money at the same time. When the users and the corporate entity have aligned goals, that's fine and you'll probably get faster development in the process. But when they are misaligned, well, that's where the open source community will eventually step in. If the misalignment gets really bad, the OSS community will actually create a better project than the commercial entity (where better is relative to the user community we're talking about -- Linux *is* better than Windows, for server applications, so sysadmins and large scale server applications tend to use it).

I think npm, Inc really screwed up with the handling of the "kik" package. Courts have routinely agreed that even *businesses* with the same name can keep the name if they're in distinct enough markets (either spatially by state/country non-overlap for small businesses like plumbing services and restaurants, or by the kind of product/service they each offer as Sidecar (Ridesharing company) versus Sidecar (Design company). This reasoning applies even more thoroughly to companies versus source code. I don't really see how one could confuse the two.

I've had lots of small gripes with npm over the years, my enthusiasm for the community waned, and I haven't really contributed much lately. So I'm not going to. I'm not going to delete all of my npm packages from the central registry as Azer did, but he did show that there's a fundamental flaw with npm. It's centralized registry is both a technological single point of failure, and corruptible.

So, `nmi` won't have a central registry. It will also drop some other concepts from npm that I think have been more trouble than they're worth, and it'll (obviously) only solve core problems at first until extra features can be added on. It won't try to maintain 100% back compatibility with npm, but it will try to retain as much as possible so projects can switch over relatively easily and continue using code that has already been published on npm.

## How?

Here're the plans. They will probably change somewhat when put into practice, but I don't think it'll drift too far from here:

* No central registry, instead packages will be referenced in the `package.json` in the form `"${user}/${module}": "1.2.3"` and the `${user}` and `${module}` pieces will be templated into an ordered list of git URL templates and the first one to match is used.
* Simple binary search of git history for the appropriate `version` in the `package.json` shouldn't be too slow.
* The ordered list of URL templates means it should be super easy to have a private gitolite server for corporate stuff.
* If the package name doesn't follow the `${user}/${module}` pattern, it'll assume it's NPM style and have a separate lookup mechanism. (This could either be "fall back to NPM" or use special lookup git project that contains a mapping of NPM projects to their original git URL and then use the same mechanisms as everywhere else, not sure which way to go first, but I like the second approach more, myself.)
* Since we're using raw git repositories, we'll be enforcing some convention -- `package.json` in the root of the repo, `master` branch is master, the first commit with the desired `version` is that actual version (works for both "good" dev practice of new work in a feature branch and then only merge to master, as well as doing dev work on master and then bumping the version when you're done).
* The ability to shrinkwrap your project is awesome, but `npm-shrinkwrap.json`, besides having npm in the name, has never been versioned well. Will need to think about how exactly we want to do this, so not in scope at first.
* The ability to dedupe dependencies and flatten the dependency tree is also great, but has often been broken in npm itself, so want to make this a separate module that `nmi` simply uses.
* Don't want to host `nmi` on `npm`, so the first thing to do is make `nmi` bootstrap itself; cloning this repo and running `./bin/nmi install -u` should Just Work (tm).
* The next command to support after `install` will be `audit`. Node security warnings should be automatically accessible and it should be trivial to determine if your code fails a security audit (at least due to dependencies, clearly the code you write won't be automagically audited by this command).

## When?

Soon (tm)

## Who?

Just me, right now, but once there's actual working code here, will very much like community involvement.

## Where?

The Internets.
