# This file was generated by @liquid-labs/sdlc-projects-workflow-local-node-build.
# Refer to https://npmjs.com/package/@liquid-labs/sdlc-projects-workflow-local-
# node-build for further details

#####
# build dist/condition-eval.js
#####

SDLC_CONDITION_EVAL_JS:=$(DIST)/condition-eval.js
SDLC_CONDITION_EVAL_JS_ENTRY=$(SRC)/index.js
BUILD_TARGETS+=$(SDLC_CONDITION_EVAL_JS)

$(SDLC_CONDITION_EVAL_JS): package.json $(SDLC_ALL_NON_TEST_JS_FILES_SRC)
	JS_BUILD_TARGET=$(SDLC_CONDITION_EVAL_JS_ENTRY) \
	  JS_OUT=$@ \
	  $(SDLC_ROLLUP) --config $(SDLC_ROLLUP_CONFIG)

#####
# end dist/condition-eval.js
#####
