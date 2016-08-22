help: ## Shows this help
	@echo "$$(grep -h '#\{2\}' $(MAKEFILE_LIST) | sed 's/: #\{2\} /	/' | column -t -s '	')"

messhall: ## Messhall Cafe
slake: ## Slake
stdavids: ## St. David's

messhall slake stdavids:
	export URL=$$(../../node_modules/.bin/babel-node --print --eval 'require("../../src/venues/%@").data.url') && \
	  curl --silent $$URL > $@.html

mythaimom: ## My Thai Mom
	curl --silent https://graph.facebook.com/v2.7/200414600091489/feed?access_token=${FACEBOOK_APP_TOKEN} > $@.json
