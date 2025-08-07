# Arctic Rain on Snow Study (AROSS) Stations User Interface

[![Actions Status][actions-badge]][actions-link]
[![Documentation Status][rtd-badge]][rtd-link]

[![PyPI version][pypi-version]][pypi-link]
[![Conda-Forge][conda-badge]][conda-link]
[![PyPI platforms][pypi-platforms]][pypi-link]

[![GitHub Discussion][github-discussions-badge]][github-discussions-link]

Reads Automated Surface Observation Station (ASOS) data from an API and visualizes the
data on a map and bar charts.

_Part of the [AROSS Stations](https://github.com/nsidc/aross-stations) project._

> [!IMPORTANT]
> The [database and API](https://github.com/nsidc/aross-stations-db) must be running on
> `localhost`.


## Usage

Required [Docker](https://docs.docker.com/engine/install/) for quickstart. For
development, requires [NodeJS](https://nodejs.org/en) >=20.


### Starting the UI

```bash
docker compose up --pull=always --detach
```

Visit the running application at `http://localhost:80/apps/aross-stations`.

Note: This root was put in place to make it more conducive to hosting behind the NSIDC
reverse proxies for the VMs.  If you want to use a different root, you can change it in
the `vite.config.ts` file.  Also, when running in the `aross-stations-db` stack, it
will be using HTTPS instead of HTTP.

Also, this app is currently configured to talk to the back-end API at the same server
as this app, but using the `/api/aross-stations` root.  If this needs to be changed, do so
in the `api.ts` file.  See `aross-stations-db` for details on how this is set up, particularly
for local development.


<!-- prettier-ignore-start -->
[actions-badge]:            https://github.com/nsidc/aross-stations-ui/workflows/CI/badge.svg
[actions-link]:             https://github.com/nsidc/aross-stations-ui/actions
[conda-badge]:              https://img.shields.io/conda/vn/conda-forge/aross-stations-ui
[conda-link]:               https://github.com/conda-forge/aross-stations-ui-feedstock
[github-discussions-badge]: https://img.shields.io/static/v1?label=Discussions&message=Ask&color=blue&logo=github
[github-discussions-link]:  https://github.com/nsidc/aross-stations-ui/discussions
[pypi-link]:                https://pypi.org/project/aross-stations-ui/
[pypi-platforms]:           https://img.shields.io/pypi/pyversions/aross-stations-ui
[pypi-version]:             https://img.shields.io/pypi/v/aross-stations-ui
[rtd-badge]:                https://readthedocs.org/projects/aross-stations-ui/badge/?version=latest
[rtd-link]:                 https://aross-stations-ui.readthedocs.io/en/latest/?badge=latest
<!-- prettier-ignore-end -->
