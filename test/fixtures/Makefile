help: ## Shows this help
	@echo "$$(grep -h '#\{2\}' $(MAKEFILE_LIST) | sed 's/: #\{2\} /	/' | column -t -s '	')"

slake: ## Slake
	curl --silent http://slakecafe.com/ > $@.html

stdavids: ## St. David's
	curl --silent http://www.stdave.org/about/on-campus/thursday-lunch/ > $@.html
