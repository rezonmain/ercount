# ercount

Log stream chat and run analytics

## Install dependencies:

While in the root directory

```bash
bun install
```

## Usage

Run the `log` script to start logging and run an analysis of the logged data, on completion it writes an `out.json` file with the results of the analysis

```bash
bun log hasanabi
```

If you want to skip the analysis step, pass the `--skip-analysis` flag

```bash
bun log paymoneywubby --skip-analysis
```

The `analyze` script just runs an analysis on existing log data, to run it pass the base name of the log files you want to analyze, this will output an `out.json` file

```bash
bun analyze o5rs_willneff_2023-10-01T07:37:28.698Z
```
