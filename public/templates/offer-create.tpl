<section class="page__part--offer-create">
    
    <header class="page__part__header">
        <h2>{{ i18n.common.lastestOffers }}</h2>
    </header>

    <form class="page__part__content">
        <fieldset>
            <legend>{{ i18n.offer.add }}</legend>

            <div class="offer-create__title">
            	<label for="offer-create__title">{{ i18n.offer.create.title }}</label>
            	<input id="offer-create__title" type="text" value="" placeholder="{{ i18n.offer.create.example.title }}" ng-model="offer.template.title" />
            </div>

            <div class="offer-create__description">
            	<label for="offer-create__description">{{ i18n.offer.create.description }}</label>
            	<textarea id="offer-create__description" type="text" value="" placeholder="{{ i18n.offer.create.example.description }}" ng-model="offer.template.description" ></textarea>
            </div>

            <div class="offer-create__recipe">
                <label for="offer-create__recipe">{{ i18n.offer.create.recipe }}</label>
                <input id="offer-create__recipe" type="text" value="" placeholder="{{ i18n.offer.create.example.recipe }}" ng-model="offer.template.recipe" />
            </div>

            <div class="offer-create__place">
                <label for="offer-create__place">{{ i18n.offer.create.place }}</label>
                <input id="offer-create__place" type="text" value="" placeholder="{{ i18n.offer.create.example.place }}" ng-model="offer.place" />
            </div>

            <div class="offer-create__tags">
            	<label for="offer-create__tags">{{ i18n.offer.create.tags }}</label>
            	<input id="offer-create__tags" type="text" value="" placeholder="{{ i18n.offer.create.example.tags }}" ng-model="offer.template.tags" />
            </div>

			<div class="offer-create__start-end">
            	<label for="offer-create__start">{{ i18n.offer.create.start }}</label>
            	<input id="offer-create__start" type="date" value="{{ defaultStartDate }}" ng-model="offer.startAt" />

            	<label for="offer-create__end">{{ i18n.offer.create.end }}</label>
            	<input id="offer-create__end" type="date" value="{{ defaultEndDate }}" ng-model="offer.endAt" />
            </div>            

            <button class="offer-create__submit" ng-click="addOffer()" ng-disabled="!templateFullfilled()">{{ i18n.offer.create.submit }}</button>
    	</fieldset>
    </form>
    	
</section>