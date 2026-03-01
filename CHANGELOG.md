# [2.11.0](https://github.com/Billos/Sparkleft/compare/2.10.2...2.11.0) (2026-03-01)


### Features

* add a link to the selection of categories in the uncategorized transaction message ([26fa67b](https://github.com/Billos/Sparkleft/commit/26fa67bb81fa7dbc47df5b0416532bd046c03adb))
* Add Pug templating and static asset serving ([b1e59d0](https://github.com/Billos/Sparkleft/commit/b1e59d07c21be8de3fd7475315c4052ee79f0b3f))
* Create new category in the set category UI ([c06bbc8](https://github.com/Billos/Sparkleft/commit/c06bbc84a5478539d0515e33e4e2a2037994363a))
* Generic css style ([77bae8e](https://github.com/Billos/Sparkleft/commit/77bae8ec110107d2da149c8d5aed77651792b37f))
* Web UI to reach manually set the Category, not hiding the categories ([27d1bd5](https://github.com/Billos/Sparkleft/commit/27d1bd58e691358d84695e86b2d0fc4a6b106faf))

## [2.10.2](https://github.com/Billos/Sparkleft/compare/2.10.1...2.10.2) (2026-02-28)


### Bug Fixes

* Reorder link placement in transaction notification messages ([d5b17b8](https://github.com/Billos/Sparkleft/commit/d5b17b8ce8744254c881fe02b1e0bfa516710e91))

## [2.10.1](https://github.com/Billos/Sparkleft/compare/2.10.0...2.10.1) (2026-02-28)


### Bug Fixes

* Format API call links as bulleted list instead of pipe-delimited inline ([00c6771](https://github.com/Billos/Sparkleft/commit/00c6771f6d4fc9dd1b07ddc4b7e7d847eb8d8f45))

# [2.10.0](https://github.com/Billos/Sparkleft/compare/2.9.4...2.10.0) (2026-02-28)


### Features

* Add HIDDEN_CATEGORIES environment variable to filter available categories ([2fe03de](https://github.com/Billos/Sparkleft/commit/2fe03de1b64242f0e68ed1a930cc507ce021a3d2))

## [2.9.4](https://github.com/Billos/Sparkleft/compare/2.9.3...2.9.4) (2026-02-16)


### Bug Fixes

* Prevents deleting non-existent messages ([7af32dc](https://github.com/Billos/Sparkleft/commit/7af32dc4cf8745a0b87414ff12eedeffc7fc8aa9))

## [2.9.3](https://github.com/Billos/Sparkleft/compare/2.9.2...2.9.3) (2026-02-16)


### Bug Fixes

* Adapts budget ID handling in webhook ([1e008fb](https://github.com/Billos/Sparkleft/commit/1e008fbe8c3aa92b1bb1187c14e5998e8d70132b))
* Handles missing budgetId in job ([6471358](https://github.com/Billos/Sparkleft/commit/6471358752a578d0865ca637f0447ee2929fce8a))
* Updates Firefly III API definition ([8e01ef5](https://github.com/Billos/Sparkleft/commit/8e01ef5685768a6ecb35e1cb4767f8191d023564))

## [2.9.3](https://github.com/Billos/Sparkleft/compare/2.9.2...2.9.3) (2026-02-16)


### Bug Fixes

* Adapts budget ID handling in webhook ([1e008fb](https://github.com/Billos/Sparkleft/commit/1e008fbe8c3aa92b1bb1187c14e5998e8d70132b))
* Updates Firefly III API definition ([8e01ef5](https://github.com/Billos/Sparkleft/commit/8e01ef5685768a6ecb35e1cb4767f8191d023564))

## [2.9.2](https://github.com/Billos/Sparkleft/compare/2.9.1...2.9.2) (2026-02-16)


### Bug Fixes

* Corrects budget trigger log format ([85909f2](https://github.com/Billos/Sparkleft/commit/85909f2d1a2076038cc9c9a96aa9772d87632608))

## [2.9.1](https://github.com/Billos/Sparkleft/compare/2.9.0...2.9.1) (2026-02-16)


### Bug Fixes

* Adds logging for webhook triggers ([60737f1](https://github.com/Billos/Sparkleft/commit/60737f1b1bd26cde26a1ec3a5e34078f11729566))

# [2.9.0](https://github.com/Billos/Sparkleft/compare/2.8.1...2.9.0) (2026-02-14)


### Bug Fixes

* Increasing delay between 2 fails ([cd62e35](https://github.com/Billos/Sparkleft/commit/cd62e35d08dfd6783b98b42e98bd2b0cc699e436))


### Features

* Adds logging to init function in queue jobs ([d28bc2b](https://github.com/Billos/Sparkleft/commit/d28bc2b7759c2e852e25af6bc52c5af63793adbc))

## [2.8.1](https://github.com/Billos/Sparkleft/compare/2.8.0...2.8.1) (2026-02-08)


### Bug Fixes

* Prevents running Paypal job without token ([8ca6673](https://github.com/Billos/Sparkleft/commit/8ca6673ff309dccaf1f5f2d2a6966b61b0677a82))

# [2.8.0](https://github.com/Billos/Sparkleft/compare/2.7.0...2.8.0) (2026-02-04)


### Features

* Adds endpoint job queue ([d907a56](https://github.com/Billos/Sparkleft/commit/d907a562cae053fba8b017cca86a3a7d0a197ec8))
* Adds transaction update jobs ([5338e3d](https://github.com/Billos/Sparkleft/commit/5338e3d3ba7157a431df548be860c16b6b9e3c5b))
* Moves transaction update logic to background jobs. ([ce8b685](https://github.com/Billos/Sparkleft/commit/ce8b6858b526cfa5d24632a172c539be76f3e373))

# [2.7.0](https://github.com/Billos/Sparkleft/compare/2.6.0...2.7.0) (2026-02-01)


### Features

* Cleans up delayed job messages when completed ([b6a33b6](https://github.com/Billos/Sparkleft/commit/b6a33b60422413c6f501bb36babcabf4f67f2db8))

# [2.6.0](https://github.com/Billos/Sparkleft/compare/2.5.2...2.6.0) (2026-01-29)


### Bug Fixes

* Improves job failure messages ([a25626c](https://github.com/Billos/Sparkleft/commit/a25626cd5903e7f9a892effb76d9694338fc1aa9))


### Features

* Delay failed jobs ([f208c1f](https://github.com/Billos/Sparkleft/commit/f208c1f0e52113c78a83d5f12035463d3af1f490))
* Initializes job definitions on worker start ([ee9a4b0](https://github.com/Billos/Sparkleft/commit/ee9a4b024eac5426b93509055ef46205d707af7c))

## [2.5.2](https://github.com/Billos/Sparkleft/compare/2.5.1...2.5.2) (2026-01-29)


### Bug Fixes

* Adds budget limit check job ([ceffb21](https://github.com/Billos/Sparkleft/commit/ceffb2152b6ee91b6c4a6e0cb88168e83a0fbb52))

## [2.5.1](https://github.com/Billos/Sparkleft/compare/2.5.0...2.5.1) (2026-01-23)


### Bug Fixes

* Quick improvment for logs ([82a2a58](https://github.com/Billos/Sparkleft/commit/82a2a580745cc3f9051a704036657e8fd9d0d9cc))

# [2.5.0](https://github.com/Billos/Sparkleft/compare/2.4.0...2.5.0) (2026-01-23)


### Features

* Check Budget Limit is a Job & not done by Update Automatic Budgets ([e9aef3b](https://github.com/Billos/Sparkleft/commit/e9aef3bfa190505b13b80afa3c7d5adfd5094816))
* Move update Bills budget limit to its own job ([88767a7](https://github.com/Billos/Sparkleft/commit/88767a7d270a2b61f4b99941d65b329c6f5e9582))
* Move Update Leftovers Budget limit to its own job ([9af508d](https://github.com/Billos/Sparkleft/commit/9af508d9f835076795b3773cfbe32b1f39022d9e))
* Prepare Budget Jobs ([2317e90](https://github.com/Billos/Sparkleft/commit/2317e9032c9fbca26dd4e1fb7cfdeb8adbfcb77f))
* use budget id rather than name to define Bills Budget ([ddfd20b](https://github.com/Billos/Sparkleft/commit/ddfd20b69a536f6a3b9a0161f38a12328a1fb3d5))
* use leftovers id rather than name to define Leftovers Budget ([9d72cd2](https://github.com/Billos/Sparkleft/commit/9d72cd29ba27fa9c3e9487c03481994fee33cd22))

# [2.4.0](https://github.com/Billos/Sparkleft/compare/2.3.1...2.4.0) (2026-01-22)


### Bug Fixes

* fast return when not needed in paypal linking ([35a489d](https://github.com/Billos/Sparkleft/commit/35a489dee4af5a8609091b9a92d6345d7bf71801))


### Features

* Do not clean the queue at process start and exit as we have deduplication ([11980b5](https://github.com/Billos/Sparkleft/commit/11980b50af18974ffe618ec627953e5d29f68886))

## [2.3.1](https://github.com/Billos/Sparkleft/compare/2.3.0...2.3.1) (2026-01-22)


### Bug Fixes

* Keeping the jobs in Redis, for analytics purpose ([eb1f5c7](https://github.com/Billos/Sparkleft/commit/eb1f5c7c0aa39ae8a8249d429abfb6cca73cbb7e))

# [2.3.0](https://github.com/Billos/Sparkleft/compare/2.2.2...2.3.0) (2026-01-22)


### Bug Fixes

* improve perfs of updateLeftoversBudget ([34e8f93](https://github.com/Billos/Sparkleft/commit/34e8f93c85d41cb9d0a143873c1fda75d2b9998f))
* transactionId is an optionnal parameter of the jobs ([4bcea41](https://github.com/Billos/Sparkleft/commit/4bcea416852f57862a02f8827a16dce25b2ee74f))


### Features

* Allow to check is a message exists in a transactionHandler ([84511c6](https://github.com/Billos/Sparkleft/commit/84511c66f222d45008d5792036fdc3e75a81f28e))
* Create a new message if the transactionHandler does not have the defined id ([a7b208c](https://github.com/Billos/Sparkleft/commit/a7b208c6be6550f92ec24214804b41110a8097d4))
* improve logging of start and end of jobs ([82fdbae](https://github.com/Billos/Sparkleft/commit/82fdbaec04e10e660b5baa8b495fb930b413064b))
* Review delays of jobs ([d2c1c72](https://github.com/Billos/Sparkleft/commit/d2c1c7201bf6e7cc638a647823efc751c0547457))
* Use a proper debounce when trying to start twice the same job ([862676c](https://github.com/Billos/Sparkleft/commit/862676c083d9226c1e8349ab032095553aa423fc))

## [2.2.2](https://github.com/Billos/Sparkleft/compare/2.2.1...2.2.2) (2026-01-20)


### Bug Fixes

* Update LINK_PAYPAL_TRANSACTIONS delay to 40 seconds ([7de0236](https://github.com/Billos/Sparkleft/commit/7de02364bf0cf131ef196d4524456a98e928fd3c))

## [2.2.1](https://github.com/Billos/Sparkleft/compare/2.2.0...2.2.1) (2026-01-19)


### Bug Fixes

* Awaits job execution in worker ([f4f9dee](https://github.com/Billos/Sparkleft/commit/f4f9deefc757f99fccadb7ef0a18c8330d8260f6))

# [2.2.0](https://github.com/Billos/Sparkleft/compare/2.1.0...2.2.0) (2026-01-19)


### Features

* Logs job duration ([8787a90](https://github.com/Billos/Sparkleft/commit/8787a90b412b5c470d3b537516ddc217fc936ac7))

# [2.1.0](https://github.com/Billos/Sparkleft/compare/2.0.0...2.1.0) (2026-01-19)


### Features

* Adds asap option to delay ([81f735c](https://github.com/Billos/Sparkleft/commit/81f735c014796deea782d72a3b2dbfdf15685076))

# [2.0.0](https://github.com/Billos/Sparkleft/compare/1.21.1...2.0.0) (2026-01-18)


### Features

* Renames project to Sparkleft ([0651df4](https://github.com/Billos/Sparkleft/commit/0651df4d7fce37f56462d28547e7c23a914a6917))


### BREAKING CHANGES

* Renames the project from Firefly iii Leftover Manager to Sparkleft.

## [1.21.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.21.0...1.21.1) (2026-01-18)


### Bug Fixes

* Removes debugging logs ([85a53cb](https://github.com/Billos/firefly-iii-leftover-manager/commit/85a53cb4c3ad6fe479039d755a71925818d198fe))

# [1.21.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.20.2...1.21.0) (2026-01-18)


### Bug Fixes

* Enforces no console statements ([9201e04](https://github.com/Billos/firefly-iii-leftover-manager/commit/9201e04aa41625583335bc7a3ad3c9d6006b9564))


### Features

* Adds API token authentication ([1109e3d](https://github.com/Billos/firefly-iii-leftover-manager/commit/1109e3d511e18f53dfabbacd79ab6ec4cb665a20))
* Adds pino logging for improved debugging ([f0c066c](https://github.com/Billos/firefly-iii-leftover-manager/commit/f0c066c0a53ccf39d9974e3b86d3c56e3c861f02))
* Adds webhook verification ([9d67b8f](https://github.com/Billos/firefly-iii-leftover-manager/commit/9d67b8f667dc2147c4fc7c64401225bb80debeff))
* Server Worker architecture ([361c0c0](https://github.com/Billos/firefly-iii-leftover-manager/commit/361c0c0c755c44749fcc2418beae8cc4e1d93714))
* Updates webhook route ([7859932](https://github.com/Billos/firefly-iii-leftover-manager/commit/78599322653dec2d093b4c8d1dbf4c41e040c099))

## [1.20.2](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.20.1...1.20.2) (2026-01-18)


### Bug Fixes

* Centralizes job delay logic ([d7a9518](https://github.com/Billos/firefly-iii-leftover-manager/commit/d7a9518f8e093b11983bcf0ed3fbc7e862984e35))

## [1.20.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.20.0...1.20.1) (2026-01-17)


### Bug Fixes

* Adjusts delays for queue processing ([7b383a0](https://github.com/Billos/firefly-iii-leftover-manager/commit/7b383a0f102768898714daa2273651aad693121c))
* Log delay before adding a job ([53c05cb](https://github.com/Billos/firefly-iii-leftover-manager/commit/53c05cbae78fbe9f082cd77b5bdfe863f361b37d))
* Logs job delay when adding to queue ([7917228](https://github.com/Billos/firefly-iii-leftover-manager/commit/79172282927db12939e373e86a37dd5c3b788d98))

# [1.20.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.19.0...1.20.0) (2026-01-16)


### Bug Fixes

* Avoid double Unbudgeted message for a transaction ([64083ba](https://github.com/Billos/firefly-iii-leftover-manager/commit/64083bad4825f9d3968bd4f62c31253f1e69496c))


### Features

* Delay job executions ([495d7a4](https://github.com/Billos/firefly-iii-leftover-manager/commit/495d7a4bff8bcfa5b44b1dfa4e903d967e1313e0))

# [1.19.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.18.0...1.19.0) (2026-01-15)


### Features

* Prevent duplicate transactionJob entries in queue ([d245e4c](https://github.com/Billos/firefly-iii-leftover-manager/commit/d245e4c27f9c478a3aa10b8380f1162a989230dd))

# [1.18.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.17.3...1.18.0) (2026-01-09)


### Bug Fixes

* **queue:** Forgot to handle the transaction jobs ([8fde8ab](https://github.com/Billos/firefly-iii-leftover-manager/commit/8fde8ab1569f18ba23e16b0b5dec859f3756eb0b))


### Features

* **webhook:** Adds ANY trigger as transaction jobs ([253e77b](https://github.com/Billos/firefly-iii-leftover-manager/commit/253e77b3c9fb2c2b63db9108078b004f7bf4cb5d))

## [1.17.3](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.17.2...1.17.3) (2026-01-08)


### Bug Fixes

* **webhook:** Corrects webhook job execution ([18c9c5d](https://github.com/Billos/firefly-iii-leftover-manager/commit/18c9c5d320bb39a5a0c03b542687a460dee6176b))

## [1.17.2](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.17.1...1.17.2) (2026-01-06)


### Bug Fixes

* disable webhooks when setting transaction category ([8b14244](https://github.com/Billos/firefly-iii-leftover-manager/commit/8b142441ee9ae186dae11e0d67702fe4d85d6013))
* prevent webhooks from firing when setting transaction category ([93dd994](https://github.com/Billos/firefly-iii-leftover-manager/commit/93dd994b93e8cb4193f5bebb3d4de1ee3e27cfb1))

## [1.17.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.17.0...1.17.1) (2026-01-03)


### Bug Fixes

* Smaller docker size ([0a6cba0](https://github.com/Billos/firefly-iii-leftover-manager/commit/0a6cba0eb3b56d10191fb995788060f48228800c))

# [1.17.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.16.3...1.17.0) (2026-01-03)


### Bug Fixes

* npm install ([435c34b](https://github.com/Billos/firefly-iii-leftover-manager/commit/435c34b091d050b15a6bddd54a4a5a5a553ea9d4))


### Features

* Github Actions ([afd45f4](https://github.com/Billos/firefly-iii-leftover-manager/commit/afd45f4041e9d0be343bc351fd3012405ddf898f))

## [1.16.3](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.16.2...1.16.3) (2025-12-18)


### Bug Fixes

* **queue:** add options to remove jobs on completion or failure ([5b1513d](https://github.com/Billos/firefly-iii-leftover-manager/commit/5b1513dbaf47c3ffe2a7f24428f1c000c96718cb))
* **queue:** ensure obliteration of jobs is forced during queue initialization ([59f3206](https://github.com/Billos/firefly-iii-leftover-manager/commit/59f320667159369183ba977ea7f0f2dae44e88d5))
* **transaction:** add alert message type and improve job failure handling ([0aed227](https://github.com/Billos/firefly-iii-leftover-manager/commit/0aed2277a2d3b7a9c92cd50bb8775cb45430d1cb))

## [1.16.2](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.16.1...1.16.2) (2025-12-18)


### Bug Fixes

* **budget:** disable webhook notifications when updating budget limits ([0de256a](https://github.com/Billos/firefly-iii-leftover-manager/commit/0de256a426e2210e230914a1847fd7dab82020da))
* **lint:** ignore types ([bcf1363](https://github.com/Billos/firefly-iii-leftover-manager/commit/bcf136392f50719075c92e43372bb78f23681947))

## [1.16.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.16.0...1.16.1) (2025-12-18)


### Bug Fixes

* **queue:** remove options to delete jobs on completion or failure,  just keeping the max 5K limit ([6a645ae](https://github.com/Billos/firefly-iii-leftover-manager/commit/6a645ae965e7d743292017287df10522629a5a03))

# [1.16.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.15.0...1.16.0) (2025-12-16)


### Bug Fixes

* **unbudgetedTransactions:** correct variable name for budgets retrieval ([fa91ce6](https://github.com/Billos/firefly-iii-leftover-manager/commit/fa91ce658cd80de8c0375b1c938cc492d423a099))


### Features

* **queue:** add options to remove jobs on completion or failure ([1c18e37](https://github.com/Billos/firefly-iii-leftover-manager/commit/1c18e377c52c68332ec07e191aee6a67cfdcad74))

# [1.15.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.14.5...1.15.0) (2025-09-27)


### Features

* **budget:** implement reviewBudgetLimit function ([065ef85](https://github.com/Billos/firefly-iii-leftover-manager/commit/065ef8510790e86432189bdd140c2c62b644c2c7))
* **transactionHandler:** add notify method and implementation in Discord and Gotify handlers ([ea1d3f1](https://github.com/Billos/firefly-iii-leftover-manager/commit/ea1d3f1ac3875ad8a7a2879db5b587540174c57f))
* **updateAutomaticBudgets:** add review for underbudgeted budgets ([18a1d1a](https://github.com/Billos/firefly-iii-leftover-manager/commit/18a1d1a519dffa642cc9e2a9f20526130a35114b))

## [1.14.5](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.14.4...1.14.5) (2025-09-13)


### Bug Fixes

* **updateBudgets:** prevent unnecessary updates if amount is unchanged ([58c2f3f](https://github.com/Billos/firefly-iii-leftover-manager/commit/58c2f3f17c360d81dea5676a35a1e902e0dab0b3))

## [1.14.4](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.14.3...1.14.4) (2025-09-06)


### Bug Fixes

* **updateLeftoversBudget:** remove unused import for InsightGroup ([6d677b1](https://github.com/Billos/firefly-iii-leftover-manager/commit/6d677b14783e009aefc55891d51777733600e9d7))
* **updateLeftoversBudget:** repair leftover budget compute ([3624038](https://github.com/Billos/firefly-iii-leftover-manager/commit/3624038160053201d79e0ba6b13b8755c92280d0))

## [1.14.4](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.14.3...1.14.4) (2025-09-06)


### Bug Fixes

* **updateLeftoversBudget:** repair leftover budget compute ([3624038](https://github.com/Billos/firefly-iii-leftover-manager/commit/3624038160053201d79e0ba6b13b8755c92280d0))

## [1.14.3](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.14.2...1.14.3) (2025-08-31)


### Bug Fixes

* **budget:** leftover budget is computed even if budgets have no expenses yet ([990201f](https://github.com/Billos/firefly-iii-leftover-manager/commit/990201f809b7660ec7db3dc4d7dc52e5994aaed2))

## [1.14.2](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.14.1...1.14.2) (2025-08-25)


### Bug Fixes

* **API:** update API clients ([99dfcd0](https://github.com/Billos/firefly-iii-leftover-manager/commit/99dfcd012abe5f8f3088bd19853de92d3d4a7e96))
* **budget:** integrate InsightService for accurate budget calculations in updateLeftoversBudget function ([62663a1](https://github.com/Billos/firefly-iii-leftover-manager/commit/62663a18fed63fdebd910b425ef3b26304b169fd))
* **budget:** safe call to update a budget limit ([c20f8c3](https://github.com/Billos/firefly-iii-leftover-manager/commit/c20f8c358f568fea755dbd7248bd52390090eadc))
* **lint:** repair lint ([3edbb26](https://github.com/Billos/firefly-iii-leftover-manager/commit/3edbb26a42005968fab66613ba06fe8ab60f6c4a))

## [1.14.2](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.14.1...1.14.2) (2025-08-25)


### Bug Fixes

* **API:** update API clients ([99dfcd0](https://github.com/Billos/firefly-iii-leftover-manager/commit/99dfcd012abe5f8f3088bd19853de92d3d4a7e96))
* **budget:** integrate InsightService for accurate budget calculations in updateLeftoversBudget function ([62663a1](https://github.com/Billos/firefly-iii-leftover-manager/commit/62663a18fed63fdebd910b425ef3b26304b169fd))
* **budget:** safe call to update a budget limit ([c20f8c3](https://github.com/Billos/firefly-iii-leftover-manager/commit/c20f8c358f568fea755dbd7248bd52390090eadc))

## [1.14.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.14.0...1.14.1) (2025-07-31)


### Bug Fixes

* **budget:** handle missing spent amount correctly in updateLeftoversBudget function ([8399b31](https://github.com/Billos/firefly-iii-leftover-manager/commit/8399b31c7ed45c9d1d03ab5ee0946f92fdd7811f))

# [1.14.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.13.0...1.14.0) (2025-07-31)


### Features

* **date:** replace DateTime with getDateNow utility for date handling ([813393d](https://github.com/Billos/firefly-iii-leftover-manager/commit/813393d3f2c476aa2035e32b285a6dadf6ec53e8))

# [1.13.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.12.0...1.13.0) (2025-07-31)


### Features

* **date:** new function to get a Date ([f95b28d](https://github.com/Billos/firefly-iii-leftover-manager/commit/f95b28d7e38edd7306f438a4a20da2da18fe4920))

# [1.12.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.11.1...1.12.0) (2025-07-23)


### Features

* **transactions:** stop updating messages in TransactionHandler ([9a16aa9](https://github.com/Billos/firefly-iii-leftover-manager/commit/9a16aa90bc4611c5eccd2e9ee7c3be10ecbbbe10))

## [1.11.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.11.0...1.11.1) (2025-06-24)


### Bug Fixes

* **linkPaypalTransactions:** filter unlinked transactions by type and improve logging ([de722f3](https://github.com/Billos/firefly-iii-leftover-manager/commit/de722f326843135e3c8bd157120afa074cf85555))

# [1.11.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.10.0...1.11.0) (2025-06-24)


### Bug Fixes

* **messages:** deleteAllMessages at service init ([d07878e](https://github.com/Billos/firefly-iii-leftover-manager/commit/d07878edbc1beb1e1fe28684e9d981659c663a39))


### Features

* **BullMQ:** integrate BullMQ for task management and add Redis configuration ([26f9f5d](https://github.com/Billos/firefly-iii-leftover-manager/commit/26f9f5de9a1599cfbf6ec142647903bfda0ee5a7))

# [1.10.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.9.3...1.10.0) (2025-06-23)


### Bug Fixes

* **getTransactionShowLink:** update service URL to use env.serviceUrl ([ccc609b](https://github.com/Billos/firefly-iii-leftover-manager/commit/ccc609b8a44291b0d7be1aa953c53c53eee3a1b8))
* **gotify:** dynamic title assignment in sendMessageImpl based on message type ([294db41](https://github.com/Billos/firefly-iii-leftover-manager/commit/294db412437afcf382c4acd2080d02a50f7a3300))
* **gotify:** handle potential errors when deleting messages in updateMessageImpl ([2739a45](https://github.com/Billos/firefly-iii-leftover-manager/commit/2739a45247566eafe17eb81c1431732775cf4e93))
* **link:** revert using the bad url ([818741d](https://github.com/Billos/firefly-iii-leftover-manager/commit/818741dc5955372f248c4d164f60e582a0e4ed68))
* **settingBudgetForTransaction:** ensure proper response handling when transaction is not found ([873abae](https://github.com/Billos/firefly-iii-leftover-manager/commit/873abaebd3e776c1e70b4bbe567ee144c11d469c))
* **settingBudgetForTransaction:** remove duplicate response handling when transaction is not found ([b3f986a](https://github.com/Billos/firefly-iii-leftover-manager/commit/b3f986a8b37a62fce27511856a542287aedeed26))


### Features

* **message:** multiple message types ([cb60dfc](https://github.com/Billos/firefly-iii-leftover-manager/commit/cb60dfc5c10d073a73830561a6f923c0d5827997))
* **transaction:** handle uncategorized transactions ([886a9b3](https://github.com/Billos/firefly-iii-leftover-manager/commit/886a9b37e818383da3fda45085436c206575941d))
* **transaction:** move getTransactionShowLink function to its own module ([2d7900b](https://github.com/Billos/firefly-iii-leftover-manager/commit/2d7900b54b47ab5704ea9f8f3c78263e496fce94))

## [1.9.3](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.9.2...1.9.3) (2025-06-18)


### Bug Fixes

* **linkPaypalTransactions:** improve logging for unlinked Paypal transactions ([ba30f7d](https://github.com/Billos/firefly-iii-leftover-manager/commit/ba30f7d7cc378c32bcd23f768fe74fe2279570c4))
* **linkPaypalTransactions:** refine filtering of Firefly III transactions to include only those with "PayPal" in the description ([72b1e88](https://github.com/Billos/firefly-iii-leftover-manager/commit/72b1e88c1e566b8eba4b1b808023af980cc79f05))
* **linkPaypalTransactions:** update start date to 20 days ago for transaction retrieval ([8ddad55](https://github.com/Billos/firefly-iii-leftover-manager/commit/8ddad55a97c1d1bd1e998416bcf7ad9b4b1ed6b8))

## [1.9.2](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.9.1...1.9.2) (2025-04-27)


### Bug Fixes

* **transaction:** handle message deletion error gracefully ([d9f718c](https://github.com/Billos/firefly-iii-leftover-manager/commit/d9f718c66d3ebfb065fe4d2b0f007839b8bba89a))

## [1.9.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.9.0...1.9.1) (2025-04-02)


### Bug Fixes

* **updateBillsBudgetLimit:** refactor budget limit handling and improve limit creation logic ([49cea4c](https://github.com/Billos/firefly-iii-leftover-manager/commit/49cea4c2ed264d4b79cea3ede65ce60baaac7daf))
* **updateLeftoversBudget:** enhance budget limit creation and update logic ([0e83741](https://github.com/Billos/firefly-iii-leftover-manager/commit/0e837417e666b1a61f563ba80ed868782e863c8f))

# [1.9.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.13...1.9.0) (2025-03-31)


### Bug Fixes

* **linkPaypalTransactions:** adjust date range and improve transaction filtering ([bfa7859](https://github.com/Billos/firefly-iii-leftover-manager/commit/bfa78596a35ed922afd7b69b594e648709fddf01))
* **updateLeftoversBudget:** handle negative budget leftover correctly ([2df445f](https://github.com/Billos/firefly-iii-leftover-manager/commit/2df445f571d3780cdd1cdc456935782e67e5b7df))


### Features

* **CodeQL:** Create codeql.yml ([bdde612](https://github.com/Billos/firefly-iii-leftover-manager/commit/bdde612d0ac12b6f4c3ea6f8b1c7edb6ba916a87))

## [1.8.13](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.12...1.8.13) (2025-02-22)


### Bug Fixes

* **deps:** remove tslog from dependencies ([30b22d3](https://github.com/Billos/firefly-iii-leftover-manager/commit/30b22d3e2138709dfeaa0e345eb6559cd57263ad))
* **docker:** expose port 3000 in Dockerfile ([28ba50f](https://github.com/Billos/firefly-iii-leftover-manager/commit/28ba50f4586e7d5c4cc1383da5bfd0554df91380))
* **docker:** update Dockerfile for production image and change entrypoint to npm ([6c4ab75](https://github.com/Billos/firefly-iii-leftover-manager/commit/6c4ab754962f759ea7d12867e57f01c82a7778c7))
* **scripts:** use --no-cache option in docker build command ([08c6b5a](https://github.com/Billos/firefly-iii-leftover-manager/commit/08c6b5a635f8fe19f732228dd53a44ad2d892a4f))
* **tsconfig:** update module and moduleResolution to NodeNext, exclude build directory ([34caca3](https://github.com/Billos/firefly-iii-leftover-manager/commit/34caca373129fcbc229facd7aade5c2fa27e6bd0))

## [1.8.12](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.11...1.8.12) (2025-02-22)


### Bug Fixes

* **docker:** copy node_modules from builder stage to optimize Docker image ([8335bf1](https://github.com/Billos/firefly-iii-leftover-manager/commit/8335bf1463b95c195dc4a5dd8b3b97a0de2b6995))

## [1.8.11](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.10...1.8.11) (2025-02-22)


### Bug Fixes

* **docker:** update Node.js version and optimize Dockerfile for multi-stage builds ([e108bf1](https://github.com/Billos/firefly-iii-leftover-manager/commit/e108bf11a40bb6a5761b9a1b1910b9425beaed2b))

## [1.8.10](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.9...1.8.10) (2025-02-13)


### Bug Fixes

* **budget:** budget limit is the LeftOver + already spent ([67995bb](https://github.com/Billos/firefly-iii-leftover-manager/commit/67995bb65e9ccff6d7bf08addf7f6f31dcc667dd))

## [1.8.9](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.8...1.8.9) (2025-02-11)


### Bug Fixes

* **budget:** filter inactive bills when updating budget limits ([8b82e51](https://github.com/Billos/firefly-iii-leftover-manager/commit/8b82e5126406abc921243c0b2f133255790ca672))
* **budget:** improve leftover budget calculation using the leftover of this budget ([0caaf5d](https://github.com/Billos/firefly-iii-leftover-manager/commit/0caaf5d1186711b9b3ec5d4c6583509d53c69190))
* **budget:** update auto budgets at start ([832b487](https://github.com/Billos/firefly-iii-leftover-manager/commit/832b4872ec78d54e552d75f436ef95a8f4073d02))

## [1.8.8](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.7...1.8.8) (2025-02-09)


### Bug Fixes

* **transaction:** Setting a budget redirects to the transaction show page ([acb8a88](https://github.com/Billos/firefly-iii-leftover-manager/commit/acb8a889522cf2f74daba2808dd100225e67ee46))

## [1.8.7](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.6...1.8.7) (2025-02-09)


### Bug Fixes

* **transaction:** do not regular check the unbudgeted transactions if they already have a specified messageId ([ad93434](https://github.com/Billos/firefly-iii-leftover-manager/commit/ad93434a171b8745dbd62a38ddf7aebf9e3b3b3a))

## [1.8.6](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.5...1.8.6) (2025-02-06)


### Bug Fixes

* **checkUnbudgetedTransactions:** rename file and implement hourly check for unbudgeted transactions ([1617a4a](https://github.com/Billos/firefly-iii-leftover-manager/commit/1617a4a82c1f618470e5510f45cc35828760b043))

## [1.8.5](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.4...1.8.5) (2025-02-05)


### Bug Fixes

* **transaction:** add periodic check for unbudgeted transactions ([8282785](https://github.com/Billos/firefly-iii-leftover-manager/commit/8282785a6d79f5eb7453c6ca5e7d76b1374f9553))

## [1.8.4](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.3...1.8.4) (2025-02-02)


### Bug Fixes

* **checkUnbudgetedTransactions:** update link format and message separator ([f43e212](https://github.com/Billos/firefly-iii-leftover-manager/commit/f43e212c30977e3c299c63408aab0a227f3316b6))

## [1.8.3](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.2...1.8.3) (2025-02-02)


### Bug Fixes

* **checkUnbudgetedTransactions:** open transaction link in a new tab ([a3fe6a0](https://github.com/Billos/firefly-iii-leftover-manager/commit/a3fe6a0e2cdffe800ec235a1afe96e9f77c5c44a))

## [1.8.2](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.1...1.8.2) (2025-02-02)


### Bug Fixes

* **checkUnbudgetedTransactions:** validate transaction type as withdrawal before processing ([ecf45b2](https://github.com/Billos/firefly-iii-leftover-manager/commit/ecf45b2230efa325985d51e1ae5ea9cecb2304f2))
* **config:** add assetAccountId to configuration ([7b62cdb](https://github.com/Billos/firefly-iii-leftover-manager/commit/7b62cdb3cb3b99e087288819cb8f6d8cc7f8d39d))
* **env:** clean config ([8c26c68](https://github.com/Billos/firefly-iii-leftover-manager/commit/8c26c68bfff707c2a2551c88873e323797af2572))
* **updateLeftoversBudget:** set leftover amount to 0.1 if negative ([6aaf9a9](https://github.com/Billos/firefly-iii-leftover-manager/commit/6aaf9a9248372a3a4e6e8742914b1ddd0d538c12))
* **updateLeftoversBudget:** using asset account balance to compute leftover amount ([6a901e9](https://github.com/Billos/firefly-iii-leftover-manager/commit/6a901e9e62d5fcf9c7e4e998644f5fc082c70fdd))

## [1.8.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.8.0...1.8.1) (2025-02-01)


### Bug Fixes

* **BudgetsService:** correct URL for fetching transactions without budget ([4016136](https://github.com/Billos/firefly-iii-leftover-manager/commit/401613610ce5b3ab24386dae6870364112c418cb))
* **checkUnbudgetedTransactions:** Using the transaction Without budget api rather than computing those ourself ([a54dffd](https://github.com/Billos/firefly-iii-leftover-manager/commit/a54dffd82339441c63086d35908f40ec92312ffc))
* **request:** handle response parsing for string and object types ([dbe82f0](https://github.com/Billos/firefly-iii-leftover-manager/commit/dbe82f076dba9412ab8bfa51e78288f180fd7530))

# [1.8.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.7.1...1.8.0) (2025-02-01)


### Bug Fixes

* **OpenAPI:** update BASE URL to include /api path ([67c3b6a](https://github.com/Billos/firefly-iii-leftover-manager/commit/67c3b6a757dc0adc0288106ed0257105bdaa8fbe))


### Features

* **checkUnbudgetedTransactions:** add transaction link to message output ([6667844](https://github.com/Billos/firefly-iii-leftover-manager/commit/666784412c5f02d70426ba041a4382f0efa67dda))

## [1.7.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.7.0...1.7.1) (2025-02-01)


### Bug Fixes

* **updateLeftoversBudget:** prevent updating budget with negative leftover amount ([d66e1dc](https://github.com/Billos/firefly-iii-leftover-manager/commit/d66e1dc05db343e29c3c4c2e111d9ad2b8b3826b))

# [1.7.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.6.0...1.7.0) (2025-01-31)


### Features

* **webhooks:** add transaction webhook endpoint and check unbudgeted transaction ([ff83a1c](https://github.com/Billos/firefly-iii-leftover-manager/commit/ff83a1c3d20a8067f6ccdeeab114c555d028f0b8))

# [1.6.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.5.1...1.6.0) (2025-01-31)


### Features

* **transactionHandler:** add Gotify integration for unbudgeted transaction notifications ([bbf512e](https://github.com/Billos/firefly-iii-leftover-manager/commit/bbf512e2c61daadf2bf800ee2d0f7635e5db9a6b))

## [1.5.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.5.0...1.5.1) (2025-01-23)


### Bug Fixes

* **checkUnbudgetedTransactions:** update deleteDiscordMessage to accept transactionId and adjust route parameters ([686a581](https://github.com/Billos/firefly-iii-leftover-manager/commit/686a581516f874d4b3ef0d4bd1b5389ce08008b2))

# [1.5.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.4.0...1.5.0) (2025-01-23)


### Bug Fixes

* **checkUnbudgetedTransactions:** add error handling for Discord message updates ([470771c](https://github.com/Billos/firefly-iii-leftover-manager/commit/470771c49055f88f2891dd6ddd68e61098bedb12))
* **checkUnbudgetedTransactions:** filter out specific budgets from the list ([b685e57](https://github.com/Billos/firefly-iii-leftover-manager/commit/b685e57f5edf4a7ec585668ee10f175179c9122c))
* **discord:** change message ID type from number to string in Discord message functions ([2d96302](https://github.com/Billos/firefly-iii-leftover-manager/commit/2d96302ecbb278f9a12464b3f1350ad8dc8cb270))


### Features

* **checkUnbudgetedTransactions:** manage Discord message IDs in transaction notes ([4c13aba](https://github.com/Billos/firefly-iii-leftover-manager/commit/4c13aba59467cb1d00497361ff51066c2493da03))

# [1.4.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.3.1...1.4.0) (2025-01-22)


### Bug Fixes

* **index:** simplify logging for budget setting in transaction ([b903598](https://github.com/Billos/firefly-iii-leftover-manager/commit/b90359810fbdee8d92035046b5b4e71e4166e027))


### Features

* **paypal:** Add API types for a Paypal account ([b7c926f](https://github.com/Billos/firefly-iii-leftover-manager/commit/b7c926f0f086d8f56711b214e72713b0e37bfecf))
* **paypal:** Link paypal transactions ([d601839](https://github.com/Billos/firefly-iii-leftover-manager/commit/d6018396bf3e91ef7b609bfefc46f9076ea1ee6d))

## [1.3.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.3.0...1.3.1) (2025-01-21)


### Bug Fixes

* **index:** remove unused sleep utility import ([ae7efc9](https://github.com/Billos/firefly-iii-leftover-manager/commit/ae7efc9a534eaa8f84a33eb2676e08bea489cebd))
* **transactions:** streamline transaction update process and improve response handling ([1bf95b2](https://github.com/Billos/firefly-iii-leftover-manager/commit/1bf95b26fda608f941fa4a244172d8117c1554b9))

## [1.3.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.3.0...1.3.1) (2025-01-21)


### Bug Fixes

* **transactions:** streamline transaction update process and improve response handling ([1bf95b2](https://github.com/Billos/firefly-iii-leftover-manager/commit/1bf95b26fda608f941fa4a244172d8117c1554b9))

# [1.3.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.2.0...1.3.0) (2025-01-21)


### Features

* **transactions:** add sleep utility and improve Discord message handling ([d11b0da](https://github.com/Billos/firefly-iii-leftover-manager/commit/d11b0da51b74bf5ec08381edbd215da07e4a3b45))

# [1.2.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.1.0...1.2.0) (2025-01-18)


### Features

* **discord:** enhance message handling with update and delete functionality ([efdcb2a](https://github.com/Billos/firefly-iii-leftover-manager/commit/efdcb2a1bf5480a51ac08527cc07811f72b6d9d6))

# [1.1.0](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.0.1...1.1.0) (2025-01-18)


### Features

* **index:** update response handling and refactor request parameters ([1f89954](https://github.com/Billos/firefly-iii-leftover-manager/commit/1f89954b769b58b1a6278e61df50258ab367d55b))
* **no-budget:** add no-budget transactions check and notification ([94e5ff5](https://github.com/Billos/firefly-iii-leftover-manager/commit/94e5ff5dd4b9bc1b4876a03f0ed3b41a30ef2687))
* **transactions:** add service URL and update unbudgeted transactions handling ([d0abd05](https://github.com/Billos/firefly-iii-leftover-manager/commit/d0abd05df2c129780bab4cab8e573f7d5a4c6ee0))

## [1.0.1](https://github.com/Billos/firefly-iii-leftover-manager/compare/1.0.0...1.0.1) (2025-01-08)


### Bug Fixes

* **api:** Add POST method to trigger endpoint ([8e02ced](https://github.com/Billos/firefly-iii-leftover-manager/commit/8e02ceda5a3f8304f8ef9e88ec74d48b47901bb9))

# 1.0.0 (2025-01-07)


### Bug Fixes

* **docker:** Add env_file to development configuration ([64fb383](https://github.com/Billos/firefly-iii-leftover-manager/commit/64fb3837420afb1fda762ecb4b1d1216ea479d5a))
* **package:** Update repository field format in package.json ([36b9116](https://github.com/Billos/firefly-iii-leftover-manager/commit/36b9116c8021514fac897e78b9241d463902fcd7))
* **release:** Remove npm plugin from release configuration ([e9966d1](https://github.com/Billos/firefly-iii-leftover-manager/commit/e9966d190d94c29fddb20ac2f7ca64c91d5427f3))


### Features

* **API:** Import FireflyIII types ([8a736c1](https://github.com/Billos/firefly-iii-leftover-manager/commit/8a736c164f1dc40644fa5db801ca3db9d83a56cd))
* **Budget:** Compute Bills and Leftover budgets amounts ([de542cf](https://github.com/Billos/firefly-iii-leftover-manager/commit/de542cf3ad0342914179cf865d8da3be74119313))
* **OpenAPI:** Update base URL and headers to use environment variables to use the OpenAPI provided functions ([d38f33d](https://github.com/Billos/firefly-iii-leftover-manager/commit/d38f33d1ef5680f78862aa792cdff0dc0ec9d40b))
