.PHONY: clean check test


ROOT_DIR = $(patsubst %/,%, $(dir $(abspath $(lastword $(MAKEFILE_LIST)))))

SRC = $(shell find src -name '*.js')
LIB = $(SRC:src/%.js=lib/%.js)
LIBDIR = lib
REPORTS = reports

all: node_modules lib

node_modules: package.json
	@rm -rf node_modules
	@npm install

check:
	@eslint --ext .js,.jsx ./src

test: node_modules clean check
	@mocha ./test/

clean:
	@rm -rf $(LIBDIR)
	@rm -rf $(REPORTS)

lib: $(LIB)
lib/%.js: src/%.js
#	@echo babel	$@...
	@mkdir -p $(@D)
	NODE_ENV="production" babel $< -o $@
