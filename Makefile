ifneq (grouped-target, $(findstring grouped-target,$(.FEATURES)))
ERROR:=$(error This version of make does not support required 'grouped-target' (4.3+).)
endif

.DELETE_ON_ERROR:
.PRECIOUS: last-test.txt last-lint.txt
.PHONY: all build clean-test lint lint-fix qa test

default: build

CATALYST_SCRIPTS:=npx catalyst-scripts

LIB_SRC:=src
LIB_FILES:=$(shell find $(LIB_SRC) \( -name "*.js" -o -name "*.mjs" \) -not -path "*/test/*" -not -name "*.test.js")
ALL_SRC_FILES:=$(shell find $(LIB_SRC) \( -name "*.js" -o -name "*.mjs" \))

TEST_STAGING=test-staging
TEST_SRC_FILES:=$(shell find $(LIB_SRC) -name "*.js")
TEST_BUILT_FILES:=$(patsubst $(LIB_SRC)/%, $(TEST_STAGING)/%, $(TEST_SRC_FILES))
LIBRARY:=dist/condition-eval.js dist/condition-eval.mjs

BUILD_TARGETS:=$(LIBRARY)

# build rules
build: $(BUILD_TARGETS)

all: build

$(LIBRARY)&: package.json $(LIB_FILES)
	JS_SRC=$(LIB_SRC) $(CATALYST_SCRIPTS) build

# test
$(TEST_BUILT_FILES)&: $(ALL_SRC_FILES)
	JS_SRC=$(LIB_SRC) $(CATALYST_SCRIPTS) pretest

last-test.txt: $(TEST_BUILT_FILES)
	( set -e; set -o pipefail; \
		JS_SRC=$(TEST_STAGING) $(CATALYST_SCRIPTS) test 2>&1 | tee last-test.txt; )

test: last-test.txt

# lint rules
last-lint.txt: $(ALL_SRC_FILES)
	( set -e; set -o pipefail; \
		JS_LINT_TARGET=$(LIB_SRC) $(CATALYST_SCRIPTS) lint | tee last-lint.txt; )

lint: last-lint.txt

lint-fix:
	JS_LINT_TARGET=$(LIB_SRC) $(CATALYST_SCRIPTS) lint-fix

qa: test lint
